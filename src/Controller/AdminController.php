<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Users;
use App\Entity\UserUe;
use App\Repository\UsersRepository;
use App\Repository\UserUeRepository;
use App\Entity\UE;
use App\Repository\UeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Psr\Log\LoggerInterface;
class AdminController extends AbstractController
{
    #[Route('/admin', name: 'admin')]
    public function index(EntityManagerInterface $entityManager, UsersRepository $usersRepository, UeRepository $ueRepository): Response
    {
        $users = $usersRepository->allUsers();
        $ue = $ueRepository->allUE();

        return $this->render('admin/admin.html.twig', [
            'controller_name' => 'AdminController',
            'courses' => $ue,
            'users' => $users,
        ]);
    }

    // Fonction qui permet de récuperer les infos des utilisateurs et des cours de la base de données
    #[Route('/api/admin', name: 'api_admin')]
    public function getInfo(UsersRepository $usersRepository, UeRepository $ueRepository, UserUeRepository $userUeRepository): JsonResponse
    {
        $users = $usersRepository->allUsers();
        $ue = $ueRepository->allUE();
        $userUe = $userUeRepository->findAll();

        $usersData = [];
        foreach ($users as $user) {
            $inscriptions =
                array_values( // Réindexe les résultats pour forcer un tableau "propre"
                    array_map(
                        fn($relation) => $relation['ue_id'],
                        array_filter($userUe, fn($relation) => $relation['user_id'] === $user['id'])
                    )
                );

            $usersData[] = [
                'id' => $user['id'],
                'nom' => $user['nom'],
                'prenom' => $user['prenom'],
                'email' => $user['email'],
                'roles' => $user['roles'],
                'inscriptions' => $inscriptions,
            ];
        }

        $coursesData = [];
        foreach ($ue as $course) {
            $enrolledUsers =
                array_values( // Réindexe les résultats pour forcer un tableau "propre"
                    array_map(
                        fn($relation) => $relation['user_id'],
                        array_filter($userUe, fn($relation) => $relation['ue_id'] === $course['id'])
                    )
                );

            $coursesData[] = [
                'id' => $course['id'],
                'code' => $course['code'],
                'nom' => $course['nom'],
                'description' => $course['description'],
                'image' => $course['image'],
                'users' => $enrolledUsers,
            ];
        }

        return new JsonResponse([
            'users' => $usersData,
            'courses' => $coursesData,
        ]);
    }


    #[Route('/api/admin/users', name: 'api_admin_users')]
    public function getAllUsers(EntityManagerInterface $entityManager, UsersRepository $usersRepository, UeRepository $ueRepository): JsonResponse
    {
        $users = $usersRepository->allUsers();

        $responseData = [];

        foreach ($users as $user) {
            $roles = [];
            foreach ($user->getRoles() as $role) {
                $roles[] = $role->getNomRole();
            }

            $inscriptions = [];
            foreach ($user->getUserUes() as $userUe) {
                $inscriptions[] = $userUe->getUe()->getCode();
            }

            $responseData[] = [
                'id' => $user->getId(),
                'nom' => $user->getNom(),
                'prenom' => $user->getPrenom(),
                'email' => $user->getEmail(),
                'roles' => $roles,
                'inscriptions' => $inscriptions,
            ];
        }

        return new JsonResponse($responseData);
    }

    #[Route('/api/admin/courses', name: 'api_admin_courses')]
    public function getAllCoursesWithUsers(EntityManagerInterface $entityManager, UsersRepository $usersRepository, UeRepository $ueRepository): JsonResponse
    {
        // Récupérer tous les cours (UE) avec leurs utilisateurs inscrits
        $ue = $ueRepository->allUE();

        $responseData = [];

        foreach ($ue as $course) {
            $users = [];
            foreach ($course->getUserUes() as $userUe) {
                $user = $userUe->getUser();
                $roles = [];
                foreach ($user->getRoles() as $role) {
                    $roles[] = $role->getNomRole();
                }

                $users[] = [
                    'id' => $user->getId(),
                    'nom' => $user->getNom(),
                    'prenom' => $user->getPrenom(),
                    'email' => $user->getEmail(),
                    'roles' => $roles,
                ];
            }

            $responseData[] = [
                'id' => $course->getId(),
                'code' => $course->getCode(),
                'utilisateurs' => $users
            ];
        }

        return new JsonResponse($responseData);
    }


    #[Route('/api/admin/courses/{id}/users', name: 'api_admin_course_users')]
    public function getUsersByCourse(int $id, EntityManagerInterface $entityManager, UsersRepository $usersRepository, UeRepository $ueRepository): JsonResponse
    {
        $ue = $ueRepository->findUsersByCourse($id);

        if (!$ue) {
            return new JsonResponse(['error' => 'UE introuvable'], 404);
        }

        $responseData = [];
        foreach ($ue as $userUe) {
            $user = $userUe->getUser();
            $roles = [];
            foreach ($user->getRoles() as $role) {
                $roles[] = $role->getNomRole();
            }

            $responseData[] = [
                'id' => $user->getId(),
                'nom' => $user->getNom(),
                'prenom' => $user->getPrenom(),
                'email' => $user->getEmail(),
                'roles' => $roles,
            ];
        }

        return new JsonResponse($responseData);
    }

    // Fonction qui met à jour la base de données pour modifier un utilisateur
    #[Route('/api/admin/update-user', name: 'api_admin_update_user', methods: ['POST'])]
    public function updateUser(Request $request, UsersRepository $usersRepository, UeRepository $ueRepository, EntityManagerInterface $entityManager): JsonResponse {
        // Décoder les données envoyées en JSON par la requêter
        $data = json_decode($request->getContent(), true);

        // Vérifier si toutes les informations nécessaires sont reçues
        if (!isset($data['id'], $data['nom'], $data['prenom'], $data['email'], $data['roles'])) {
            return new JsonResponse(['error' => 'Données manquantes'], Response::HTTP_BAD_REQUEST);
        }

        // Récupérer l'utilisateur à modifier (par son ID)
        $user = $usersRepository->find($data['id']);
        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], Response::HTTP_NOT_FOUND);
        }

        // Mettre à jour les champs de l’utilisateur avec les données reçues
        $user->setNom($data['nom']);
        $user->setPrenom($data['prenom']);
        $user->setEmail($data['email']);
        $user->setRoles($data['roles']);

        foreach ($user->getUserUes() as $existingUserUe) {
            $entityManager->remove($existingUserUe); // Supprime l'association existante
        }
        $entityManager->flush();

        $ueIds = $data['inscriptions']; // Liste des IDs des UE envoyés
        foreach ($ueIds as $ueId) {
            $ue = $ueRepository->find($ueId);
            if (!$ue) {
                return new JsonResponse(['error' => "UE avec l'ID $ueId introuvable."], Response::HTTP_NOT_FOUND);
            }

            // Créer une nouvelle relation UserUe
            $userUe = new UserUe();
            $userUe->setUser($user);
            $userUe->setUe($ue);

            $entityManager->persist($userUe); // Persister la relation
        }

        $entityManager->flush();

        // Retourner une réponse de succès.
        return new JsonResponse(['message' => 'Utilisateur mis à jour avec succès']);
    }

// Fonction qui met à jour la base de données pour modifier un cours
    #[Route('/api/admin/update-course', name: 'api_admin_update_course', methods: ['POST'])]
    public function updateCourse(Request $request, UsersRepository $usersRepository, UeRepository $ueRepository, EntityManagerInterface $entityManager): JsonResponse {
        // Décoder les données envoyées en JSON par la requêter
        $data = json_decode($request->getContent(), true);

        // Vérifier si toutes les informations nécessaires sont reçues
        if (!isset($data['id'], $data['code'], $data['nom'], $data['description'])) {
            return new JsonResponse(['error' => 'Données manquantes'], Response::HTTP_BAD_REQUEST);
        }

        // Récupérer le cours à modifier (par son ID)
        $ue = $ueRepository ->find($data['id']);
        if (!$ue) {
            return new JsonResponse(['error' => 'UE non trouvée'], Response::HTTP_NOT_FOUND);
        }

        // Mettre à jour les champs de l’UE avec les données reçues
        $ue->setCode($data['code']);
        $ue->setNom($data['nom']);
        $ue->setDescription($data['description']);

        foreach ($ue->getUserUes() as $existingUserUe) {
            $entityManager->remove($existingUserUe); // Supprime l'association existante
        }
        $entityManager->flush();

        $userIds = $data['users']; // Liste des IDs des UE envoyés
        foreach ($userIds as $userId) {
            $user = $usersRepository->find($userId);
            if (!$user) {
                return new JsonResponse(['error' => "User avec l'ID $userId introuvable."], Response::HTTP_NOT_FOUND);
            }

            // Créer une nouvelle relation UserUe
            $userUe = new UserUe();
            $userUe->setUser($user);
            $userUe->setUe($ue);

            $entityManager->persist($userUe); // Persister la relation
        }

        $entityManager->flush();

        // Retourner une réponse de succès.
        return new JsonResponse(['message' => 'UE mis à jour avec succès']);
    }

    // Fonction qui met à jour la base de données pour créer un utilisateur
    #[Route('/api/admin/create-user', name: 'api_admin_create_user', methods: ['POST'])]
    public function createUser(Request $request, EntityManagerInterface $entityManager, UeRepository $ueRepository, UserPasswordHasherInterface $userPasswordHasher): JsonResponse
    {
        // Décoder les données JSON envoyées avec la requête
        $data = json_decode($request->getContent(), true);

        // Vérifier si toutes les informations nécessaires sont présentes
        if (!isset($data['nom'], $data['prenom'], $data['email'], $data['roles'], $data['password'])) {
            return new JsonResponse(['error' => 'Données manquantes'], Response::HTTP_BAD_REQUEST);
        }

        // Créer une nouvelle entité Users
        $user = new Users();
        $user->setNom($data['nom']);
        $user->setPrenom($data['prenom']);
        $user->setEmail($data['email']);
        $user->setRoles($data['roles']);
        $user->setPassword($userPasswordHasher->hashPassword($user, $data['password']));

        $entityManager->persist($user);
        $entityManager->flush();

        if (isset($data['inscriptions'])) {
            $ueIds = $data['inscriptions']; // Liste des IDs des UE
            foreach ($ueIds as $ueId) {
                $ue = $ueRepository->find($ueId);
                if (!$ue) {
                    return new JsonResponse(['error' => "UE avec l'ID $ueId introuvable."], Response::HTTP_NOT_FOUND);
                }

                // Créer une nouvelle association entre l'utilisateur et l'UE
                $userUe = new UserUe();
                $userUe->setUser($user);
                $userUe->setUe($ue);
                $entityManager->persist($userUe);
                $entityManager->flush();
            }
        }

        // Enregistrer toutes les modifications dans la base de données
        $entityManager->flush();

        // Retourner une réponse de succès
        return new JsonResponse([
            'message' => 'Utilisateur créé avec succès',
            'user' => [
                'id' => $user->getId(), // L'ID est maintenant généré par Doctrine
                'nom' => $user->getNom(),
                'prenom' => $user->getPrenom(),
                'password' => $user->getPassword(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
                'inscriptions' => $data['inscriptions'] ?? [], // Retourne les inscriptions si fournies
            ],
        ]);

    }

    // Fonction qui met à jour la base de données pour créer un cours
    #[Route('/api/admin/create-course', name: 'api_admin_create_course', methods: ['POST'])]
    public function createCourse(Request $request, EntityManagerInterface $entityManager, UsersRepository $usersRepository,  LoggerInterface $logger): JsonResponse
    {
        // Décoder les données JSON envoyées avec la requête
        $data = $request->request->all();
        $uploadedFile = $request->files->get('image'); // Récupérer le fichier image

        // Vérifier les données reçues
        if (!isset($data['code'], $data['nom'], $data['description'])) {
            return new JsonResponse(['error' => 'Données manquantes'], Response::HTTP_BAD_REQUEST);
        }

        // Créer une nouvelle entité UE
        $course = new UE();
        $course->setCode($data['code']);
        $course->setNom($data['nom']);
        $course->setDescription($data['description']);

        if ($uploadedFile) {
            // Vérifier le type de fichier
            $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!in_array($uploadedFile->getMimeType(), $allowedMimeTypes)) {
                return new JsonResponse(['error' => 'Type de fichier non valide'], 400);
            }

            // Créer un nom de fichier unique
            $newFilename = uniqid() . '.' . $uploadedFile->guessExtension();
            $uploadDir = $this->getParameter('kernel.project_dir') . '/public/images';

            // Déplacer le fichier téléchargé
            $uploadedFile->move($uploadDir, $newFilename);

            // Enregistrer le nom de l'image dans l'entité
            $course->setImage($newFilename);
        }
        else {
            $course->setImage('default.jpg'); // Nom de l'image par défaut
        }

        // Sauvegarder dans la base de données
        $entityManager->persist($course);
        $entityManager->flush();
        $logger->info('Contenu de users dans la requête', [
            'users' => $data['users'] ?? null,
        ]);
        $users = $data['users'] ?? [];

        if (!empty($users)) {// Liste des IDs des utilisateurs
            foreach ($users as $userId) {
                $user = $usersRepository->find($userId);
                if (!$user) {
                    return new JsonResponse(['error' => "Utilisateur avec l'ID $userId introuvable."], Response::HTTP_NOT_FOUND);
                }

                // Créer une nouvelle association entre l'utilisateur et l'UE
                $userUe = new UserUe();
                $userUe->setUser($user);
                $userUe->setUe($course);

                $entityManager->persist($userUe);
                $entityManager->flush();
            }
            $entityManager->flush();
        }



        $entityManager->flush();

        // Retourner une réponse JSON
        return new JsonResponse([
            'message' => 'Cours créé avec succès',
            'course' => [
                'id' => $course->getId(),
                'code' => $course->getCode(),
                'nom' => $course->getNom(),
                'description' => $course->getDescription(),
                'image' => $course->getImage(),
                'users' => $data['users'] ?? []
            ],
        ]);
    }

    // Fonction qui met à jour la base de données pour supprimer un élément (utilisateur ou cours)
    #[Route('/api/admin/delete', name: 'api_admin_delete', methods: ['DELETE'])]
    public function deleteElement(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $id = $data['id'] ?? null;
        $type = $data['type'] ?? null;

        if (!$id || !$type) {
            return new JsonResponse(['error' => 'Invalid data'], 400);
        }

        if ($type === 'user') {
            $user = $em->getRepository(Users::class)->find($id);
            if (!$user) {
                return new JsonResponse(['error' => 'User not found'], 404);
            }
            foreach ($user->getUserUes() as $userUe) {
                $em->remove($userUe);
            }

            $em->remove($user); // Supprimer l'utilisateur après avoir supprimé les relations
            $em->flush();

            return new JsonResponse(['success' => true, 'message' => 'User deleted with associated relations.']);
        }
        if ($type === 'course') {
            $course = $em->getRepository(Ue::class)->find($id);
            if (!$course) {
                return new JsonResponse(['error' => 'Course not found'], 404);
            }

            $em->remove($course);
            $em->flush();

            return new JsonResponse(['success' => true, 'message' => 'Course deleted successfully.']);
        }

        return new JsonResponse(['error' => 'Invalid type'], 400);

    }



}








