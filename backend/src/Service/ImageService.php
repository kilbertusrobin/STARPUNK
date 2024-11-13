<?php 

namespace App\Service;

use App\Repository\ImageRepository;
use App\Repository\LikeRepository;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use JMS\Serializer\SerializerInterface;
use JMS\Serializer\SerializationContext;
use App\Entity\Like;
use App\Entity\User;
use App\Entity\Image;
use Doctrine\ORM\EntityManagerInterface;

class ImageService
{
    private ImageRepository $imageRepository;
    private LikeRepository $likeRepository;
    private SerializerInterface $jmsSerializer;
    private EntityManagerInterface $entityManager;

    public function __construct(
        ImageRepository $imageRepository,
        LikeRepository $likeRepository,
        SerializerInterface $jmsSerializer,
        EntityManagerInterface $entityManager
    ) {
        $this->imageRepository = $imageRepository;
        $this->likeRepository = $likeRepository;
        $this->jmsSerializer = $jmsSerializer;
        $this->entityManager = $entityManager;
    }

    public function list(): JsonResponse
    {
        try {
            $list = $this->imageRepository->findAll();

            if (empty($list)) {
                return new JsonResponse("Aucune entité enregistrée", Response::HTTP_OK);
            }

            $serializedData = $this->jmsSerializer->serialize($list, "json", SerializationContext::create()->setGroups(['list_image']));
            return new JsonResponse(json_decode($serializedData), Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function read(int $id): JsonResponse
    {
        try {
            $entity = $this->imageRepository->find($id);

            if (!$entity) {
                return new JsonResponse("Entité non trouvée", Response::HTTP_NOT_FOUND);
            }
            

            $imageDetails = [
                'id' => $entity->getId(),
                'url' => $entity->getUrl(),
                'status' => $entity->isStatus(),
                'nbLikes' => count($entity->getLikes()),
                'user' => $entity->getUser() ? [
                    'id' => $entity->getUser()->getId(),
                    'username' => $entity->getUser()->getUsername(),
                    'email' => $entity->getUser()->getEmail(),
                    'roles' => $entity->getUser()->getRoles()
                ] : null,
            ];
            return new JsonResponse($imageDetails, Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }



    public function validate(array $data): JsonResponse
    {
        try {
            $image = $this->imageRepository->find($data['id']);
            if (!$image) {
                return new JsonResponse("Image non trouvée", Response::HTTP_NOT_FOUND);
            }

            if ($image->isStatus()) {
                return new JsonResponse("Image déjà validée", Response::HTTP_OK);
            } else {
                $newStatus = !$image->isStatus();
                $image->setStatus($newStatus);
                $this->entityManager->persist($image);
                $this->entityManager->flush();
                return new JsonResponse("Image validée", Response::HTTP_OK);
            }

        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function delete(array $data): JsonResponse
    {
        try {
            $image = $this->imageRepository->find($data['id']);
            if (!$image) {
                return new JsonResponse("Image non trouvée", Response::HTTP_NOT_FOUND);
            }

            $this->entityManager->remove($image);
            $this->entityManager->flush();

            return new JsonResponse("Image supprimée", Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

        public function create(UploadedFile $file, User $user, $data): JsonResponse
        {
            $allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (!in_array($file->getMimeType(), $allowedTypes)) {
                throw new \Exception("File type not allowed.");
            }

            $filename = uniqid() . '.' . $file->getClientOriginalExtension();
            $path = 'uploads/images/';
            $file->move($path, $filename);

            $image = new Image();
            $image->setUrl("http://localhost:8000/$path$filename");
            $image->setTitle($data['title']);
            $image->setDescription($data['description']);
            $image->setStatus(false);
            $image->setUser($user);

            $this->imageRepository->save($image);

            return new JsonResponse("L'image a bien été créée", JsonResponse::HTTP_CREATED);
        }

    public function toggleLike(array $data, User $user): JsonResponse
    {
        $img = $this->imageRepository->find($data['idImg']);
        if (!$img) {
            return new JsonResponse("Image non trouvée", Response::HTTP_NOT_FOUND);
        }

        if ($this->likeRepository->findOneBy(['image' => $img, 'user' => $user])) {
            $like = $this->likeRepository->findOneBy(['image' => $img, 'user' => $user]);
            $this->entityManager->remove($like);
            $this->entityManager->flush();
            return new JsonResponse("Like retiré", Response::HTTP_OK);
        } else {
            $like = new Like();
            $like->setImage($img);
            $like->setUser($user);
            $this->entityManager->persist($like);
            $this->entityManager->flush();
            return new JsonResponse("Like ajouté", Response::HTTP_OK);
        }
    }
    
}
