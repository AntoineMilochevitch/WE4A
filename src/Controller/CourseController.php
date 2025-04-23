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
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Mime\MimeTypes;
use Psr\Log\LoggerInterface;

class CourseController extends AbstractController
{

    private function handleFileUpload(?string $base64File, array $allowedMimeTypes): ?string
    {
        if (!$base64File) {
            return null;
        }

        // Décoder le fichier base64
        $fileData = base64_decode($base64File);
        if ($fileData === false) {
            throw new \Exception('Fichier invalide.');
        }

        // Détecter le type MIME
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->buffer($fileData);

        if (!in_array($mimeType, $allowedMimeTypes)) {
            throw new \Exception('Type de fichier non autorisé.');
        }

        return $fileData; // Retourne les données du fichier prêtes à être enregistrées
    }

    /**
     * Route pour afficher la page de cours
     * @Route("/course/{ueCode}", name="course_page", methods={"GET"})
     * @param string $ueCode
     * @return \Symfony\Component\HttpFoundation\Response
     */
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

    /**
     * Route pour récupérer les sections d'un cours
     * @Route("/api/course/{ueId}/sections", name="get_course_sections", methods={"GET"})
     * @param int $ueId
     * @return JsonResponse
     */
    #[Route('/api/course/{ueId}/sections', name: 'get_course_sections', methods: ['GET'])]
    public function getSections(int $ueId, EntityManagerInterface $entityManager): JsonResponse
    {
        $sectionRepository = $entityManager->getRepository(Section::class);
        // Récupérer l'UE par son ID
        $sections = $sectionRepository->findBy(
            ['idUe' => $ueId],
            ['ordre' => 'ASC'] // Tri par ordre croissant
        );

        $data = [];
        foreach ($sections as $section) {
            $elements = [];
            // Récupérer les éléments associés à la section
            foreach ($section->getElements() as $element) {
                $elements[] = [
                    'id' => $element->getId(),
                    'type' => $element->getIdType()->getNomType(),
                    'titre' => $element->getTitre(),
                    'description' => $element->getDescription(),
                    'date' => $element->getDate()->format('Y-m-d'),
                    'ordre' => $element->getOrdre(),
                    'importance' => $element->getImportance(),
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
    /**
     * Route pour récupérer les utilisateurs d'un cours
     * @Route("/api/course/{ueId}/users", name="get_course_users", methods={"GET"})
     * @param int $ueId
     * @return JsonResponse
     */
    #[Route('/api/course/{ueId}/users', name: 'get_course_users', methods: ['GET'])]
    public function getUsers(int $ueId, EntityManagerInterface $entityManager): JsonResponse
    {
        $ue = $entityManager->getRepository(Ue::class)->find($ueId); // Récupérer l'UE par son ID

        if (!$ue) {
            return new JsonResponse(['error' => 'UE non trouvée'], 404);
        }

        $users = $ue->getUserUes();

        $data = [];
        // Récupérer les utilisateurs associés à l'UE
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

    /**
     * Route pour ajouter une section à un cours
     * @Route("/api/course/types", name="get_course_types", methods={"GET"})
     * @return JsonResponse
     */
    #[Route('/api/course/{ueId}/add_section', name: 'add_section', methods: ['POST'])]
    public function addSection(int $ueId, EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        try {
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
                $type = $entityManager->getRepository(Type::class)->findOneBy(['nomType' => $elem['type']]);

                if (!$type) {
                    return new JsonResponse(['error' => 'Type non trouvé pour l\'élément : ' . $elem['type']], 400);
                }

                $element = new Element();
                $element->setTitre($elem['titre']);
                $element->setDescription($elem['description'] ?? null);
                $element->setDate(new \DateTime());
                $element->setIdType($type);
                $element->setOrdre(0);
                $element->setEstVisible(true);

                if (!empty($elem['fichier'])) {
                    try {
                        $allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png']; // Types MIME autorisés
                        $fileContent = $this->handleFileUpload($elem['fichier'], $allowedMimeTypes);

                        // Récupérer le nom du fichier original
                        $originalFileName = $elem['fileName'] ?? 'fichier_inconnu';

                        // Sérialiser les données du fichier
                        $fileData = [
                            'name' => $originalFileName,
                            'data' => base64_encode($fileContent),
                        ];
                        $serializedData = json_encode($fileData);

                        $element->setFichier($serializedData); // Assigner les données sérialisées
                    } catch (\Exception $e) {
                        return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
                    }
                }

                $section->addElement($element);
                $entityManager->persist($element);
            }

            $entityManager->flush();

            return new JsonResponse([
                'message' => 'Section ajoutée avec succès',
                'id' => $section->getId()
            ]);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }


    /**
     * Route pour ajouter un élément à une section
     * @Route("/api/course/{ueId}/add_element", name="add_element", methods={"POST"})
     * @param int $ueId
     * @return JsonResponse
     */
    #[Route('/api/course/{ueId}/add_element', name: 'add_element', methods: ['POST'])]
    function addElement(int $ueId, EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $ue = $entityManager->getRepository(Ue::class)->find($ueId); // Récupérer l'UE par son ID

        if (!$ue) {
            return new JsonResponse(['error' => 'UE non trouvée'], 404);
        }

        $data = json_decode($request->getContent(), true); // Décoder le JSON

        if (!isset($data['sectionId'], $data['titre'], $data['type'])) {
            return new JsonResponse(['error' => 'Section ID, titre et type requis'], 400);
        }

        // Sectionner les données
        $section = $entityManager->getRepository(Section::class)->find($data['sectionId']);
        if (!$section) {
            return new JsonResponse(['error' => 'Section non trouvée'], 404);
        }

        $type = $entityManager->getRepository(Type::class)->findOneBy(['nomType' => $data['type']]);
        if (!$type) {
            return new JsonResponse(['error' => 'Type non trouvé'], 404);
        }
        // Sélectionner l'ordre maximum d'éléments
        $maxElementOrder = $entityManager->getRepository(Element::class)
            ->createQueryBuilder('e')
            ->select('MAX(e.ordre)')
            ->join('e.sections', 's')
            ->where('s.id = :sectionId')
            ->setParameter('sectionId', $section->getId())
            ->getQuery()
            ->getSingleScalarResult();


        // Créer un nouvel élément
        $element = new Element();
        $element->setTitre($data['titre']);
        $element->setDescription($data['description'] ?? null);
        $element->setDate(new \DateTime());
        $element->setIdType($type);
        $element->setOrdre($maxElementOrder + 1);
        $element->setEstVisible(true);
        if (!empty($data['fichier'])) {
            try {
                $allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png']; // Types MIME autorisés
                $fileContent = $this->handleFileUpload($data['fichier'], $allowedMimeTypes);

                // Récupérer le nom du fichier original
                $originalFileName = $data['fileName'] ?? 'fichier_inconnu';

                // Sérialiser les données du fichier
                $fileData = [
                    'name' => $originalFileName,
                    'data' => base64_encode($fileContent),
                ];
                $serializedData = json_encode($fileData);

                $element->setFichier($serializedData); // Assigner les données sérialisées
            } catch (\Exception $e) {
                return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
            }
        }
        $element->setImportance($data['importance'] ?? null);
        $section->addElement($element);

        $entityManager->persist($element);
        $entityManager->flush();

        return new JsonResponse([
            'message' => 'Élément ajouté avec succès',
            'id' => $element->getId()
        ]);
    }

    /**
     * Route pour supprimer une section d'un cours
     * @Route("/api/course/{ueId}/delete_section/{sectionId}", name="delete_section", methods={"DELETE"})
     * @param int $sectionId
     * @return JsonResponse
     */
    #[Route('/api/course/{ueId}/delete_section/{sectionId}', name: 'delete_section', methods: ['DELETE'])]
    function deleteSection(int $sectionId, EntityManagerInterface $entityManager): JsonResponse
    {
        $section = $entityManager->getRepository(Section::class)->find($sectionId); // Récupérer la section par son ID

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

    /**
     * Route pour supprimer un élément d'une section
     * @Route("/api/course/{ueId}/delete_element/{sectionId}/{elementId}", name="delete_element", methods={"DELETE"})
     * @param int $sectionId
     * @param int $elementId
     * @return JsonResponse
     */
    #[Route('/api/course/{ueId}/delete_element/{sectionId}/{elementId}', name: 'delete_element', methods: ['DELETE'])]
    function deleteElement(int $sectionId, int $elementId, EntityManagerInterface $entityManager): JsonResponse
    {
        $section = $entityManager->getRepository(Section::class)->find($sectionId); // Récupérer la section par son ID
        $element = $entityManager->getRepository(Element::class)->find($elementId); // Récupérer l'élément par son ID

        if (!$element || !$section) {
            return new JsonResponse(['error' => 'Élément non trouvé'], 404);
        }

        // supprimer l'élément de la section
        $section->removeElement($element);
        $entityManager->remove($element);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Élément supprimé avec succès']);
    }

    /**
     * Route pour mettre à jour une section d'un cours
     * @Route("/api/course/{ueId}/update_section/{sectionId}", name="update_section", methods={"PUT"})
     * @param int $sectionId
     * @return JsonResponse
     */
    #[Route('/api/course/{ueId}/update_section/{sectionId}', name: 'update_section', methods: ['PUT'])]
    public function updateSection(int $sectionId, EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $section = $entityManager->getRepository(Section::class)->find($sectionId); // Récupérer la section par son ID

        if (!$section) {
            return new JsonResponse(['error' => 'Section non trouvée'], 404);
        }

        // Décoder le JSON
        $data = json_decode($request->getContent(), true);

        if (isset($data['titre'])) {
            $section->setTitre($data['titre']);
        }

        // Mettre à jour la date de la section
        if (isset($data['elements'])) {
            foreach ($data['elements'] as $elementData) {
                $element = $entityManager->getRepository(Element::class)->find($elementData['id']);
                if ($element) {
                    $element->setTitre($elementData['titre']);
                    $element->setDescription($elementData['description'] ?? null);
                    $element->setDate(new \DateTime($elementData['date']));
                    // Mettre à jour l'importance
                    if (isset($elementData['importance'])) {
                        $element->setImportance($elementData['importance']);
                    }

                    // Mettre à jour le fichier si modifié
                    if (!empty($elementData['fichier'])) {
                        $allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
                        $fileContent = base64_decode($elementData['fichier']);
                        $finfo = new \finfo(FILEINFO_MIME_TYPE);
                        $mimeType = $finfo->buffer($fileContent);

                        if (!in_array($mimeType, $allowedMimeTypes)) {
                            return new JsonResponse(['error' => 'Type de fichier non autorisé'], 400);
                        }

                        $fileData = [
                            'name' => $elementData['fileName'] ?? 'fichier_inconnu',
                            'data' => base64_encode($fileContent),
                        ];
                        $element->setFichier(json_encode($fileData));
                    }
                }
            }
        }
        $entityManager->flush();

        return new JsonResponse(['message' => 'Section mise à jour avec succès']);
    }

    /**
     * Route pour télécharger un fichier d'un élément
     * @Route("/api/course/{ueId}/download_file/{elementId}", name="download_file", methods={"GET"})
     * @param int $elementId
     * @return Response
     */
    #[Route('/api/course/{ueId}/download_file/{elementId}', name: 'download_file', methods: ['GET'])]
    public function downloadFile(int $elementId, EntityManagerInterface $entityManager, LoggerInterface $logger): Response
    {
        $logger->info("Téléchargement du fichier pour l'élément ID: {$elementId}");

        $element = $entityManager->getRepository(Element::class)->find($elementId);

        if (!$element || !$element->getFichier()) {
            $logger->error("Fichier non trouvé pour l'élément ID: {$elementId}");
            return new Response('Fichier non trouvé.', Response::HTTP_NOT_FOUND);
        }

        // Convertir la ressource BLOB en chaîne
        $fichierResource = $element->getFichier();
        $fichierContent = stream_get_contents($fichierResource);

        if ($fichierContent === false) {
            $logger->error("Erreur lors de la lecture du fichier pour l'élément ID: {$elementId}");
            return new Response('Erreur lors de la lecture du fichier.', Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $fileData = json_decode($fichierContent, true);
        if (!$fileData || !isset($fileData['data'])) {
            $logger->error("Données du fichier invalides pour l'élément ID: {$elementId}");
            return new Response('Données du fichier invalides.', Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        // Dans la méthode `downloadFile` du `CourseController`
        $fileName = $fileData['name'] ?? 'fichier_inconnu'; // Utiliser le nom du fichier original
        $fileContent = base64_decode($fileData['data']);

        if ($fileContent === false) {
            $logger->error("Erreur lors du décodage du fichier pour l'élément ID: {$elementId}");
            return new Response('Erreur lors du décodage du fichier.', Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $logger->info("Fichier téléchargé avec succès pour l'élément ID: {$elementId}");

        $response = new Response($fileContent);
        $response->headers->set('Content-Type', 'application/octet-stream');
        $response->headers->set('Content-Disposition', 'attachment; filename="' . $fileName . '"');

        return $response;
    }

}