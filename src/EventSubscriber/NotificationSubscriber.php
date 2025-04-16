<?php

namespace App\EventSubscriber;

use App\Repository\NotificationRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Twig\Environment;

class NotificationSubscriber implements EventSubscriberInterface
{
    private $notificationRepository;
    private $twig;

    public function __construct(NotificationRepository $notificationRepository, Environment $twig)
    {
        $this->notificationRepository = $notificationRepository;
        $this->twig = $twig;
    }

    public function onKernelController(ControllerEvent $event): void
    {
        // Récupére les notifications
        $notifications = $this->notificationRepository->findBy([], ['date' => 'DESC']);

        // Ajoute les notifications comme variable globale Twig
        $this->twig->addGlobal('notifications', $notifications);
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::CONTROLLER => 'onKernelController',
        ];
    }
}