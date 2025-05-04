<?php

namespace App\Entity;

use App\Repository\UserNotifRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserNotifRepository::class)]
#[ORM\Table(name: 'user_notif')]
class UserNotif
{
    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: Users::class)]
    #[ORM\JoinColumn(name: 'users_id', referencedColumnName: 'id', nullable: false)]
    private ?Users $user = null;

    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: Notification::class)]
    #[ORM\JoinColumn(name: 'notification_id', referencedColumnName: 'id', nullable: false)]
    private ?Notification $notification = null;

    #[ORM\Column(type: Types::BOOLEAN, options: ['default' => false])]
    private ?bool $estVu = false;

    /**
     * Get the user associated with this notification.
     */
    public function getUser(): ?Users
    {
        return $this->user;
    }

    /**
     * Set the user for this notification.
     */
    public function setUser(Users $user): static
    {
        $this->user = $user;
        return $this;
    }

    /**
     * Get the notification entity.
     */
    public function getNotification(): ?Notification
    {
        return $this->notification;
    }

    /**
     * Set the notification.
     */
    public function setNotification(Notification $notification): static
    {
        $this->notification = $notification;
        return $this;
    }

    /**
     * Check if the notification has been seen.
     */
    public function isEstVu(): ?bool
    {
        return $this->estVu;
    }

    /**
     * Set the 'seen' status of the notification.
     */
    public function setEstVu(bool $estVu): static
    {
        $this->estVu = $estVu;
        return $this;
    }
}
