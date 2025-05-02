<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

use App\Repository\UeRepository;
use App\Repository\UsersRepository;
use App\Repository\SectionRepository;

class SecurityController extends AbstractController
{
    #[Route(path: '/Connexion', name: 'app_login')]
    public function login(AuthenticationUtils $authenticationUtils, UeRepository $ueRepository, UsersRepository $userRepository, SectionRepository $sectionRepository): Response
    {

        // Récupère l'erreur de connexion s'il y en a une
        $error = $authenticationUtils->getLastAuthenticationError();

        // Récupère le dernier nom d'utilisateur saisi
        $lastUsername = $authenticationUtils->getLastUsername();

        // Récupère le nombre total de cours
        $nombreCours = $ueRepository->count([]);

        // Récupère tous les utilisateurs (étudiants + profs)
        $users = $userRepository->findAll();

        // Compte les utilisateurs ayant le rôle ROLE_USER
        $nombreUsers = count(array_filter($users, function ($user) {
            return in_array('ROLE_USER', $user->getRoles());
        }));

        // Compte les utilisateurs ayant le rôle ROLE_PROF
        $nombreProf = count(array_filter($users, function($user){
            return in_array('ROLE_PROF', $user->getRoles());
        }));

        // Nombre de posts (sections probablement utilisées comme forums ou publications)
        $nombrePost = $sectionRepository->count([]);

        // Rend la page de connexion en y injectant les statistiques
        return $this->render('security/login.html.twig', [
            'last_username' => $lastUsername,
            'error' => $error,
            'nombreCours'   => $nombreCours,
            'nombreUsers' => $nombreUsers,
            'nombreProf' => $nombreProf,
            'nombrePost' => $nombrePost,
        ]);
    }

    #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }
}
