<?php

namespace App\Controller;

use App\Repository\NotificationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

class NotificationController extends AbstractController
{
    #[Route('/_notifications', name: 'notifications_fragment')]
    public function notificationsFragment(NotificationRepository $notificationRepository): Response
    {
        $notifications = $notificationRepository->findBy([], ['date' => 'DESC'], 5);

        return $this->render('fragments/_notifications_panel.html.twig', [
            'notifications' => $notifications,
        ]);
    }
}
