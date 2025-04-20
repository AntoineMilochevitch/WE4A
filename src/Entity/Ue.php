<?php

namespace App\Entity;

use App\Repository\UeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UeRepository::class)]
class Ue
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id;

    #[ORM\Column(type: 'string', length: 255)]
    private ?string $code;

    #[ORM\Column(type: 'string', length: 255)]
    private ?string $nom;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $image = null;

    #[ORM\OneToMany(mappedBy: 'ue', targetEntity: UserUe::class)]
    private Collection $userUes;

    public function __construct()
    {
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

    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(string $code): static
    {
        $this->code = $code;

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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): static
    {
        $this->image = $image;

        return $this;
    }

    public function getUserUes(): Collection
    {
        return $this->userUes;
    }

    public function setUserUes(Collection $userUes): static
    {
        $this->userUes = $userUes;

        return $this;
    }

    public function addUserUe(UserUe $userUe): static
    {
        if (!$this->userUes->contains($userUe)) {
            $this->userUes[] = $userUe;
            $userUe->setUe($this);
        }

        return $this;
    }

    public function removeUserUe(UserUe $userUe): static
    {
        if ($this->userUes->removeElement($userUe)) {
            if ($userUe->getUe() === $this) {
                $userUe->setUe(null);
            }
        }

        return $this;
    }

    public function findByCodeLike(string $search): array
    {
        return $this->createQueryBuilder('u')
            ->where('LOWER(u.code) LIKE :search')
            ->setParameter('search', '%' . strtolower($search) . '%')
            ->getQuery()
            ->getResult();
    }


}
