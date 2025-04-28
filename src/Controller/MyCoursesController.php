<?php

namespace App\Controller;

use App\Entity\UserUe;
use App\Entity\Ue;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class MyCoursesController extends AbstractController
{

    /**
     * Pour récupérer les cours de l'utilisateur
     * @Route("/api/my-courses", name="api_my_courses", methods={"GET"})
     */
    #[Route('/api/my-courses', name: 'api_my_courses')]
    public function getCourses(EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $user = $this->getUser();

            if (!$user) {
                return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
            }

            if (in_array('ROLE_ADMIN', $user->getRoles())) {
                $allCourses = $entityManager->getRepository(Ue::class)->allUE();

                $courseData = [];
                foreach ($allCourses as $ue) {
                    $courseData[] = [
                        'id' => $ue['id'],
                        'nom' => $ue['nom'],
                        'code' => $ue['code'],
                        'image' => $ue['image'],
                        'description' => $ue['description'],
                    ];
                }

                return new JsonResponse($courseData);
            } else {
                $userUes = $user->getUserUes();

                if (!$userUes instanceof \Doctrine\Common\Collections\Collection || $userUes->isEmpty()) {
                    return new JsonResponse(['error' => 'Aucun cours trouvé'], 404);
                }

                $courseData = [];
                foreach ($userUes as $userUe) {
                    $ue = $userUe->getUe();
                    if (!$ue) {
                        continue;
                    }
                    $courseData[] = [
                        'id' => $ue->getId(),
                        'nom' => $ue->getNom(),
                        'code' => $ue->getCode(),
                        'image' => $ue->getImage(),
                        'description' => $ue->getDescription(),
                        'favoris' => $userUe->getFavoris(),
                        'lastActivity' => $userUe->getLastVisited(),
                    ];
                }

                return new JsonResponse($courseData);
            }
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Pour basculer l'état des favoris d'un cours
     * @Route("/api/toggle-favoris/{id}", name="toggle_favoris", methods={"POST"})
     * @param int $id
     */
    #[Route('/api/toggle-favoris/{id}', name: 'toggle_favoris', methods: ['POST'])]
    public function toggleFavoris(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        // Récupérer l'utilisateur avec l'ID 1
        $user = $this->getUser(); // ID de l'utilisateur actuel

        if (!$user) {
            return new JsonResponse(['success' => false, 'message' => 'Utilisateur non trouvé'], 404);
        }

        // Récupérer l'association UserUe pour cet utilisateur et l'UE
        $userUe = $entityManager->getRepository(UserUe::class)->findOneBy(['user' => $user, 'ue' => $id]);

        if (!$userUe) {
            return new JsonResponse(['success' => false, 'message' => 'Cours non trouvé'], 404);
        }

        // Basculer l'état des favoris
        $userUe->setFavoris(!$userUe->getFavoris());
        $entityManager->flush();

        return new JsonResponse([
            'success' => true,
            'isFavoris' => $userUe->getFavoris(),
        ]);
    }
}