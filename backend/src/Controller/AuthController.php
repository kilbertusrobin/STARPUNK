<?php
namespace App\Controller;

use App\Entity\User;
use App\Service\TokenService;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\RefreshToken;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class AuthController extends AbstractController
{
    private $tokenService;
    private $entityManager;
    private $passwordHasher;
    private $jwtManager;

    public function __construct(
        TokenService $tokenService,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        JWTTokenManagerInterface $jwtManager
    ) {
        $this->tokenService = $tokenService;
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
        $this->jwtManager = $jwtManager;
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['email']) || !isset($data['password'])) {
            return new JsonResponse([
                'message' => 'Email and password are required'
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = $this->entityManager
            ->getRepository(User::class)
            ->findOneBy(['email' => $data['email']]);

        if (!$user) {
            throw new BadCredentialsException('Invalid credentials.');
        }

        if (!$this->passwordHasher->isPasswordValid($user, $data['password'])) {
            throw new BadCredentialsException('Invalid credentials.');
        }

        $accessToken = $this->jwtManager->create($user);

        $refreshToken = $this->tokenService->generateRefreshToken($user);

        return new JsonResponse([
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken->getToken()
        ]);
    }

    #[Route('/api/refresh-token', name: 'refresh_token', methods: ['POST'])]
    public function refreshToken(Request $request): JsonResponse
    {
        $refreshToken = $request->get('refresh_token');

        if (!$refreshToken) {
            return new JsonResponse("Refresh token not provided.", JsonResponse::HTTP_BAD_REQUEST);
        }

        return $this->tokenService->refreshAccessToken($refreshToken);
    }

    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(Request $request): JsonResponse
    {
        $refreshToken = $request->get('refresh_token');
        
        if ($refreshToken) {
            $refreshTokenEntity = $this->entityManager
                ->getRepository(RefreshToken::class)
                ->findOneBy(['token' => $refreshToken]);
                
            if ($refreshTokenEntity) {
                $this->entityManager->remove($refreshTokenEntity);
                $this->entityManager->flush();
            }
        }
        
        return new JsonResponse(['message' => 'Logged out successfully']);
    }
}