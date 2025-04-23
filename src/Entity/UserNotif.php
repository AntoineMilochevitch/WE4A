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
    #[ORM\Column(name: 'users_id', type: 'integer')]
    private ?int $usersId = null;

    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: Notification::class)]
    #[ORM\JoinColumn(name: 'notification_id', referencedColumnName: 'id', nullable: false)]
    private ?Notification $notification = null;

    #[ORM\Column(type: Types::BOOLEAN, options: ['default' => false])]
    private ?bool $estVu = false;

    public function getUsersId(): ?int
    {
        return $this->usersId;
    }

    public function setUsersId(int $usersId): static
    {
        $this->usersId = $usersId;
        return $this;
    }

    public function getNotification(): ?Notification
    {
        return $this->notification;
    }

    public function setNotification(Notification $notification): static
    {
        $this->notification = $notification;
        return $this;
    }

    public function isEstVu(): ?bool
    {
        return $this->estVu;
    }

    public function setEstVu(bool $estVu): static
    {
        $this->estVu = $estVu;
        return $this;
    }
}
