<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request; 
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use App\Service\ArticleService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/articles', name: 'api-articles-')]
class ArticleController extends AbstractController
{
    private ArticleService $articleService;

    public function __construct(ArticleService $articleService)
    {
        $this->articleService = $articleService;
    }

    #[Route('', name: 'list', methods: ['GET'])]
    public function list(): Response
    {
        if (!$this->isGranted('ROLE_USER')) {
            throw new AccessDeniedException();
        }
        try {
            return $this->articleService->list();
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
            return $this->articleService->read($id);
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

}
