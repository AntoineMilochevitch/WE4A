<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

class ProfileController extends AbstractController
{
    #[Route('/api/profile', name: 'api_profile')]
    public function index(EntityManagerInterface $entityManager, UserRepository $userRepository): JsonResponse
    {
        $user = $entityManager->getRepository(User::class)->find(1); // ID de l'utilisateur actuel
        if (!$user) {
            throw $this->createNotFoundException('Utilisateur non trouvé');
        }

        // Récupérer tous les scores triés
        $scores = $userRepository->findAllScore();

        // Trouver la position du joueur
        $rank = null;
        foreach ($scores as $index => $score) {
            if ($score['id'] === $user->getId()) {
                $rank = $index + 1; // Les index commencent à 0, donc on ajoute 1
                break;
            }
        }

        // Récupérer les informations de l'utilisateur avec son classement
        $profile = [
            'id' => $user->getId(),
            'nom' => $user->getNom(),
            'prenom' => $user->getPrenom(),
            'email' => $user->getEmail(),
            'avatar' => $user->getAvatar(),
            'classement' => $rank,
        ];

        return new JsonResponse($profile);
    }

    #[Route('/api/profile/update_score', name: 'update_score', methods: ['POST'])]
    public function updateScore(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $entityManager->getRepository(User::class)->find(1); // ID de l'utilisateur actuel
        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
        }

        $score = $request->request->get('score');
        if ($score !== null) {
            if ($user->getScore() < $score) {
                $user->setScore($score);
                $entityManager->persist($user);
                $entityManager->flush();
                return new JsonResponse(['message' => 'Score mis à jour avec succès']);
            }
        }

        return new JsonResponse(['error' => 'Score non fourni'], 400);
    }
}