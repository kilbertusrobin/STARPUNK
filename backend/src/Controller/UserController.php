<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Repository\UserRepository;
use App\Service\UserService;
use App\Controller\ApiController;
use Symfony\Component\HttpFoundation\Request; 
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use App\Service\TokenService;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/users', name: 'api-users-')]
class UserController extends ApiController
{
    private UserService $userService;
    private TokenService $tokenService;

    public function __construct(UserService $userService, TokenService $tokenService)
    {
        $this->userService = $userService;
        $this->tokenService = $tokenService;
    }
    
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(): Response
    {
        if (!$this->isGranted('ROLE_USER')) {
            throw $this->createAccessDeniedException();
        }
        try {
            return $this->userService->list();
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/read/{id}', name: 'read', methods: ['GET'])] 
    public function read(Request $request): Response
    {
        if (!$this->isGranted('ROLE_USER')) {
            throw $this->createAccessDeniedException();
        }
        try {
            $id = $request->attributes->get('id');
            return $this->userService->read($id);
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/create', name: 'create', methods: ['POST'])]
    public function create(Request $request): Response
    {
        try {
            return $this->userService->create($request);
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/testRefreshToken', name: 'testRefreshToken', methods: ['GET'])] 
    public function testRefreshToken(): Response
    {
        try {
            $user = $this->tokenService->getUserFromToken();
            $refreshToken = $this->tokenService->generateRefreshToken($user);
            
            return new JsonResponse([
                'token' => $refreshToken->getToken(),
                'expiresAt' => $refreshToken->getExpiresAt()->format('Y-m-d H:i:s'),
            ]);
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
}
