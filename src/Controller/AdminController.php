<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Users;
use App\Repository\UsersRepository;
use App\Repository\UserUeRepository;
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
            $enrolledUsers = array_map(
                fn($relation) => $relation['user_id'],
                array_filter($userUe, fn($relation) => $relation['ue_id'] === $course['id'])
            );

            $coursesData[] = [
                'id' => $course['id'],
                'code' => $course['code'],
                'nom' => $course['nom'],
                'description' => $course['description'],
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


}








