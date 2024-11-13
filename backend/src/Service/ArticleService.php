<?php 

namespace App\Service;

use App\Repository\ArticleRepository;
use App\Entity\Article;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use JMS\Serializer\SerializerInterface;
use JMS\Serializer\SerializationContext;
use Doctrine\ORM\EntityManagerInterface;

class ArticleService {

    private ArticleRepository $articleRepository;
    private SerializerInterface $jmsSerializer;
    private EntityManagerInterface $entityManager;

    public function __construct(
        ArticleRepository $articleRepository,
        SerializerInterface $jmsSerializer,
        EntityManagerInterface $entityManager
    ) {
        $this->articleRepository = $articleRepository;
        $this->jmsSerializer = $jmsSerializer;
        $this->entityManager = $entityManager;
    }

    public function list(): JsonResponse
    {
        try {
            $list = $this->articleRepository->findAll();

            if (empty($list)) {
                return new JsonResponse("Aucune entité enregistrée", Response::HTTP_OK);
            }

            $serializedData = $this->jmsSerializer->serialize($list, "json", SerializationContext::create()->setGroups(['list_article']));
            return new JsonResponse(json_decode($serializedData), Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function read($id) : JsonResponse
    {
        try {
            $article = $this->articleRepository->find($id);

            if (empty($article)) {
                return new JsonResponse("Aucune entité trouvée", Response::HTTP_OK);
            }

            $serializedData = $this->jmsSerializer->serialize($article, "json", SerializationContext::create()->setGroups(['list_article']));
            return new JsonResponse(json_decode($serializedData), Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

}