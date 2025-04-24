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

        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();

        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();


        $nombreCours = $ueRepository->count([]);

        $users = $userRepository->findAll();

        $nombreUsers = count(array_filter($users, function ($user) {
            return in_array('ROLE_USER', $user->getRoles());
        }));

        $nombreProf = count(array_filter($users, function($user){
            return in_array('ROLE_PROF', $user->getRoles());
        }));

        $nombrePost = $sectionRepository->count([]);



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
