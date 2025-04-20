<?php

namespace App\Controller;

use App\Repository\UeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class RechercheUeContoller extends AbstractController
{
    #[Route('/api/ue', name: 'api_ue', methods: ['GET'])]
    public function index(UeRepository $ueRepository): JsonResponse
    {
        $ues = $ueRepository->findAll();

        $data = array_map(function ($ue) {
            return [
                'code' => $ue->getCode(),
                'name' => $ue->getNom(),
                'description' => $ue->getDescription(),
                'image' => $ue->getImage(),
            ];
        }, $ues);

        return $this->json($data);
    }
}