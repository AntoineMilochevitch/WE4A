<?php

namespace App\EventSubscriber;

use App\Repository\UserNotifRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Twig\Environment;

/**
 * Ce subscriber ajoute automatiquement les notifications non lues de l'utilisateur
 * en tant que variable globale Twig pour qu'elles soient accessibles partout dans les vues.
 */
class NotificationSubscriber implements EventSubscriberInterface
{
    private UserNotifRepository $userNotifRepository;
    private Environment $twig;
    private TokenStorageInterface $tokenStorage;

    /**
     * Injection des dépendances nécessaires
     * @param UserNotifRepository $userNotifRepository
     * @param Environment $twig
     * @param TokenStorageInterface $tokenStorage
     */
    public function __construct(UserNotifRepository $userNotifRepository, Environment $twig, TokenStorageInterface $tokenStorage)
    {
        $this->userNotifRepository = $userNotifRepository;
        $this->twig = $twig;
        $this->tokenStorage = $tokenStorage;
    }

    /**
     * Cette méthode est appelée avant chaque exécution de contrôleur
     * Elle récupère les notifications non lues de l'utilisateur connecté et les injecte dans Twig
     * @param ControllerEvent $event
     */
    public function onKernelController(ControllerEvent $event): void
    {
        // Récupérer le token d'authentification
        $token = $this->tokenStorage->getToken();

        // Vérifier que l'utilisateur est bien connecté
        if (!$token || !is_object($token->getUser())) {
            return;
        }

        $user = $token->getUser();

        // Récupérer les notifications non lues triées par ordre décroissant
        $notifications = $this->userNotifRepository->findBy([
            'usersId' => $user->getId(),
            'estVu' => false
        ], ['notification' => 'DESC']);

        // Injecter la variable globale 'notifications' dans Twig
        $this->twig->addGlobal('notifications', $notifications);
    }

    /**
     * Déclare l'événement auquel ce subscriber est abonné
     * @return array
     */
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::CONTROLLER => 'onKernelController',
        ];
    }
}
