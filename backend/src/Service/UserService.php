<?php 

namespace App\Service;

use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use JMS\Serializer\SerializerInterface;
use JMS\Serializer\SerializationContext;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Entity\User;

class UserService
{
    private UserRepository $userRepository;
    private SerializerInterface $jmsSerializer;
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserRepository $userRepository, SerializerInterface $jmsSerializer, UserPasswordHasherInterface $passwordHasher)
    {
        $this->userRepository = $userRepository;
        $this->jmsSerializer = $jmsSerializer;
        $this->passwordHasher = $passwordHasher;
    }

    public function list(): JsonResponse
    {
        try {
            $list = $this->userRepository->findAll();

            if (empty($list)) {
                return new JsonResponse("Aucune entité enregistrée", Response::HTTP_OK);
            }

            $serializedData = $this->jmsSerializer->serialize($list, "json", SerializationContext::create()->setGroups(['list_user']));
            return new JsonResponse(json_decode($serializedData), Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function read($id): JsonResponse
    {
        try {
            $entity = $this->userRepository->find($id);

            if (empty($entity)) {
                return new JsonResponse("Entité non trouvée", Response::HTTP_NOT_FOUND);
            }

            $userDetails = [
                'id' => $entity->getId(),
                'username' => $entity->getUsername(),
                'profile_pic' => $entity->getProfilePic(),
                'email' => $entity->getEmail(),
                'roles' => $entity->getRoles()
            ];
            return new JsonResponse($userDetails, Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function create(Request $request): JsonResponse
    {
        try {
            $uploadedFile = $request->files->get('profile_pic');

            if (!$uploadedFile) {
                return new JsonResponse("Aucune photo de profil envoyée", Response::HTTP_BAD_REQUEST);
            }

            if (!$uploadedFile->isValid()) {
                return new JsonResponse("Le fichier de la photo de profil est invalide", Response::HTTP_BAD_REQUEST);
            }

            $filename = uniqid() . '.' . $uploadedFile->guessExtension();

            $uploadedFile->move(
                'uploads/profile/',
                $filename
            );

            $username = $request->request->get('username');
            $email = $request->request->get('email');
            $password = $request->request->get('password');

            if (!$username || !$email || !$password) {
                return new JsonResponse("Données utilisateur incomplètes", Response::HTTP_BAD_REQUEST);
            }

            $user = new User();
            $user->setUsername($username);
            $user->setEmail($email);
            $user->setPassword($this->passwordHasher->hashPassword($user, $password));
            $user->setRoles(['ROLE_USER']);
            $user->setProfilePic("http://localhost:8000/uploads/profile/" . $filename);

            $this->userRepository->save($user, true);

            return new JsonResponse("Utilisateur créé avec succès", Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    
}
