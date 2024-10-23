<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ApiController extends AbstractController
{
    #[Route('/apiTest', name: 'api-')]
    public function testApi(): JsonResponse
    {
        $data = [
            'status' => 'success',
            'message' => 'L\'API fonctionne correctement',
        ];

        return new JsonResponse($data, JsonResponse::HTTP_OK);
    }
}
