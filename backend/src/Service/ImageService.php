<?php 

namespace App\Service;

use App\Repository\ImageRepository;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use JMS\Serializer\SerializerInterface;
use JMS\Serializer\SerializationContext;
use App\Entity\User;
use App\Entity\Image;
use Doctrine\ORM\EntityManagerInterface;

class ImageService
{
    private ImageRepository $imageRepository;
    private SerializerInterface $jmsSerializer;
    private EntityManagerInterface $entityManager;

    public function __construct(
        ImageRepository $imageRepository,
        SerializerInterface $jmsSerializer,
        EntityManagerInterface $entityManager
    ) {
        $this->imageRepository = $imageRepository;
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

            $newStatus = !$image->isStatus();
            $image->setStatus($newStatus);
            $this->entityManager->persist($image);
            $this->entityManager->flush();

            return new JsonResponse($newStatus ? "Événement Validé" : "Événement Invalidé", Response::HTTP_OK);
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

    public function create(UploadedFile $file, User $user): JsonResponse
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
        $image->setStatus(true);
        $image->setUser($user);

        $this->imageRepository->save($image);

        return new JsonResponse("L'image a bien été créée", JsonResponse::HTTP_CREATED);
    }
    
}
