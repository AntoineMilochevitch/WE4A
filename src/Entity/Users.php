<?php

namespace App\Entity;

use App\Repository\UsersRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity(repositoryClass: UsersRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
#[UniqueEntity(fields: ['email'], message: 'There is already an account with this email')]
class Users implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $nom;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $prenom;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $avatar;

    #[ORM\Column(type: 'integer', nullable: true)]
    private ?int $score;

    #[ORM\ManyToMany(targetEntity: Notification::class, inversedBy: 'users')]
    #[ORM\JoinTable(name: 'user_notif')]
    private Collection $userNotifications;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: UserUe::class, cascade: ['persist', 'remove'])]
    private Collection $userUes;

    public function __construct()
    {
        $this->userNotifications = new ArrayCollection();
        $this->userUes = new ArrayCollection();
    }

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

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

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

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

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
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
