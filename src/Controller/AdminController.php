<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Entity\UE;
use App\Repository\UeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class AdminController extends AbstractController
{
    #[Route('/admin', name: 'admin')]
    public function index(EntityManagerInterface $entityManager, UserRepository $userRepository, UeRepository $ueRepository): \Symfony\Component\HttpFoundation\Response
    {
        $users = $userRepository->allUsers();
        $ue = $ueRepository->allUE();

        return $this->render('admin/admin.html.twig', [
            'controller_name' => 'AdminController',
            'courses' => $ue,
            'users' => $users,
        ]);
    }


    #[Route('/api/admin', name: 'api_admin')]
    public function getInfo(EntityManagerInterface $entityManager, UserRepository $userRepository, UeRepository $ueRepository): JsonResponse
    {
        // Récupérer les utilisateurs
        $user = $userRepository->allUsers();

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
        }

        $usersData = [];
        foreach ($user as $entity) {
            $usersData[] = [
                'id' => $entity->getId(),
                'nom' => $entity->getNom(),
                'prenom' => $entity->getPrenom(),
                'email' => $entity->getEmail(),
                'mdp' => $entity->getMdp()
            ];
        }

        // Récupérer les cours
        $course = $ueRepository->allUE();

        if (!$course) {
            return new JsonResponse(['error' => 'Cours non trouvé'], 404);
        }

        $coursesData = [];
        foreach ($course as $entity) {
            $coursesData[] = [
                'id' => $entity->getId(),
                'code' => $entity->getCode(),
                'nom' => $entity->getNom(),
                'description' => $entity->getDescription()
            ];
        }

        $responseData = [
            'users' => $usersData,
            'courses' => $coursesData,
        ];

        return new JsonResponse($responseData);

    }
}








