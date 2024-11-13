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
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

#[Route('/api/images', name: 'api-images-')]
class ImageController extends AbstractController
{
    private ImageService $imageService;
    private JWTTokenManagerInterface $jwtManager;
    private EntityManagerInterface $entityManager;
    private TokenStorageInterface $tokenStorage;

    public function __construct(ImageService $imageService, JWTTokenManagerInterface $jwtManager, EntityManagerInterface $entityManager, TokenStorageInterface $tokenStorage)
    {
        $this->imageService = $imageService;
        $this->jwtManager = $jwtManager;
        $this->entityManager = $entityManager;
        $this->tokenStorage = $tokenStorage; // Injection du TokenStorageInterface
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

    #[Route('/create', name:'create', methods: ['POST'])]
    public function create(Request $request): Response
    {
        if (!$this->isGranted('ROLE_USER')) {
            throw new AccessDeniedException();
        }

        $token = $this->tokenStorage->getToken();
        if ($token === null) {
            return new JsonResponse("Token not provided.", Response::HTTP_UNAUTHORIZED);
        }

        $decodedJwtToken = $this->jwtManager->decode($token);

        $file = $request->files->get('image');
        $data = $request->request->all();
        if (!$file) {
            return new JsonResponse("No file uploaded.", Response::HTTP_BAD_REQUEST);
        }

        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $decodedJwtToken['email']]);
        if (!$user) {
            return new JsonResponse("User not found.", Response::HTTP_NOT_FOUND);
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

        $token = $this->tokenStorage->getToken();
        if ($token === null) {
            return new JsonResponse("Token not provided.", Response::HTTP_UNAUTHORIZED);
        }

        $decodedJwtToken = $this->jwtManager->decode($token);

        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $decodedJwtToken['email']]);

        if (!$user) {
            return new JsonResponse("User not found.", Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        return $this->imageService->toggleLike($data, $user);
    }
}
