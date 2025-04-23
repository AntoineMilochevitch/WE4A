<?php

namespace App\EventSubscriber;

use App\Repository\UserNotifRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Twig\Environment;

class NotificationSubscriber implements EventSubscriberInterface
{
    private UserNotifRepository $userNotifRepository;
    private Environment $twig;
    private TokenStorageInterface $tokenStorage;

    public function __construct(UserNotifRepository $userNotifRepository, Environment $twig, TokenStorageInterface $tokenStorage)
    {
        $this->userNotifRepository = $userNotifRepository;
        $this->twig = $twig;
        $this->tokenStorage = $tokenStorage;
    }

    public function onKernelController(ControllerEvent $event): void
    {
        $token = $this->tokenStorage->getToken();
        if (!$token || !is_object($token->getUser())) {
            return;
        }

        $user = $token->getUser();

        $notifications = $this->userNotifRepository->findBy([
            'usersId' => $user->getId(),
            'estVu' => false
        ], ['notification' => 'DESC']);

        $this->twig->addGlobal('notifications', $notifications);
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::CONTROLLER => 'onKernelController',
        ];
    }

}
