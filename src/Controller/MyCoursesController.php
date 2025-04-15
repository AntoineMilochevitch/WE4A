<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\UserUe;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class MyCoursesController extends AbstractController
{
    /*#[Route('/my-courses', name: 'my_courses')]
    public function index(EntityManagerInterface $entityManager): \Symfony\Component\HttpFoundation\Response
    {
        // Récupérer l'utilisateur avec l'ID 1
        $user = $entityManager->getRepository(User::class)->find(1);

        if (!$user) {
            throw $this->createNotFoundException('Utilisateur non trouvé');
        }

        // Récupérer les cours auxquels l'utilisateur est inscrit
        $courses = $user->getUe();

        return $this->render('myCourses/myCourses.html.twig', [
            'courses' => $courses,
        ]);
    }*/

    #[Route('/api/my-courses', name: 'api_my_courses')]
    public function getCourses(EntityManagerInterface $entityManager): JsonResponse
    {
        // Récupérer l'utilisateur avec l'ID 1
        $user = $entityManager->getRepository(User::class)->find(1);

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
        }

        // Récupérer les cours auxquels l'utilisateur est inscrit
        $userUes= $user->getUserUes();

        $courseData = [];
        foreach ($userUes as $userUe) {
            $ue = $userUe->getUe();
            $courseData[] = [
                'id' => $ue->getId(),
                'nom' => $ue->getNom(),
                'code' => $ue->getCode(),
                'image' => $ue->getImage(),
                'description' => $ue->getDescription(),
                'favoris' => $userUe->getFavoris(),
                'lastActivity' => $userUe->getLastVisited(),
            ];
        }

        return new JsonResponse($courseData);
    }

    #[Route('/api/toggle-favoris/{id}', name: 'toggle_favoris', methods: ['POST'])]
    public function toggleFavoris(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        // Récupérer l'utilisateur avec l'ID 1
        $user = $entityManager->getRepository(User::class)->find(1);

        if (!$user) {
            return new JsonResponse(['success' => false, 'message' => 'Utilisateur non trouvé'], 404);
        }

        // Récupérer l'association UserUe pour cet utilisateur et l'UE
        $userUe = $entityManager->getRepository(UserUe::class)->findOneBy(['user' => $user, 'ue' => $id]);

        if (!$userUe) {
            return new JsonResponse(['success' => false, 'message' => 'Cours non trouvé'], 404);
        }

        // Basculer l'état des favoris
        $userUe->setFavoris(!$userUe->getFavoris());
        $entityManager->flush();

        return new JsonResponse([
            'success' => true,
            'isFavoris' => $userUe->getFavoris(),
        ]);
    }
}