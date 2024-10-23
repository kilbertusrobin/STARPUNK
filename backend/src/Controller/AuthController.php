<?php

namespace App\Controller;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\InvalidArgumentException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface; // Modification ici
use Symfony\Component\Routing\Annotation\Route;

class AuthController
{
    private $jwtManager;
    private $userRepository;
    private $passwordHasher; // Changement de nom

    public function __construct(JWTTokenManagerInterface $jwtManager, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher) // Modification ici
    {
        $this->jwtManager = $jwtManager;
        $this->userRepository = $userRepository;
        $this->passwordHasher = $passwordHasher;
    }

    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
    
        if (!isset($data['email']) || !isset($data['password'])) {
            return new JsonResponse(['error' => 'Email and password required.'], JsonResponse::HTTP_BAD_REQUEST);
        }
    
        $user = $this->userRepository->findOneBy(['email' => $data['email']]);
        if (!$user || !$this->passwordHasher->isPasswordValid($user, $data['password'])) {
            return new JsonResponse(['error' => 'Invalid credentials.'], JsonResponse::HTTP_UNAUTHORIZED);
        }
    
        $token = $this->jwtManager->create($user);
    
        return new JsonResponse(['token' => $token]);
    }
    
}
