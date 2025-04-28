<?php

namespace App\Controller;

use App\Entity\Users;
use App\Repository\UsersRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

class ProfileController extends AbstractController
{
    /**
     * Récupérer le profil de l'utilisateur
     * @Route("/api/profile", name="api_profile")
     * @return JsonResponse
     */
    #[Route('/api/profile', name: 'api_profile')]
    public function index(EntityManagerInterface $entityManager, UsersRepository $userRepository): JsonResponse
    {
        $user = $this->getUser(); // ID de l'utilisateur actuel
        if (!$user) {
            throw $this->createNotFoundException('Utilisateur non trouvé');
        }

        // Récupérer tous les scores triés
        $scores = $userRepository->findAllScore();

        // Trouver la position du joueur
        $rank = null;
        foreach ($scores as $index => $score) {
            if ($score['id'] === $user->getId()) {
                $rank = $index + 1; // Les index commencent à 0, donc on ajoute 1
                break;
            }
        }

        // Récupérer les informations de l'utilisateur avec son classement
        $profile = [
            'id' => $user->getId(),
            'nom' => $user->getNom(),
            'prenom' => $user->getPrenom(),
            'email' => $user->getEmail(),
            'avatar' => $user->getAvatar(),
            'score' => $user->getScore(),
            'classement' => $rank,
        ];

        return new JsonResponse($profile);
    }

    /**
     * pour mettre à jour le score de l'utilisateur
     * @Route("/api/profile/update_score", name="update_score")
     * @return JsonResponse
     */
    #[Route('/api/profile/update_score', name: 'update_score', methods: ['POST'])]
    public function updateScore(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser(); // ID de l'utilisateur actuel
        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
        }

        $score = $request->request->get('score');
        if ($score !== null) {
            if ($user->getScore() < $score) {
                $user->setScore($score);
                $entityManager->persist($user);
                $entityManager->flush();
                return new JsonResponse(['message' => 'Score mis à jour avec succès']);
            }
        }

        return new JsonResponse(['error' => 'Score non fourni'], 400);
    }

    /**
     * Mettre à jour le profil de l'utilisateur
     * @Route("/api/profile/update_profile", name="update_profile")
     * @return JsonResponse
     */
    #[Route('/api/profile/update_profile', name: 'update_profile', methods: ['POST'])]
    public function updateProfile(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $userPasswordHasher): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
        }

        $email = $request->request->get('profile-email');
        $mdp = $request->request->get('profile-password');
        $mdp_confirm = $request->request->get('profile-password-confirm');
        $uploadedFile = $request->files->get('profile-avatar'); // Récupérer le fichier

        if ($uploadedFile) {
            // Vérifier si l'utilisateur a déjà un avatar
            $currentAvatar = $user->getAvatar();
            $excludedFiles = ['profil_pic1.jpg', 'profil_pic2.jpg', 'profil_pic3.jpg', 'profil_pic4.jpg', 'profil_pic5.jpg', 'profil_pic6.jpg', 'profil_pic7.jpg', 'profil_pic8.jpg'];

            if ($currentAvatar && !in_array($currentAvatar, $excludedFiles)) {
                $currentAvatarPath = $this->getParameter('kernel.project_dir') . '/public/images/' . $currentAvatar;

                // Supprimer l'ancienne image si elle existe
                if (file_exists($currentAvatarPath)) {
                    unlink($currentAvatarPath);
                }
            }

            // Vérifier le type de fichier
            $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!in_array($uploadedFile->getMimeType(), $allowedMimeTypes)) {
                return new JsonResponse(['error' => 'Type de fichier non valide'], 400);
            }

            // Générer un nom unique pour le fichier
            $newFilename = uniqid() . '.' . $uploadedFile->guessExtension();

            // Déplacer le fichier dans le dossier public/images
            $uploadDir = $this->getParameter('kernel.project_dir') . '/public/images';
            $uploadedFile->move($uploadDir, $newFilename);

            // Mettre à jour l'avatar de l'utilisateur
            $user->setAvatar($newFilename);
        }

        if ($email !== null && $email !== '') {
            if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $user->setEmail($email);
            } else {
                return new JsonResponse(['error' => 'Adresse email invalide'], 400);
            }
        }
        if ($mdp !== null && $mdp_confirm !== null && $mdp !== '' && $mdp_confirm !== '') {
            if ($mdp === $mdp_confirm) {
                $user->setPassword($userPasswordHasher->hashPassword($user, $mdp)); // Hachage du mot de passe
            } else {
                return new JsonResponse(['error' => 'Les mots de passe ne correspondent pas'], 400);
            }
        }

        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Profil mis à jour avec succès']);
    }
}