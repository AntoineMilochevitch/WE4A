<?php

namespace App\Controller;

use App\Repository\UeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class RechercheUeContoller extends AbstractController
{
    #[Route('/api/ue', name: 'api_ue', methods: ['GET'])]
    public function index(Request $request, UeRepository $ueRepository): JsonResponse
    {
        // Récupérer le paramètre de recherche (par défaut, une chaîne vide)
        $searchTerm = $request->query->get('search', '');

        if ($searchTerm) {
            // Si un terme de recherche est fourni, utiliser la méthode findByCode
            $ues = $ueRepository->findByCode($searchTerm);
        } else {
            // Sinon, récupérer tous les résultats
            $ues = $ueRepository->findAll();
        }

        // Debug: afficher les UE récupérées
        dump($ues);

        // Transformer les résultats en un format adapté à la réponse JSON
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
