<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

use App\Repository\UeRepository;

class SecurityController extends AbstractController
{
    #[Route(path: '/Connexion', name: 'app_login')]
    public function login(AuthenticationUtils $authenticationUtils, UeRepository $ueRepository): Response
    {
        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();

        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();


        $nombreCours = $ueRepository->count([]);


        return $this->render('security/login.html.twig', [
            'last_username' => $lastUsername,
            'error' => $error,
            'nombreCours'   => $nombreCours,
        ]);
    }

    #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }
}
