<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id;

    #[ORM\Column(type: 'string', length: 255)]
    private ?string $nom;

    #[ORM\Column(type: 'string', length: 255)]
    private ?string $prenom;

    #[ORM\Column(type: 'string', length: 255)]
    private ?string $email;

    #[ORM\Column(type: 'string', length: 255)]
    private ?string $mdp;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $avatar;

    #[ORM\Column(type: 'integer', nullable: true)]
    private ?int $score;

    #[ORM\ManyToMany(targetEntity: Role::class, inversedBy: 'users')]
    #[ORM\JoinTable(name: 'user_role')]
    private Collection $roles;

    #[ORM\ManyToMany(targetEntity: Notification::class, inversedBy: 'users')]
    #[ORM\JoinTable(name: 'user_notif')]
    private Collection $userNotifications;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: UserUe::class, cascade: ['persist', 'remove'])]
    private Collection $userUes;

    public function __construct()
    {
        $this->roles = new ArrayCollection();
        $this->userNotifications = new ArrayCollection();
        $this->userUes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(string $prenom): static
    {
        $this->prenom = $prenom;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getMdp(): ?string
    {
        return $this->mdp;
    }

    public function setMdp(string $mdp): static
    {
        $this->mdp = $mdp;

        return $this;
    }

    public function getAvatar(): ?string
    {
        return $this->avatar;
    }

    public function setAvatar(?string $avatar): static
    {
        $this->avatar = $avatar;

        return $this;
    }

    public function getScore(): ?int
    {
        return $this->score;
    }

    public function setScore(?int $score): static
    {
        $this->score = $score;

        return $this;
    }

    public function getRoles(): Collection
    {
        return $this->roles;
    }

    public function setRoles(Collection $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    public function addRole(Role $role): static
    {
        if (!$this->roles->contains($role)) {
            $this->roles[] = $role;
        }

        return $this;
    }

    public function removeRole(Role $role): static
    {
        if ($this->roles->contains($role)) {
            $this->roles->removeElement($role);
        }

        return $this;
    }

    public function getUserNotifications(): Collection
    {
        return $this->userNotifications;
    }

    public function setUserNotifications(Collection $userNotifications): static
    {
        $this->userNotifications = $userNotifications;

        return $this;
    }

    public function addUserNotification(Notification $notification): static
    {
        if (!$this->userNotifications->contains($notification)) {
            $this->userNotifications[] = $notification;
        }

        return $this;
    }

    public function removeUserNotification(Notification $notification): static
    {
        if ($this->userNotifications->contains($notification)) {
            $this->userNotifications->removeElement($notification);
        }

        return $this;
    }

    public function getUserUes(): Collection
    {
        return $this->userUes;
    }

    public function setUserUe(Collection $ue): static
    {
        $this->userUes = $ue;

        return $this;
    }

    public function addUserUe(UserUe $userUe): static
    {
        if (!$this->userUes->contains($userUe)) {
            $this->userUes[] = $userUe;
            $userUe->setUser($this);
        }

        return $this;
    }

    public function removeUserUe(UserUe $userUe): static
    {
        if ($this->userUes->removeElement($userUe)) {
            if ($userUe->getUser() === $this) {
                $userUe->setUser(null);
            }
        }

        return $this;
    }
}