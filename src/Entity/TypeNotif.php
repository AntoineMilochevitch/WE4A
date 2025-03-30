<?php

namespace App\Entity;

use App\Repository\TypeNotifRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TypeNotifRepository::class)]
class TypeNotif
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id;

    #[ORM\Column(type: 'string', length: 255)]
    private ?string $typeNotif;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getTypeNotif(): ?string
    {
        return $this->typeNotif;
    }

    public function setTypeNotif(string $typeNotif): static
    {
        $this->typeNotif = $typeNotif;

        return $this;
    }
}
