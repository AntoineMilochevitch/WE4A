<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MainController extends AbstractController
{
    #[Route('/', name: 'home')]
    public function index(): Response
    {
        return $this->render('index.html.twig');
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

    #[Route('/course', name: 'course')]
    public function course(): Response
    {
        return $this->render('course/course.html.twig');
    }

    #[Route('/find', name: 'find')]
    public function find(): Response
    {
        return $this->render('find/find.html.twig');
    }
}
