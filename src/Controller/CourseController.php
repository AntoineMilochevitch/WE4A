<?php

namespace App\Controller;

use App\Entity\Element;
use App\Entity\Section;
use App\Entity\Type;
use App\Entity\Ue;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class CourseController extends AbstractController
{

    #[Route('/course/{ueCode}', name: 'course_page', methods: ['GET'])]
    public function coursePage(string $ueCode, EntityManagerInterface $entityManager): \Symfony\Component\HttpFoundation\Response
    {
        $ue = $entityManager->getRepository(Ue::class)->findOneBy(['code' => $ueCode]);

        if (!$ue) {
            throw $this->createNotFoundException('UE non trouvée');
        }

        return $this->render('course/course.html.twig', [
            'ueId' => $ue->getId(),
        ]);
    }

    #[Route('/api/course/{ueId}/sections', name: 'get_course_sections', methods: ['GET'])]
    public function getSections(int $ueId, EntityManagerInterface $entityManager): JsonResponse
    {
        $sectionRepository = $entityManager->getRepository(Section::class);
        $sections = $sectionRepository->findBy(
            ['idUe' => $ueId],
            ['ordre' => 'ASC'] // Tri par ordre croissant
        );

        $data = [];
        foreach ($sections as $section) {
            $elements = [];
            foreach ($section->getElements() as $element) {
                $elements[] = [
                    'id' => $element->getId(),
                    'type' => $element->getIdType()->getNomType(),
                    'titre' => $element->getTitre(),
                    'description' => $element->getDescription(),
                    'date' => $element->getDate()->format('Y-m-d'),
                    'ordre' => $element->getOrdre(),
                ];
            }

            $data[] = [
                'id' => $section->getId(),
                'titre' => $section->getTitre(),
                'date' => $section->getDate()->format('Y-m-d'),
                'ordre' => $section->getOrdre(),
                'elements' => $elements,
            ];
        }

        return new JsonResponse($data);
    }
    #[Route('/api/course/{ueId}/users', name: 'get_course_users', methods: ['GET'])]
    public function getUsers(int $ueId, EntityManagerInterface $entityManager): JsonResponse
    {
        $ue = $entityManager->getRepository(Ue::class)->find($ueId);

        if (!$ue) {
            return new JsonResponse(['error' => 'UE non trouvée'], 404);
        }

        $users = $ue->getUserUes();

        $data = [];
        foreach ($users as $userUe) {
            $user = $userUe->getUser();
            $roles = $user->getRoles();
            $data[] = [
                'id' => $user->getId(),
                'nom' => $user->getNom(),
                'prenom' => $user->getPrenom(),
                'role' => $roles->map(fn($role) => $role->getNomRole())->toArray(),
                'avatar' => $user->getAvatar(),
            ];
        }

        return new JsonResponse($data);
    }

    #[Route('/api/course/{ueId}/add_section', name: 'add_section', methods: ['POST'])]
    public function addSection(int $ueId, EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $ue = $entityManager->getRepository(Ue::class)->find($ueId);

        if (!$ue) {
            return new JsonResponse(['error' => 'UE non trouvée'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['titre'])) {
            return new JsonResponse(['error' => 'Titre requis'], 400);
        }

        $section = new Section();
        $section->setTitre($data['titre']);
        $section->setDate(new \DateTime());
        $section->setIdUe($ue);
        $section->setEstVisible(true);
        $section->setEstEpingle(false);

        // Calculer l'ordre de la nouvelle section
        $maxOrder = $entityManager->getRepository(Section::class)
            ->createQueryBuilder('s')
            ->select('MAX(s.ordre)')
            ->where('s.idUe = :ueId')
            ->setParameter('ueId', $ueId)
            ->getQuery()
            ->getSingleScalarResult();

        $section->setOrdre($maxOrder + 1);

        $entityManager->persist($section);
        $entityManager->flush();

        foreach ($data['elements'] as $elem) {
            $maxElementOrder = $entityManager->getRepository(Element::class)
                ->createQueryBuilder('e')
                ->select('MAX(e.ordre)')
                ->join('e.sections', 's')
                ->where('s.id = :sectionId')
                ->setParameter('sectionId', $section->getId())
                ->getQuery()
                ->getSingleScalarResult();

            $type = $entityManager->getRepository(Type::class)->findOneBy(['nomType' => $elem['type']]);

            if (!$type) {
                return new JsonResponse(['error' => 'Type non trouvé pour l\'élément : ' . $elem['type']], 400);
            }


            $element = new Element();
            $element->setTitre($elem['titre']);
            $element->setDescription($elem['description'] ?? null);
            $element->setDate(new \DateTime());
            $element->setIdType($type);
            $element->setOrdre($maxElementOrder + 1);
            $section->addElement($element);
            $element->setEstVisible(true);
            $entityManager->persist($element);
        }

        $entityManager->flush();
        return new JsonResponse([
            'message' => 'Section ajoutée avec succès',
            'id' => $section->getId()
        ]);
    }

    #[Route('/api/course/{ueId}/add_element', name: 'add_element', methods: ['POST'])]
    function addElement(int $ueId, EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $ue = $entityManager->getRepository(Ue::class)->find($ueId);

        if (!$ue) {
            return new JsonResponse(['error' => 'UE non trouvée'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['sectionId'], $data['titre'], $data['type'])) {
            return new JsonResponse(['error' => 'Section ID, titre et type requis'], 400);
        }

        $section = $entityManager->getRepository(Section::class)->find($data['sectionId']);
        if (!$section) {
            return new JsonResponse(['error' => 'Section non trouvée'], 404);
        }

        $type = $entityManager->getRepository(Type::class)->findOneBy(['nomType' => $data['type']]);
        if (!$type) {
            return new JsonResponse(['error' => 'Type non trouvé'], 404);
        }
        $maxElementOrder = $entityManager->getRepository(Element::class)
            ->createQueryBuilder('e')
            ->select('MAX(e.ordre)')
            ->join('e.sections', 's')
            ->where('s.id = :sectionId')
            ->setParameter('sectionId', $section->getId())
            ->getQuery()
            ->getSingleScalarResult();

        $element = new Element();
        $element->setTitre($data['titre']);
        $element->setDescription($data['description'] ?? null);
        $element->setDate(new \DateTime());
        $element->setIdType($type);
        $element->setOrdre($maxElementOrder + 1);
        $element->setEstVisible(true);
        $section->addElement($element);

        $entityManager->persist($element);
        $entityManager->flush();

        return new JsonResponse([
            'message' => 'Élément ajouté avec succès',
            'id' => $element->getId()
        ]);
    }

    #[Route('/api/course/{ueId}/delete_section/{sectionId}', name: 'delete_section', methods: ['DELETE'])]
    function deleteSection(int $ueId, int $sectionId, EntityManagerInterface $entityManager): JsonResponse
    {
        $section = $entityManager->getRepository(Section::class)->find($sectionId);

        if (!$section) {
            return new JsonResponse(['error' => 'Section non trouvée'], 404);
        }

        // supprimer récursivement les éléments associés
        foreach ($section->getElements() as $element) {
            $section->removeElement($element);
            $entityManager->remove($element);
        }

        $entityManager->remove($section);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Section supprimée avec succès']);
    }

    #[Route('/api/course/{ueId}/delete_element/{sectionId}/{elementId}', name: 'delete_element', methods: ['DELETE'])]
    function deleteElement(int $ueId, int $sectionId, int $elementId, EntityManagerInterface $entityManager): JsonResponse
    {
        $section = $entityManager->getRepository(Section::class)->find($sectionId);
        $element = $entityManager->getRepository(Element::class)->find($elementId);

        if (!$element || !$section) {
            return new JsonResponse(['error' => 'Élément non trouvé'], 404);
        }

        $section->removeElement($element);
        $entityManager->remove($element);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Élément supprimé avec succès']);
    }

    #[Route('/api/course/{ueId}/update_section/{sectionId}', name: 'update_section', methods: ['PUT'])]
    public function updateSection(int $ueId, int $sectionId, EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $section = $entityManager->getRepository(Section::class)->find($sectionId);

        if (!$section) {
            return new JsonResponse(['error' => 'Section non trouvée'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['titre'])) {
            $section->setTitre($data['titre']);
        }

        if (isset($data['elements'])) {
            foreach ($data['elements'] as $elementData) {
                $element = $entityManager->getRepository(Element::class)->find($elementData['id']);
                if ($element) {
                    $element->setTitre($elementData['titre']);
                    $element->setDescription($elementData['description'] ?? null);
                    $element->setDate(new \DateTime($elementData['date']));
                }
            }
        }

        $entityManager->flush();

        return new JsonResponse(['message' => 'Section mise à jour avec succès']);
    }

}