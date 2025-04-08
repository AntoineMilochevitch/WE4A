<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use App\Entity\UE;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class AdminController extends AbstractController
{
    #[Route('/admin', name: 'admin')]
    public function index(EntityManagerInterface $entityManager): \Symfony\Component\HttpFoundation\Response
    {
        $user = $entityManager->getRepository(User::class)->find(1);

        if (!$user) {
            throw $this->createNotFoundException('Utilisateur non trouvé');
        }

        $course = $entityManager->getRepository(UE::class)->find(1);

        if (!$course) {
            throw $this->createNotFoundException('UE non trouvée');
        }

        return $this->render('admin/admin.html.twig', [
            'controller_name' => 'AdminController',
        ]);
    }


    #[Route('/api/my-courses', name: 'api_my_courses')]
    public function getCourses(EntityManagerInterface $entityManager): JsonResponse
    {
        // Récupérer l'utilisateur avec l'ID 1
        $user = $entityManager->getRepository(User::class)->find(1);

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
        }

        // Récupérer les cours auxquels l'utilisateur est inscrit
        $courses = $user->getUe();

        $courseData = [];
        foreach ($courses as $course) {
            $courseData[] = [
                'id' => $course->getId(),
                'nom' => $course->getNom(),
                'code' => $course->getCode(),
                'image' => $course->getImage(),
                'description' => $course->getDescription(),
            ];
        }

        return new JsonResponse($courseData);
    }
}








