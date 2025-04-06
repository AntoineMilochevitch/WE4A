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
        // $user = $entityManager->getRepository(User::class)->find(1);

        // if (!$user) {
        //     throw $this->createNotFoundException('Utilisateur non trouvé');
        // }

        // Récupérer les cours auxquels l'utilisateur est inscrit
        // $courses = $user->getUe();

        // Utilisation de cours statiques pour le moment
        $courses = [
            (object) ['id' => 1, 'nom' => 'Cours de Mathématiques', 'code' => 'MATH101', 'image' => 'course_image.png', 'description' => 'Introduction aux mathématiques.'],
            (object) ['id' => 2, 'nom' => 'Cours de Physique', 'code' => 'PHYS101', 'image' => 'course_image.png', 'description' => 'Introduction à la physique.'],
            (object) ['id' => 3, 'nom' => 'Cours de Mathématiques', 'code' => 'MATH101', 'image' => 'course_image.png', 'description' => 'Introduction aux mathématiques.'],
            (object) ['id' => 4, 'nom' => 'Cours de Physique', 'code' => 'PHYS101', 'image' => 'course_image.png', 'description' => 'Introduction à la physique.'],
            (object) ['id' => 5, 'nom' => 'Cours de Mathématiques', 'code' => 'MATH101', 'image' => 'course_image.png', 'description' => 'Introduction aux mathématiques.'],
            (object) ['id' => 6, 'nom' => 'Cours de Physique', 'code' => 'PHYS101', 'image' => 'course_image.png', 'description' => 'Introduction à la physique.'],
            (object) ['id' => 1, 'nom' => 'Cours de Mathématiques', 'code' => 'MATH101', 'image' => 'course_image.png', 'description' => 'Introduction aux mathématiques.'],
            (object) ['id' => 2, 'nom' => 'Cours de Physique', 'code' => 'PHYS101', 'image' => 'course_image.png', 'description' => 'Introduction à la physique.'],
            (object) ['id' => 3, 'nom' => 'Cours de Mathématiques', 'code' => 'MATH101', 'image' => 'course_image.png', 'description' => 'Introduction aux mathématiques.'],
            (object) ['id' => 4, 'nom' => 'Cours de Physique', 'code' => 'PHYS101', 'image' => 'course_image.png', 'description' => 'Introduction à la physique.'],
            (object) ['id' => 5, 'nom' => 'Cours de Mathématiques', 'code' => 'MATH101', 'image' => 'course_image.png', 'description' => 'Introduction aux mathématiques.'],
            (object) ['id' => 6, 'nom' => 'Cours de Physique', 'code' => 'PHYS101', 'image' => 'course_image.png', 'description' => 'Introduction à la physique.'],
            (object) ['id' => 5, 'nom' => 'Cours de Mathématiques', 'code' => 'MATH101', 'image' => 'course_image.png', 'description' => 'Introduction aux mathématiques.'],
            (object) ['id' => 6, 'nom' => 'Cours de Physique', 'code' => 'PHYS101', 'image' => 'course_image.png', 'description' => 'Introduction à la physique.'],
        ];

        return $this->render('myCourses/myCourses.html.twig', [
            'courses' => $courses,
        ]);
    }

    #[Route('/api/my-courses', name: 'api_my_courses')]
    public function getCourses(EntityManagerInterface $entityManager): JsonResponse
    {
        // Récupérer l'utilisateur avec l'ID 1
        // $user = $entityManager->getRepository(User::class)->find(1);

        // if (!$user) {
        //     return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
        // }

        // Récupérer les cours auxquels l'utilisateur est inscrit
        // $courses = $user->getUe();

        // Utilisation de cours statiques pour le moment
        $courses = [
            (object) ['id' => 1, 'nom' => 'Cours de Mathématiques', 'code' => 'MATH101', 'image' => 'course_image.png', 'description' => 'Introduction aux mathématiques.'],
            (object) ['id' => 2, 'nom' => 'Cours de Physique', 'code' => 'PHYS101', 'image' => 'course_image.png', 'description' => 'Introduction à la physique.'],
            (object) ['id' => 3, 'nom' => 'Cours de Mathématiques', 'code' => 'MATH101', 'image' => 'course_image.png', 'description' => 'Introduction aux mathématiques.'],
            (object) ['id' => 4, 'nom' => 'Cours de Physique', 'code' => 'PHYS101', 'image' => 'course_image.png', 'description' => 'Introduction à la physique.'],
            (object) ['id' => 5, 'nom' => 'Cours de Mathématiques', 'code' => 'MATH101', 'image' => 'course_image.png', 'description' => 'Introduction aux mathématiques.'],
            (object) ['id' => 6, 'nom' => 'Cours de Physique', 'code' => 'PHYS101', 'image' => 'course_image.png', 'description' => 'Introduction à la physique.'],
            (object) ['id' => 1, 'nom' => 'Cours de Mathématiques', 'code' => 'MATH101', 'image' => 'course_image.png', 'description' => 'Introduction aux mathématiques.'],
            (object) ['id' => 2, 'nom' => 'Cours de Physique', 'code' => 'PHYS101', 'image' => 'course_image.png', 'description' => 'Introduction à la physique.'],
            (object) ['id' => 3, 'nom' => 'Cours de Mathématiques', 'code' => 'MATH101', 'image' => 'course_image.png', 'description' => 'Introduction aux mathématiques.'],
            (object) ['id' => 4, 'nom' => 'Cours de Physique', 'code' => 'PHYS101', 'image' => 'course_image.png', 'description' => 'Introduction à la physique.'],
            (object) ['id' => 5, 'nom' => 'Cours de Mathématiques', 'code' => 'MATH101', 'image' => 'course_image.png', 'description' => 'Introduction aux mathématiques.'],
            (object) ['id' => 6, 'nom' => 'Cours de Physique', 'code' => 'PHYS101', 'image' => 'course_image.png', 'description' => 'Introduction à la physique.'],
            (object) ['id' => 5, 'nom' => 'Cours de Mathématiques', 'code' => 'MATH101', 'image' => 'course_image.png', 'description' => 'Introduction aux mathématiques.'],
            (object) ['id' => 6, 'nom' => 'Cours de Physique', 'code' => 'PHYS101', 'image' => 'course_image.png', 'description' => 'Introduction à la physique.'],
        ];

        return new JsonResponse($courses);
    }
}