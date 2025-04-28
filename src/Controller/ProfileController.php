<?php

namespace App\Controller;

use Doctrine\DBAL\Connection;
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
    public function index(Connection $connection): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            throw $this->createNotFoundException('Utilisateur non trouvé');
        }

        // Requête SQL pour récupérer tous les scores triés
        $scores = $connection->fetchAllAssociative('SELECT id, score FROM users ORDER BY score DESC');

        // Trouver la position du joueur
        $rank = null;
        foreach ($scores as $index => $score) {
            if ($score['id'] === $user->getId()) {
                $rank = $index + 1;
                break;
            }
        }

        // Requête SQL pour récupérer les informations de l'utilisateur
        $profile = $connection->fetchAssociative('SELECT id, nom, prenom, email, avatar, score FROM users WHERE id = ?', [$user->getId()]);

        if (!$profile) {
            throw $this->createNotFoundException('Utilisateur non trouvé');
        }

        $profile['classement'] = $rank;

        return new JsonResponse($profile);
    }

    /**
     * pour mettre à jour le score de l'utilisateur
     * @Route("/api/profile/update_score", name="update_score")
     * @return JsonResponse
     */
    #[Route('/api/profile/update_score', name: 'update_score', methods: ['POST'])]
    public function updateScore(Request $request, Connection $connection): JsonResponse
    {
        $user = $this->getUser(); // ID de l'utilisateur actuel
        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
        }

        $score = $request->request->get('score');
        if ($score !== null) {
            $currentScore = $connection->fetchOne('SELECT score FROM users WHERE id = ?', [$user->getId()]);
            if ($currentScore < $score) {
                $connection->executeStatement('UPDATE users SET score = ? WHERE id = ?', [$score, $user->getId()]);
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
    public function updateProfile(Request $request, Connection $connection, UserPasswordHasherInterface $userPasswordHasher): JsonResponse
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
            $currentAvatar = $connection->fetchOne('SELECT avatar FROM users WHERE id = ?', [$user->getId()]);
            $excludedFiles = ['profil_pic1.jpg', 'profil_pic2.jpg', 'profil_pic3.jpg', 'profil_pic4.jpg', 'profil_pic5.jpg', 'profil_pic6.jpg', 'profil_pic7.jpg', 'profil_pic8.jpg'];

            if ($currentAvatar && !in_array($currentAvatar, $excludedFiles)) {
                $currentAvatarPath = $this->getParameter('kernel.project_dir') . '/public/images/' . $currentAvatar;

                if (file_exists($currentAvatarPath)) {
                    unlink($currentAvatarPath);
                }
            }

            $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!in_array($uploadedFile->getMimeType(), $allowedMimeTypes)) {
                return new JsonResponse(['error' => 'Type de fichier non valide'], 400);
            }

            $newFilename = uniqid() . '.' . $uploadedFile->guessExtension();
            $uploadDir = $this->getParameter('kernel.project_dir') . '/public/images';
            $uploadedFile->move($uploadDir, $newFilename);

            $connection->executeStatement('UPDATE users SET avatar = ? WHERE id = ?', [$newFilename, $user->getId()]);
        }

        if ($email !== null && $email !== '') {
            if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $connection->executeStatement('UPDATE users SET email = ? WHERE id = ?', [$email, $user->getId()]);
            } else {
                return new JsonResponse(['error' => 'Adresse email invalide'], 400);
            }
        }

        if ($mdp !== null && $mdp_confirm !== null && $mdp !== '' && $mdp_confirm !== '') {
            if ($mdp === $mdp_confirm) {
                $hashedPassword = $userPasswordHasher->hashPassword($user, $mdp);
                $connection->executeStatement('UPDATE users SET password = ? WHERE id = ?', [$hashedPassword, $user->getId()]);
            } else {
                return new JsonResponse(['error' => 'Les mots de passe ne correspondent pas'], 400);
            }
        }

        return new JsonResponse(['message' => 'Profil mis à jour avec succès']);
    }
}