<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request; 
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use App\Service\ImageService;
use App\Service\TokenService;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

#[Route('/api/images', name: 'api-images-')]
class ImageController extends AbstractController
{
    private ImageService $imageService;
    private JWTTokenManagerInterface $jwtManager;
    private TokenService $tokenService;
    private EntityManagerInterface $entityManager;
    private TokenStorageInterface $tokenStorage;

    public function __construct(ImageService $imageService, TokenService $tokenService, JWTTokenManagerInterface $jwtManager, EntityManagerInterface $entityManager, TokenStorageInterface $tokenStorage)
    {
        $this->imageService = $imageService;
        $this->tokenService = $tokenService;
        $this->jwtManager = $jwtManager;
        $this->entityManager = $entityManager;
        $this->tokenStorage = $tokenStorage;
    }

    #[Route('', name: 'list', methods: ['GET'])]
    public function list(): Response
    {
        if (!$this->isGranted('ROLE_USER')) {
            throw new AccessDeniedException();
        }
        try {
            return $this->imageService->list();
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/read/{id}', name: 'read', methods: ['GET'])] 
    public function read(Request $request): Response
    {
        if (!$this->isGranted('ROLE_USER')) {
            throw new AccessDeniedException();
        }
        try {
            $id = $request->attributes->get('id');
            return $this->imageService->read($id);
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/getOnlyUnalidated', name: 'getOnlyUnvalidated', methods: ['GET'])]
    public function getOnlyUnvalidated(): Response
    {
        if (!$this->isGranted('ROLE_ADMIN')) {
            throw new AccessDeniedException();
        }
        try {
            return $this->imageService->getOnlyUnvalidated();
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/validate', name: 'validate', methods: ['POST'])]
    public function validate(Request $request): Response
    {
        if (!$this->isGranted('ROLE_ADMIN')) {
            throw new AccessDeniedException();
        }
        try {
            $data = json_decode($request->getContent(), true);
            return $this->imageService->validate($data);
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/deny', name: 'deny', methods: ['POST'])]
    public function deny(Request $request): Response
    {
        if (!$this->isGranted('ROLE_ADMIN')) {
            throw new AccessDeniedException();
        }
        try {
            $data = json_decode($request->getContent(), true);
            return $this->imageService->deny($data);
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/delete', name:'delete', methods: ['DELETE'])]
    public function delete(Request $request): Response
    {
        if (!$this->isGranted('ROLE_ADMIN')) {
            throw new AccessDeniedException();
        }
        try {
            return $this->imageService->delete($request->getContent());
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/create', name: 'create', methods: ['POST'])]
    public function create(Request $request): Response
    {
        if (!$this->isGranted('ROLE_USER')) {
            throw new AccessDeniedException();
        }
    
        $user = $this->tokenService->getUserFromToken();
    
        $file = $request->files->get('image');
        if (!$file) {
            return new JsonResponse("Aucun fichier n'a été fourni.", Response::HTTP_BAD_REQUEST);
        }
    
        $data = [
            'title' => $request->request->get('title'),
            'description' => $request->request->get('description'),
        ];
    
        if (empty($data['title']) || empty($data['description'])) {
            return new JsonResponse("Les champs 'title' et 'description' sont requis.", Response::HTTP_BAD_REQUEST);
        }
    
        try {
            return $this->imageService->create($file, $user, $data);
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/toggleLike', name:'toggleLike', methods: ['POST'])]
    public function toggleLike(Request $request): Response {

        if (!$this->isGranted('ROLE_USER')) {
            throw new AccessDeniedException();
        }

        $user = $this->tokenService->getUserFromToken();

        $data = json_decode($request->getContent(), true);

        return $this->imageService->toggleLike($data, $user);
    }

    #[Route('/newComment', name: 'newComment', methods: ['POST'])]
    public function newComment(Request $request): Response
    {
        if (!$this->isGranted('ROLE_USER')) {
            throw new AccessDeniedException();
        }
    
        $user = $this->tokenService->getUserFromToken();
        $data = json_decode($request->getContent(), true);
    
        return $this->imageService->newComment($data, $user);
    }

    #[Route('/deleteComment', name: 'deleteComment', methods: ['DELETE'])]
    public function deleteComment(Request $request): Response
    {
        if (!$this->isGranted('ROLE_ADMIN')) {
            throw new AccessDeniedException();
        }
    
        $data = json_decode($request->getContent(), true);
    
        return $this->imageService->deleteComment($data);
    }
}
