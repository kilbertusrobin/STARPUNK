<?php
namespace App\Service;

use App\Entity\RefreshToken;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use App\Entity\User;

class TokenService
{
    private $tokenStorage;
    private $jwtManager;
    private $entityManager;

    public function __construct(TokenStorageInterface $tokenStorage, JWTTokenManagerInterface $jwtManager, EntityManagerInterface $entityManager)
    {
        $this->tokenStorage = $tokenStorage;
        $this->jwtManager = $jwtManager;
        $this->entityManager = $entityManager;
    }

    public function getUserFromToken()
    {
        $token = $this->tokenStorage->getToken();
        if ($token === null) {
            return new JsonResponse("Token not provided.", Response::HTTP_UNAUTHORIZED);
        }

        $decodedJwtToken = $this->jwtManager->decode($token);

        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $decodedJwtToken['email']]);

        if (!$user) {
            return new JsonResponse("User not found.", Response::HTTP_NOT_FOUND);
        }

        return $user;
    }

    public function generateRefreshToken(User $user): RefreshToken
    {
        $existingToken = $this->entityManager->getRepository(RefreshToken::class)
            ->createQueryBuilder('rt')
            ->where('rt.user = :user')
            ->andWhere('rt.expiresAt > :now')
            ->setParameter('user', $user)
            ->setParameter('now', new \DateTimeImmutable())
            ->getQuery()
            ->getOneOrNullResult();
    
        if ($existingToken) {
            return $existingToken;
        }
    
        $this->revokeAllUserTokens($user);
    
        $refreshToken = new RefreshToken();
        $token = bin2hex(random_bytes(64));
        $refreshToken->setToken($token);
        $refreshToken->setExpiresAt(new \DateTimeImmutable('+1 month'));
        $refreshToken->setUser($user);
    
        $this->entityManager->persist($refreshToken);
        $this->entityManager->flush();
    
        return $refreshToken;
    }

    public function refreshAccessToken(string $refreshToken): JsonResponse
    {
        $refreshTokenEntity = $this->entityManager->getRepository(RefreshToken::class)->findOneBy(['token' => $refreshToken]);

        if (!$refreshTokenEntity) {
            return new JsonResponse("Invalid refresh token.", Response::HTTP_UNAUTHORIZED);
        }

        if ($refreshTokenEntity->getExpiresAt() < new \DateTimeImmutable()) {
            return new JsonResponse("Refresh token expired.", Response::HTTP_UNAUTHORIZED);
        }

        $user = $refreshTokenEntity->getUser();
        $newJwt = $this->jwtManager->create($user);

        $newRefreshToken = $this->generateRefreshToken($user);

        return new JsonResponse([
            'access_token' => $newJwt,
            'refresh_token' => $newRefreshToken->getToken(),
        ]);
    }

    public function revokeAllUserTokens(User $user): void
    {
        $userRefreshTokens = $this->entityManager
            ->getRepository(RefreshToken::class)
            ->findBy(['user' => $user]);
            
        foreach ($userRefreshTokens as $token) {
            $this->entityManager->remove($token);
        }
        
        $this->entityManager->flush();
    }
}
