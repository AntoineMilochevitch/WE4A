<?php

namespace App\Entity;

use App\Repository\ElementRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ElementRepository::class)]
class Element
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    private ?int $id;

    #[ORM\ManyToOne(targetEntity: Type::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Type $idType;


    #[ORM\Column(type: 'string', length: 255)]
    private ?string $titre ;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $date;

    #[ORM\Column(type: 'integer', nullable: true)]
    private ?int $ordre = null;

    #[ORM\Column(type: Types::BOOLEAN)]
    #[ORM\Options(default: false)]
    private ?bool $estVisible;

    #[ORM\ManyToMany(targetEntity: Section::class, mappedBy: 'elements')]
    private Collection $sections;

    public function __construct()
    {
        $this->sections = new ArrayCollection();
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

    public function getIdType(): ?Type
    {
        return $this->idType;
    }

    public function setIdType(Type $idType): static
    {
        $this->idType = $idType;

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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

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

    public function isEstVisible(): ?bool
    {
        return $this->estVisible;
    }

    public function setEstVisible(bool $estVisible): static
    {
        $this->estVisible = $estVisible;

        return $this;
    }

    public function getSections(): Collection
    {
        return $this->sections;
    }

    public function addSection(Section $section): static
    {
        if (!$this->sections->contains($section)) {
            $this->sections[] = $section;
            $section->addElement($this);
        }

        return $this;
    }

    public function removeSection(Section $section): static
    {
        if ($this->sections->removeElement($section)) {
            $section->removeElement($this);
        }

        return $this;
    }

}
