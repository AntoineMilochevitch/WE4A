# Moodle Simplifié - WE4A

## 📘 Sujet

Ce projet est une plateforme Moodle simplifiée développée dans le cadre du module WE4A. Elle permet de gérer des Unités d’Enseignement (UE), avec un accès adapté selon le rôle de l’utilisateur (étudiant, professeur, administrateur).

## ⚙️ Technologies utilisées

- **Backend** : Symfony (PHP 8.x)
- **Base de données** : MySQL 10.4.28
- **Frontend** : Twig, JavaScript, CSS
- **ORM** : Doctrine
- **Authentification** : système basé sur rôles

## 🧠 Fonctionnalités principales

- Connexion avec authentification et rôles
- Affichage personnalisé des UE selon le profil utilisateur
- Téléversement et affichage de fichiers liés aux cours
- Interface de gestion du profil (avatar, score, classement)
- Mini-jeu Snake intégré pour la gamification
- Interface responsive légère et intuitive
- Système d'administration pour la gestion des UE et des utilisateurs

## 🚀 Installation & Utilisation

### 1. Installer les dépendances

```bash
composer install
```

### 2. Modifier le fichier `.env`

Modifier la ligne de configuration pour pointer vers votre base MariaDB :
```bash
DATABASE_URL="mysql://root:@127.0.0.1:3306/we4a?serverVersion=10.4.28-MariaDB&charset=utf8mb4"
```

### 3. Créer et peupler la base de données

1. Créer la base de données :
```bash
php bin/console doctrine:database:create
```

2. Exécuter les migrations :
```bash
php bin/console doctrine:migrations:migrate
```

3. (Optionnel) Peupler la base de données avec des données de test :
- Importer le fichier `data.sql` dans la base de données via phpMyAdmin.

### 4. Lancer le serveur

```bash
symfony server:start
```
Accéder à l'application via `http://127.0.0.1:8000`

## 🔐 Connexion

### Formats des identifiants
- **Email** : `nom.prenom@moodle.fr` (voir les données tests)
- **Mot de passe** : `nom` + premier caractère du prénom (ex: `dupontj` pour `dupont.julien`)

### Profils disponibles et intéressants

| Email                          | Mot de passe | Rôle           |
|-------------------------------|--------------|----------------|
| admin.admin@moodle.fr         | admina       | Administrateur |
| alexis.correard@moodle.fr     | correarda    | Étudiant       |
| prof1.prof1@moodle.fr         | prof1p       | Professeur     |

## Auteurs
- **Alexis CORREARD** : [GitHub](https://github.com/AlexiCor)
- **Nizar EL ANDALOUSSI BENBRAHIM** : [GitHub](https://github.com/Kingwizar)
- **Samuel MOLIERES** : [GitHub](https://github.com/SamuelMolieres)
- **Antoine MILOCHEVITCH** : [GitHub](https://github.com/AntoineMilochevitch)
