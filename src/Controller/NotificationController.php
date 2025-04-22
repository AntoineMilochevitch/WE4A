<?php

namespace App\Controller;

use App\Repository\NotificationRepository;
use App\Repository\UserNotifRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

class NotificationController extends AbstractController
{
    #[Route('/notification/mark-as-read/{id}', name: 'mark_notification_read', methods: ['POST'])]
    public function markAsRead(int $id, UserNotifRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();

        $userNotif = $repo->findOneBy([
            'usersId' => $user->getId(),
            'notification' => $id
        ]);

        if (!$userNotif) {
            return new JsonResponse(['status' => 'error', 'message' => 'Notification non trouvée'], 404);
        }

        $userNotif->setEstVu(true);
        $em->flush();

        return new JsonResponse(['status' => 'success']);
    }

}
