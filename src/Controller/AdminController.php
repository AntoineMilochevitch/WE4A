<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Entity\UE;
use App\Repository\UeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class AdminController extends AbstractController
{
    #[Route('/admin', name: 'admin')]
    public function index(EntityManagerInterface $entityManager, UserRepository $userRepository, UeRepository $ueRepository): \Symfony\Component\HttpFoundation\Response
    {
        $users = $userRepository->allUsers();
        $ue = $ueRepository->allUE();

        return $this->render('admin/admin.html.twig', [
            'controller_name' => 'AdminController',
            'courses' => $ue,
            'users' => $users,
        ]);
    }


    #[Route('/api/admin', name: 'api_admin')]
    public function getInfo(EntityManagerInterface $entityManager, UserRepository $userRepository, UeRepository $ueRepository): JsonResponse
    {
        // Récupérer les utilisateurs
        $user = $userRepository->allUsers();

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
        }

        $usersData = [];
        foreach ($user as $entity) {
            $roles = [];
            //return $entity;
            /*foreach ($entity->getRoles() as $role) {
                $roles[] = $role->getNomRole();
            }*/
            /*
            $inscriptions = [];
            foreach ($entity->getUserUes() as $userUe) {
                $inscriptions[] = $userUe->getUe()->getCode();
            }*/

            $usersData[] = [
                'id' => $entity['id'],
                'nom' => $entity['nom'] ?? null,
                'prenom' => $entity['prenom'] ?? null,
                'email' => $entity['email'] ?? null/*,
                'role' => $entity->map(fn($role) => $role->getRole())->toArray()/*,
                'inscriptions' => $inscriptions*/
            ];

        }

        // Récupérer les cours
        $course = $ueRepository->allUE();

        if (!$course) {
            return new JsonResponse(['error' => 'Cours non trouvé'], 404);
        }

        $coursesData = [];
        /*
        foreach ($course as $entity) {
            $users = [];
            foreach ($entity->getUserUes() as $userUe) {
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
                    'roles' => $roles
                ];
            }

            $coursesData[] = [
                'id' => $entity['id'],
                'code' => $entity['code'] ?? null,
                'nom' => $entity['nom'] ?? null,
                'description' => $entity['description'] ?? null,
                'utilisateurs' => $users
            ];

        }*/

        $responseData = [
            'users' => $usersData,
            'courses' => $coursesData,
        ];

        return new JsonResponse($responseData);

    }


    #[Route('/api/admin/users', name: 'api_admin_users')]
    public function getAllUsers(EntityManagerInterface $entityManager, UserRepository $userRepository, UeRepository $ueRepository): JsonResponse
    {
        $users = $userRepository->allUsers();

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
    public function getAllCoursesWithUsers(EntityManagerInterface $entityManager, UserRepository $userRepository, UeRepository $ueRepository): JsonResponse
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
    public function getUsersByCourse(int $id, EntityManagerInterface $entityManager, UserRepository $userRepository, UeRepository $ueRepository): JsonResponse
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


}








