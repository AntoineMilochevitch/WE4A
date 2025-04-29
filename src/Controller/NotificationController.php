<?php

namespace App\Controller;

use App\Entity\Notification;
use App\Entity\UserNotif;
use App\Repository\UserNotifRepository;
use App\Repository\UserUeRepository;
use App\Repository\TypeNotifRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

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

    #[Route('/notification/create', name: 'notification_create', methods: ['POST'])]
    public function createNotification(
        Request $request,
        EntityManagerInterface $em,
        UserUeRepository $userUeRepository,
        TypeNotifRepository $typeNotifRepository
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['ueId'], $data['message'], $data['type'])) {
            return new JsonResponse(['success' => false, 'error' => 'Paramètres manquants'], 400);
        }

        $ueId = $data['ueId'];
        $message = $data['message'];
        $type = strtolower($data['type']);

        // Chercher directement le type_notif
        $typeNotif = $typeNotifRepository->findOneBy(['typeNotif' => $type]);
        if (!$typeNotif) {
            return new JsonResponse(['success' => false, 'error' => 'Type de notification introuvable'], 404);
        }

        // Créer la notification
        $notification = new Notification();
        $notification->setMessage($message);
        $notification->setDate(new \DateTimeImmutable());
        $notification->setTypeNotif($typeNotif);

        $em->persist($notification);
        $em->flush();

        // Récupérer les utilisateurs de cette UE
        $userUes = $userUeRepository->findBy(['ue' => $ueId]);

        foreach ($userUes as $userUe) {
            $userNotif = new UserNotif();
            $userNotif->setUsersId($userUe->getUser()->getId());
            $userNotif->setNotification($notification);
            $userNotif->setEstVu(false);

            $em->persist($userNotif);
        }

        $em->flush();

        return new JsonResponse(['success' => true]);
    }
    #[Route('/notification/user', name: 'user_notifications', methods: ['GET'])]
    public function getUnreadUserNotifications(UserNotifRepository $userNotifRepository): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Non authentifié'], 401);
        }

        // Récupérer toutes les notifications non lues
        $userNotifications = $userNotifRepository->createQueryBuilder('u')
            ->join('u.notification', 'n')
            ->where('u.usersId = :userId')
            ->andWhere('u.estVu = false')
            ->setParameter('userId', $user->getId())
            ->orderBy('n.date', 'DESC')
            ->getQuery()
            ->getResult();

        $notifications = [];

        foreach ($userNotifications as $userNotif) {
            $notif = $userNotif->getNotification();
            $notifications[] = [
                'id' => $notif->getId(),
                'message' => $notif->getMessage(),
                'estVu' => $userNotif->isEstVu(),
                'typeNotif' => $notif->getTypeNotif()?->getTypeNotif(),
            ];
        }

        return new JsonResponse([
            'notifications' => $notifications
        ]);
    }


}