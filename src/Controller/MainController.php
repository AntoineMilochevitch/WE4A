<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Ue;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\UserNotifRepository;

class MainController extends AbstractController
{
    /**
     * Page d'accueil
     * Affiche la page d'accueil avec les notifications non lues de l'utilisateur connecté
     * @Route("/", name="home")
     * @param UserNotifRepository $userNotifRepository
     * @return Response
     */
    #[Route('/', name: 'home')]
    public function index(UserNotifRepository $userNotifRepository): Response
    {
        $user = $this->getUser(); // Récupérer l'utilisateur connecté
        $notifications = [];

        // Si l'utilisateur est connecté, récupérer ses notifications non lues
        if ($user) {
            $notifications = $userNotifRepository->findBy([
                'usersId' => $user->getId(),
                'estVu' => false
            ], [
                'notification' => 'DESC'
            ]);
        }

        // Rendre la vue avec les notifications
        return $this->render('index.html.twig', [
            'notifications' => $notifications
        ]);
    }

    /**
     * Page Mes Cours
     * @Route("/my-courses", name="my_courses")
     * @return Response
     */
    #[Route('/my-courses', name: 'my_courses')]
    public function myCourses(): Response
    {
        // Rendre la page des cours
        return $this->render('myCourses/myCourses.html.twig');
    }

    /**
     * Page Profil
     * @Route("/profile", name="profile")
     * @return Response
     */
    #[Route('/profile', name: 'profile')]
    public function profile(): Response
    {
        // Rendre la page du profil utilisateur
        return $this->render('profil/profil.html.twig');
    }

    /**
     * Page de Connexion
     * @Route("/login", name="login")
     * @return Response
     */
    #[Route('/login', name: 'login')]
    public function login(): Response
    {
        // Rendre la page de connexion
        return $this->render('security/login.html.twig');
    }

    /**
     * Page d'administration
     * @Route("/admin", name="admin")
     * @return Response
     */
    #[Route('/admin', name: 'admin')]
    public function admin(): Response
    {
        // Rendre la page d'administration
        return $this->render('admin/admin.html.twig');
    }

    /**
     * Détail d'un cours spécifique par code
     * @Route("/course/{code}", name="course")
     * @param string $code
     * @param EntityManagerInterface $entityManager
     * @return Response
     */
    #[Route('/course/{code}', name: 'course')]
    public function course(string $code, EntityManagerInterface $entityManager): Response
    {
        // Chercher le cours par son code
        $course = $entityManager->getRepository(Ue::class)->findOneBy(['code' => $code]);

        if (!$course) {
            throw $this->createNotFoundException('Cours non trouvé');
        }

        // Rendre la page du cours avec ses informations
        return $this->render('course/course.html.twig', [
            'course' => $course,
        ]);
    }

    /**
     * Page de recherche
     * @Route("/find", name="find")
     * @return Response
     */
    #[Route('/find', name: 'find')]
    public function find(): Response
    {
        // Rendre la page de recherche
        return $this->render('find/find.html.twig');
    }
}
