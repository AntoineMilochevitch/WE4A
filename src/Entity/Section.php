<?php

namespace App\Entity;

use App\Repository\SectionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SectionRepository::class)]
class Section
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    private ?int $id;

    #[ORM\ManyToOne(targetEntity: Ue::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Ue $idUe;

    #[ORM\Column(type: 'string', length: 255)]
    private ?string $titre;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $date;

    #[ORM\Column(type: 'integer', nullable: true)]
    private ?int $ordre = null;

    #[ORM\Column(type: Types::BOOLEAN)]
    #[ORM\Options(default: false)]
    private ?bool $estEpingle = null;

    #[ORM\Column(type: Types::BOOLEAN)]
    #[ORM\Options(default: false)]
    private ?bool $estVisible = null;

    #[ORM\ManyToMany(targetEntity: Element::class, inversedBy: 'section')]
    #[ORM\JoinTable(name: 'section_element')]
    private Collection $elements;

    public function __construct()
    {
        $this->elements = new ArrayCollection();
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

    public function getIdUe(): ?Ue
    {
        return $this->idUe;
    }

    public function setIdUe(Ue $idUe): static
    {
        $this->idUe = $idUe;

        return $this;
    }

    public function getTitre(): ?string
    {
        return $this->titre;
    }

    public function setTitre(string $titre): static
    {
        $this->titre = $titre;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getOrdre(): ?int
    {
        return $this->ordre;
    }

    public function setOrdre(?int $ordre): static
    {
        $this->ordre = $ordre;

        return $this;
    }

    public function isEstEpingle(): ?bool
    {
        return $this->estEpingle;
    }

    public function setEstEpingle(bool $estEpingle): static
    {
        $this->estEpingle = $estEpingle;

        return $this;
    }

    public function isEstVisible(): ?bool
    {
        return $this->estVisible;
    }

    public function setEstVisible(bool $estVisible): static
    {
        $this->estVisible = $estVisible;

        return $this;
    }

    public function getElements(): Collection
    {
        return $this->elements;
    }

    public function setElements(Collection $elements): static
    {
        $this->elements = $elements;

        return $this;
    }

    public function addElement(Element $element): static
    {
        if (!$this->elements->contains($element)) {
            $this->elements[] = $element;
        }

        return $this;
    }

    public function removeElement(Element $element): static
    {
        if ($this->elements->contains($element)) {
            $this->elements->removeElement($element);
        }

        return $this;
    }
}