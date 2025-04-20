<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'user_ue')]
class UserUe
{
    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: Users::class, inversedBy: 'userUes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Users $user = null;

    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: Ue::class, inversedBy: 'userUes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Ue $ue = null;

    #[ORM\Column(type: 'boolean')]
    private bool $favoris = false;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $lastVisited = null;

    public function getUser(): ?Users
    {
        return $this->user;
    }

    public function setUser(?Users $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getUe(): ?Ue
    {
        return $this->ue;
    }

    public function setUe(?Ue $ue): static
    {
        $this->ue = $ue;

        return $this;
    }

    public function getFavoris(): bool
    {
        return $this->favoris;
    }

    public function setFavoris(bool $favoris): static
    {
        $this->favoris = $favoris;

        return $this;
    }

    public function getLastVisited(): ?\DateTimeInterface
    {
        return $this->lastVisited;
    }

    public function setLastVisited(?\DateTimeInterface $lastVisited): static
    {
        $this->lastVisited = $lastVisited;

        return $this;
    }
}