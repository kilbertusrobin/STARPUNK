<?php 
namespace App\Service;

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
}
