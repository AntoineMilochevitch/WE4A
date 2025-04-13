<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Ue;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\NotificationRepository;

class MainController extends AbstractController
{
    #[Route('/', name: 'home')]
    public function index(NotificationRepository $notificationRepository): Response
    {
        $notifications = $notificationRepository->findBy([], ['date' => 'DESC']);

        return $this->render('index.html.twig', [
            'notifications' => $notifications,
        ]);
    }

    #[Route('/my-courses', name: 'my_courses')]
    public function myCourses(): Response
    {
        return $this->render('myCourses/myCourses.html.twig');
    }

    #[Route('/profile', name: 'profile')]
    public function profile(): Response
    {
        return $this->render('profil/profil.html.twig');
    }

    #[Route('/login', name: 'login')]
    public function login(): Response
    {
        return $this->render('login/login.html.twig');
    }

    #[Route('/admin', name: 'admin')]
    public function admin(): Response
    {
        return $this->render('admin/admin.html.twig');
    }

    #[Route('/course/{code}', name: 'course')]
    public function course(string $code, EntityManagerInterface $entityManager): Response
    {
        $course = $entityManager->getRepository(Ue::class)->findOneBy(['code' => $code]);

        if (!$course) {
            throw $this->createNotFoundException('Cours non trouvé');
        }

        return $this->render('course/course.html.twig', [
            'course' => $course,
        ]);
    }

    #[Route('/find', name: 'find')]
    public function find(): Response
    {
        return $this->render('find/find.html.twig');
    }
}
