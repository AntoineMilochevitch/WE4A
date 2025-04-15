<?php

namespace App\Controller;

use App\Entity\Section;
use App\Entity\Ue;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Psr\Log\LoggerInterface;

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
    public function getSections(int $ueId, EntityManagerInterface $entityManager, LoggerInterface $logger): JsonResponse
    {
        $sectionRepository = $entityManager->getRepository(Section::class);
        $sections = $sectionRepository->findBy(
            ['idUe' => $ueId],
            ['ordre' => 'ASC'] // Tri par ordre croissant
        );

        $logger->info('Sections récupérées :', ['sections' => $sections]);

        $data = [];
        foreach ($sections as $section) {
            $elements = [];
            foreach ($section->getElements() as $element) {
                $elements[] = [
                    'id' => $element->getId(),
                    'type' => $element->getIdType()->getNomType(),
                    'titre' => $element->getTitre(),
                    'description' => $element->getDescription(),
                    'date' => $element->getDate()->format('Y-m-d H:i:s'),
                    'ordre' => $element->getOrdre(),
                ];
            }

            $data[] = [
                'id' => $section->getId(),
                'titre' => $section->getTitre(),
                'date' => $section->getDate()->format('Y-m-d H:i:s'),
                'ordre' => $section->getOrdre(),
                'elements' => $elements,
            ];
        }

        $logger->info('Données JSON renvoyées :', ['data' => $data]);


        return new JsonResponse($data);
    }
}