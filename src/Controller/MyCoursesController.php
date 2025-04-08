<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class MyCoursesController extends AbstractController
{
    #[Route('/my-courses', name: 'my_courses')]
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