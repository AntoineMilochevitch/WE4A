let utilisateurs = [];
let ue = [];

document.addEventListener('DOMContentLoaded', function() {
    const selectionDiv = document.querySelector('.selection');

    // Bouton qui permet d'afficher la liste des utilisateurs
    const utilisateursButton = document.createElement('button');
    utilisateursButton.textContent = 'Utilisateurs';
    utilisateursButton.addEventListener('click', showUtilisateurs);
    utilisateursButton.classList.add('btn-selection', 'btn-enabled');

    const ueButton = document.createElement('button');
    ueButton.textContent = 'UE';
    ueButton.addEventListener('click', showUE);
    ueButton.classList.add('btn-selection', 'btn-enabled');

    // Bouton qui permet d'afficher la liste des cours
    selectionDiv.appendChild(utilisateursButton);
    selectionDiv.appendChild(ueButton);

    // Création du div
    const contentDiv = document.querySelector('.content-display');

    fetchInfo();

    /*utilisateurs = [
        { id: 1, name: 'MOLIERES', first_name: 'Samuel', role: 'Etudiant' ,departement: 'INFO', inscription: ['WE4A', 'WE4B', 'SI40', 'AP4A']},
        { id: 2, name: 'EL ANDALOUSSI BENBRAHIM', first_name: 'Nizar', role: 'Etudiant' ,departement: 'INFO', inscription: ['WE4A', 'WE4B', 'SI40', 'AP4B']},
        { id: 3, name: 'MILOCHEVITCH', first_name: 'Antoine', role: 'Etudiant' ,departement: 'INFO', inscription: ['WE4A', 'WE4B', 'SI40', 'IA41']},
        { id: 4, name: 'CORREARD', first_name: 'Alexis', role: 'Etudiant' ,departement: 'INFO', inscription: ['WE4A', 'WE4B', 'SI40', 'IA41']},
        { id: 5, name: 'BOOL', first_name: 'George', role: 'Etudiant' ,departement: 'MECA', inscription: ['MT3F', 'MAA1', 'PS25']},
        { id: 6, name: 'LOVELACE', first_name: 'Ada', role: 'Etudiant' ,departement: 'IMSI', inscription: ['MT3F', 'PS25', 'CM1A', 'CM1B']},
        { id: 7, name: 'HAMILTON', first_name: 'Margaret', role: 'Etudiant' ,departement: 'ENERGIE', inscription: ['PS22', 'AP4A', 'MT3F']},
        { id: 8, name: 'TURING', first_name: 'Alan', role: 'Etudiant' ,departement: 'EDIM', inscription: ['PS25', 'MT3F', 'MAA1', 'CM1A']},
        { id: 9, name: 'AL-KHWARIZMI', first_name: 'Muḥammad', role: 'Etudiant' ,departement: 'INFO', inscription: ['WE4A', 'WE4B', 'SI40', 'IA41', 'AP4A', 'AP4B', 'MT3F']},
        { id: 10, name: 'PROF1', first_name: 'Prof1', role: 'Professeur' ,departement: 'INFO', inscription: ['WE4A', 'WE4B', 'SI40']},
        { id: 11, name: 'PROF2', first_name: 'Prof2', role: 'Professeur' ,departement: 'INFO', inscription: ['IA41', 'AP4A', 'AP4B']},
        { id: 12, name: 'PROF3', first_name: 'Prof3', role: 'Professeur' ,departement: 'MECA', inscription: ['MT3F', 'PS25', 'MAA1', 'CM1A', 'CM1B']},
    ];*/

    /*ue = [
        { id: 1, code: 'WE4A', libelle: 'Technologies et programmation WEB', description: 'Maîtriser les technologies Web permettant de créer des sites Web modernes'},
        { id: 2, code: 'WE4B', libelle: 'Technologies WEB avancées', description: 'Comprendre et appliquer une architecture web avancée à l\'aide d\'un Framework'},
        { id: 3, code: 'SI40', libelle: 'Systèmes d\'information', description: 'Mettre en œuvre des outils de conception de systèmes d\'information permettant la mise en application des méthodes associées'},
        { id: 4, code: 'IA41', libelle: 'Intelligence artificielle', description: 'Acquérir les compétences sur les principaux concepts et outils logiciels dédiés à l\'Intelligence Artificielle (IA)'},
        { id: 5, code: 'AP4A', libelle: 'Programmation Orientée Objet', description: 'Acquérir les compétences pour analyser et concevoir des applications en utilisant les principes de la POO'},
        { id: 6, code: 'AP4B', libelle: 'Programmation Orientée Objet', description: 'Programmation Orientée Objet: Modélisation UML et langage Java'},
        { id: 7, code: 'MT3F', libelle: 'Algèbre et analyse', description: 'Acquérir l\'essentiel des connaissances fondamentales en algèbre et en analyse, utiles à l\'ingénieur'},
        { id: 8, code: 'MAA1', libelle: 'Structure et propriétés des matériaux ', description: 'Appréhender et comprendre la structure des matériaux'},
        { id: 9, code: 'CM1A', libelle: 'Organisation de la matière - partie I', description: 'Connaître les grands principes de base pour la chimie des matériaux'},
        { id: 10, code: 'CM1B', libelle: 'Organisation de la matière - partie II', description: 'Décrire les concepts de base de la chimie générale : Solubilité, oxydo-réduction, cinétique chimique'},
        { id: 11, code: 'PS22', libelle: 'Electronique analogique', description: 'Donner les bases tant théoriques que pratiques de l\'électronique analogique'},
        { id: 12, code: 'PS25', libelle: 'Mécanique du solide', description: 'Apporter les bases générales indispensables pour l\'analyse cinématique et technologique des mécanismes'}
    ];*/

    async function fetchInfo() {
        fetch('/api/admin')
            .then(response => response.json())
            .then(data => {
                const { users, courses } = data;
                users.forEach(user => {
                    utilisateurs.push(user);
                })
                courses.forEach(course => {
                    ue.push(course);
                })
                showUtilisateurs();
            })
            .catch(error => console.error('Error fetching courses/users:', error));

        /*
        try {
            const usersResponse = await fetch('/api/admin/users');
            const utilisateurs = await usersResponse.json();
            console.log('Utilisateurs:', utilisateurs);

            const coursesResponse = await fetch('/api/admin/courses');
            const ue = await coursesResponse.json();
            console.log('Cours:', ue);

            showUtilisateurs(utilisateurs);
        } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
        }*/




        /*fetch('/api/admin/users')
            .then(response => response.json())
            .then(data => {
                data.forEach(user => {
                    utilisateurs.push(user);
                })
                showUtilisateurs();
            })
            .catch(error => console.error('Error fetching courses/users:', error));*/
    }

    async function fetchUsersByCourse(courseId) {
        try {
            const response = await fetch(`/api/admin/courses/${courseId}/users`);
            if (!response.ok) throw new Error("Erreur lors de la récupération des utilisateurs pour le cours");

            const users = await response.json();
            console.log(`Utilisateurs inscrits au cours ${courseId} :`, users);
            return users;
        } catch (error) {
            console.error(error.message);
        }
    }


    function showUtilisateurs() {
        contentDiv.innerHTML = ''; // Efface le contenu précédent

        const createButton = document.createElement('button');
        createButton.className = 'btn-create btn-action';
        createButton.style.float = 'right';
        createButton.textContent = 'Creer';
        createButton.onclick = function () {
            showForm(this);
        };
        contentDiv.appendChild(createButton);

        const header = document.createElement('h2');
        header.textContent = 'Liste des Utilisateurs';
        contentDiv.appendChild(header);

        let i = 0;
        const ul = document.createElement('ul');
        utilisateurs.forEach(utilisateur => {
            const li = document.createElement('li');
            li.id = `liUser-${i}`;

            const idSpan = document.createElement('span');
            idSpan.className = 'item-id';
            idSpan.textContent = utilisateur.id;
            li.appendChild(idSpan);

            const nameSpan = document.createElement('span');
            nameSpan.className = 'item-name';
            nameSpan.textContent = utilisateur.nom;
            li.appendChild(nameSpan);

            const firstNameSpan = document.createElement('span');
            firstNameSpan.className = 'item-first_name';
            firstNameSpan.textContent = utilisateur.prenom;
            li.appendChild(firstNameSpan);

            const roleSpan = document.createElement('span');
            roleSpan.className = 'item-role';
            let isAdmin = false;
            let isProf = false;
            let isEtudiant = false;
            let isProfAdmin = false;

            let roleText = "Inconnu";
                if (utilisateur.roles.includes("ROLE_PROF") && utilisateur.roles.includes("ROLE_ADMIN")) {
                    isProfAdmin = true;
                    roleText = "Professeur / Admin";
                } else if (utilisateur.roles.includes("ROLE_PROF")) {
                    isProf = true;
                    roleText = "Professeur";
                } else if (utilisateur.roles.includes("ROLE_USER")) {
                    isEtudiant = true;
                    roleText = "Etudiant";
                } else if (utilisateur.roles.includes("ROLE_ADMIN")) {
                    isAdmin = true;
                    roleText = "Admin";
                }

            roleSpan.textContent = roleText;
            li.appendChild(roleSpan);

            const editButton = document.createElement('button');
            editButton.className = 'btn-edit btn-action';
            editButton.textContent = 'Modifier';
            editButton.id = `editButtonUser-${i}`;
            editButton.onclick = function () {
                showForm(this);
            };
            li.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn-delete btn-action';
            deleteButton.textContent = 'Supprimer';
            deleteButton.id = `deleteButtonUser-${i}`;
            deleteButton.onclick = function () {
                showForm(this);
            };
            li.appendChild(deleteButton);

            ul.appendChild(li);
            i++;
        });

        contentDiv.appendChild(ul);

        utilisateursButton.disabled = true;
        utilisateursButton.classList.remove('btn-enabled');
        ueButton.disabled = false;
        ueButton.classList.add('btn-enabled');
    }

    function showUE() {
        contentDiv.innerHTML = ''; // Clear previous content

        const createButton = document.createElement('button');
        createButton.className = 'btn-create btn-action';
        createButton.style.float = 'right';
        createButton.textContent = 'Creer';
        createButton.onclick = function () {
            showForm(this);
        };
        contentDiv.appendChild(createButton);

        const header = document.createElement('h2');
        header.textContent = 'Liste des UE';
        contentDiv.appendChild(header);

        const ul = document.createElement('ul');
        i=0;
        ue.forEach(course => {
            const li = document.createElement('li');
            li.id = `liUE-${i}`;

            const idSpan = document.createElement('span');
            idSpan.className = 'item-id';
            idSpan.textContent = course.id;
            li.appendChild(idSpan);

            const nameSpan = document.createElement('span');
            nameSpan.className = 'item-code';
            nameSpan.textContent = course.code;
            li.appendChild(nameSpan);

            const descriptionSpan = document.createElement('span');
            descriptionSpan.className = 'item-libelle';
            descriptionSpan.textContent = course.nom;
            li.appendChild(descriptionSpan);

            const editButton = document.createElement('button');
            editButton.className = 'btn-edit btn-action';
            editButton.textContent = 'Modifier';
            editButton.id = `editButtonUE-${i}`;
            editButton.onclick = function () {
                showForm(this);
            };
            li.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn-delete btn-action';
            deleteButton.textContent = 'Supprimer';
            deleteButton.id = `deleteButtonUE-${i}`;
            deleteButton.onclick = function () {
                showForm(this);
            };
            li.appendChild(deleteButton);

            ul.appendChild(li);
            i++;
        });
        contentDiv.appendChild(ul);

        ueButton.disabled = true;
        ueButton.classList.remove('btn-enabled');
        utilisateursButton.disabled = false;
        utilisateursButton.classList.add('btn-enabled');
    }

    
    // Fonction qui permet d'afficher le formulaire de création d'un élément dans l'une des listes
    function showCreateModal(isUser) {
        const modal = document.getElementById('modal');
        modal.style.display = 'block';

        const modalTitle = document.getElementById('modal-title');
        modalTitle.textContent = isUser ? 'Créer un utilisateur' : 'Créer un cours';

        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = ''; // Efface le contenu précédent

        const confirmationMessage = document.createElement('p');
        confirmationMessage.textContent = 'Veuillez remplir les champs ci-dessus.';
        modalContent.appendChild(confirmationMessage);

        if (isUser) {
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.id = 'new-name';
            nameInput.placeholder =  'Nom';
            modalContent.appendChild(nameInput);
            modalContent.appendChild(document.createElement('br'));

            const firstNameInput = document.createElement('input');
            firstNameInput.type = 'text';
            firstNameInput.id = 'new-first_name';
            firstNameInput.placeholder =  'Prénom';
            modalContent.appendChild(firstNameInput);
            modalContent.appendChild(document.createElement('br'));

            const emailInput = document.createElement('input');
            emailInput.type = 'text';
            emailInput.id = 'new-email';
            emailInput.placeholder =  'Email';
            modalContent.appendChild(emailInput);
            modalContent.appendChild(document.createElement('br'));

            const passwordInput = document.createElement('input');
            passwordInput.type = 'text';
            passwordInput.id = 'new-password';
            passwordInput.placeholder =  'Password';
            modalContent.appendChild(passwordInput);
            modalContent.appendChild(document.createElement('br'));

            const roleMessage = document.createElement('p');
            roleMessage.textContent = 'Role :';
            modalContent.appendChild(roleMessage);

            const roleSelect = document.createElement('select');
            roleSelect.id = 'new-role';
            roleSelect.className = 'role-select';
            const options = ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_PROF', 'ROLE_PA'];
            let flagAdmin = false;
            options.forEach(role => {
                const option = document.createElement('option'); // Crée une option
                option.value = role; // Attribue la valeur de l'option
                if (role === 'ROLE_USER') {
                    option.textContent = "Etudiant";
                    option.selected = true; // Définit l'option sélectionnée par défaut
                }
                else if (role === 'ROLE_ADMIN') {
                    option.textContent = "Admin";

                }
                else if (role === 'ROLE_PROF') {
                    option.textContent = "Professeur";
                }
                else if (role === 'ROLE_PA') {
                    option.textContent = "Professeur / Admin";
                }

                roleSelect.appendChild(option); // Ajoute l'option au <select>
            });
            modalContent.appendChild(roleSelect);
            modalContent.appendChild(document.createElement('br'));

            roleSelect.addEventListener('change', function () {
                if (roleSelect.value === 'ROLE_ADMIN') {
                    inscriptionsSelect.disabled = true;
                    defaultOption.textContent = "Vous ne pouvez pas ajouter de cours à un admin";
                    const ueList = document.getElementById('new-ueList');

                    if (ueList) {
                        const listItems = ueList.querySelectorAll('li');

                        listItems.forEach((listItem) => {
                            listItem.remove(); // Supprimer les <li>
                        });

                        const emptyItem = document.createElement('li');
                        emptyItem.textContent = '- Aucune UE';
                        ueList.appendChild(emptyItem);
                    }
                }
                else {
                    inscriptionsSelect.disabled = false;
                    defaultOption.textContent = "-- Choisissez un cours --";
                }
            })

            const messageUE = document.createElement('p');
            messageUE.textContent = 'Ajouter des inscriptions :';
            modalContent.appendChild(messageUE);

            const inscriptionsSelect = document.createElement('select');
            inscriptionsSelect.id = 'new-inscription';
            inscriptionsSelect.className = 'inscription-select';
            const defaultOption = document.createElement('option');
            defaultOption.value = ""; // Attribue la valeur de l'option
            defaultOption.textContent = "-- Choisissez un cours --";
            inscriptionsSelect.appendChild(defaultOption); // Ajoute l'option au <select>
            ue.forEach(course => {
                const option = document.createElement('option'); // Crée une option
                option.value = course.id; // Attribue la valeur de l'option
                option.textContent = course.code;
                inscriptionsSelect.appendChild(option); // Ajoute l'option au <select>
            })
            modalContent.appendChild(inscriptionsSelect);
            modalContent.appendChild(document.createElement('br'));

            const ueList = document.createElement('ul');
            ueList.id = 'new-ueList';
            const listItem = document.createElement('li');
            listItem.textContent = '- Aucune UE';
            ueList.appendChild(listItem);
            // Ajoute la liste <ul> au modal
            modalContent.appendChild(ueList);

            inscriptionsSelect.addEventListener('change', function () {
                const selectedOption = parseInt(inscriptionsSelect.value, 10); // Récupère la valeur sélectionnée
                const selectedCourse = ue.find(course => course.id === selectedOption); // Trouve le cours correspondant
                const ueListItems = Array.from(ueList.querySelectorAll('li'));

                if (ueListItems.length === 1 && ueListItems[0].textContent === '- Aucune UE') {
                    ueListItems[0].remove(); // Supprime cet élément
                }

                const stringToCompare = '- ' + selectedCourse.code;
                const alreadyInList = ueListItems.some(item => item.textContent === stringToCompare);
                if (alreadyInList) {
                    alert('Ce cours est déjà assigné à cet utilisateur.');
                    inscriptionsSelect.value = "";
                    return; // On arrête l'exécution ici si l'élément existe déjà
                }
                const listItem = document.createElement('li');
                listItem.textContent = '- ' + selectedCourse.code; // Ajout du code du cours ici
                listItem.value = selectedCourse.id;

                // Ajout d'un bouton pour supprimer l'UE
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'X';
                deleteButton.style.marginLeft = '10px'; // Espace entre le texte et le bouton
                deleteButton.style.backgroundColor = 'red';
                deleteButton.style.color = 'white'; // Couleur du texte
                deleteButton.style.border = 'none';
                deleteButton.style.cursor = 'pointer'; // Cliquable

                // Ajout d'un événement pour supprimer l'UE
                deleteButton.addEventListener('click', function () {
                    listItem.remove(); // Supprime cet élément de la liste
                    if (ueList.querySelectorAll('li').length === 0) {
                        // Si la liste est vide, afficher "Aucune UE"
                        const emptyItem = document.createElement('li');
                        emptyItem.textContent = '- Aucune UE';
                        ueList.appendChild(emptyItem);
                    }
                });

                listItem.appendChild(deleteButton); // Ajoute le bouton à côté de l'UE

                ueList.appendChild(listItem);

                inscriptionsSelect.value = "";
            });

            modalContent.appendChild(document.createElement('p'));

        } else {
            // Ajouter les champs de saisie
            const codeInput = document.createElement('input');
            codeInput.type = 'text';
            codeInput.id = 'new-code';
            codeInput.placeholder = 'Code';
            modalContent.appendChild(codeInput);
            modalContent.appendChild(document.createElement('br'));

            const libelleInput = document.createElement('input');
            libelleInput.type = 'text';
            libelleInput.id = 'new-libelle';
            libelleInput.placeholder = 'Nom';
            modalContent.appendChild(libelleInput);
            modalContent.appendChild(document.createElement('br'));

            const imageMessage = document.createElement('p');
            imageMessage.textContent = 'Image de l\'UE';
            modalContent.appendChild(imageMessage);

            const imageInput = document.createElement('input');
            imageInput.type = 'file';
            imageInput.id = 'new-image';
            imageInput.accept = 'image/*';
            modalContent.appendChild(imageInput);
            modalContent.appendChild(document.createElement('br'));

            const imagePreview = document.createElement('img');
            imagePreview.id = 'image-preview';
            imagePreview.style.display = 'none';
            imagePreview.style.marginTop = '10px';
            imagePreview.style.maxWidth = '40%';
            modalContent.appendChild(imagePreview);

            imageInput.addEventListener('change', function () {
                const file = imageInput.files[0];

                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();

                    reader.onload = function (event) {
                        imagePreview.src = event.target.result;
                        imagePreview.style.display = 'block';
                    };

                    reader.readAsDataURL(file);
                } else {
                    alert('Veuillez sélectionner un fichier image valide.');
                    imagePreview.style.display = 'none';
                }
            });

            const confirmationMessage = document.createElement('p');
            confirmationMessage.textContent = 'Description de l\'UE';
            modalContent.appendChild(confirmationMessage);

            const descriptionInput = document.createElement('textarea');
            descriptionInput.type = 'text';
            descriptionInput.id = 'new-description';
            descriptionInput.placeholder = 'Description';
            modalContent.appendChild(descriptionInput);
            modalContent.appendChild(document.createElement('br'));

            modalContent.appendChild(document.createElement('p'));

            const messageUE = document.createElement('p');
            messageUE.textContent = 'Ajouter des inscriptions :';
            modalContent.appendChild(messageUE);

            const inscriptionsSelect = document.createElement('select');
            const defaultOption = document.createElement('option');
            defaultOption.value = ""; // Attribue la valeur de l'option
            defaultOption.textContent = "-- Choisissez un utilisateur --";
            inscriptionsSelect.appendChild(defaultOption); // Ajoute l'option au <select>
            inscriptionsSelect.id = 'new-inscription';
            inscriptionsSelect.className = 'inscription-select';
            utilisateurs.forEach(user => {
                const option = document.createElement('option'); // Crée une option
                option.value = user.id + ' ' + user.nom + ' ' + user.prenom; // Attribue la valeur de l'option
                option.textContent = user.id + ' ' + user.nom + ' ' + user.prenom;
                inscriptionsSelect.appendChild(option); // Ajoute l'option au <select>
            })
            modalContent.appendChild(inscriptionsSelect);
            modalContent.appendChild(document.createElement('br'));

            const usersList = document.createElement('ul');
            usersList.id = 'new-usersList';
            const listItem = document.createElement('li');
            listItem.textContent = '- Aucun utilisateur inscrit';
            usersList.appendChild(listItem);
            // Ajoute la liste <ul> au modal
            modalContent.appendChild(usersList);

            inscriptionsSelect.addEventListener('change', function () {
                const selectedOption = parseInt(inscriptionsSelect.value, 10); // Récupère la valeur sélectionnée
                const selectedUser = utilisateurs.find(user => user.id === selectedOption); // Trouve le user correspondant
                const userListItem = Array.from(usersList.querySelectorAll('li'));

                if (userListItem.length === 1 && userListItem[0].textContent === '- Aucun utilisateur inscrit') {
                    userListItem[0].remove(); // Supprime cet élément
                }

                const stringToCompare = '- ' + selectedUser.id + ' ' + selectedUser.nom + ' ' + selectedUser.prenom;
                const alreadyInList = userListItem.some(item => item.textContent === stringToCompare);
                if (alreadyInList) {
                    alert('Cet utilisateur est déjà assigné à cet ue.');
                    inscriptionsSelect.value = "";
                    return; // On arrête l'exécution ici si l'élément existe déjà
                }
                const listItem = document.createElement('li');
                listItem.textContent = '- ' + selectedUser.id + ' ' + selectedUser.nom + ' ' + selectedUser.prenom; // Ajout des infos du user
                listItem.value = selectedUser.id;

                // Ajout d'un bouton pour supprimer l'utilisateur
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'X';
                deleteButton.style.marginLeft = '10px'; // Espace entre le texte et le bouton
                deleteButton.style.backgroundColor = 'red';
                deleteButton.style.color = 'white'; // Couleur du texte
                deleteButton.style.border = 'none';
                deleteButton.style.cursor = 'pointer'; // Cliquable

                // Ajout d'un événement pour supprimer l'Utilisateur
                deleteButton.addEventListener('click', function () {
                    listItem.remove(); // Supprime cet élément de la liste
                    if (usersList.querySelectorAll('li').length === 0) {
                        // Si la liste est vide, afficher "Aucun utilisateur inscrit"
                        const emptyItem = document.createElement('li');
                        emptyItem.textContent = '- Aucun utilisateur inscrit';
                        usersList.appendChild(emptyItem);
                    }
                });

                listItem.appendChild(deleteButton); // Ajoute le bouton à côté de l'utilisateur

                usersList.appendChild(listItem);

                inscriptionsSelect.value = "";
            });
        }

        modalContent.appendChild(document.createElement('p'));

        // Ajouter les boutons
        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirmer';
        confirmButton.className = 'btn-confirm btn-answer';
        confirmButton.onclick = function () {
            confirm(this);
        };
        modalContent.appendChild(confirmButton);

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Annuler';
        cancelButton.className = 'btn-cancel btn-answer';
        cancelButton.onclick = function () {
            confirm(this);
        };
        modalContent.appendChild(cancelButton);

    }

    // Fonction qui permet d'afficher le formulaire de modification d'un élément d'une des listes
    function showEditModal(isUser, button) {
        const listItem = button.parentElement;

        const modal = document.getElementById('modal');
        modal.style.display = 'block';
    
        // Modifier le titre du modal
        const modalTitle = document.getElementById('modal-title');
        modalTitle.textContent = isUser ? 'Modifier un utilisateur' : 'Modifier un cours';

        // Effacer le contenu précédent du modal
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = '';

        const confirmationMessage = document.createElement('p');
        confirmationMessage.textContent = 'Veuillez modifier les champs ci-dessous.';
        modalContent.appendChild(confirmationMessage);

        let editName;
        let editFirst_name;
        let editRole;
        let editInscription = [];

        let editCode;
        let editDescription;
        let editImage;

        const editId = listItem.querySelector('.item-id').textContent;
        if (isUser) {
            utilisateurs.forEach(user => {
                if (user.id == editId) {
                    editName = user.nom;
                    editFirst_name = user.prenom;
                    if (user.roles.includes("ROLE_ADMIN") && user.roles.includes("ROLE_PROF")) {
                        editRole = "Professeur / Admin";
                    } else if (user.roles.includes("ROLE_PROF")) {
                        editRole = "Professeur";
                    } else if (user.roles.includes("ROLE_USER")){
                        editRole = "Etudiant";
                    } else if (user.roles.includes("ROLE_ADMIN")){
                        editRole = "Admin";
                    }

                    if (Array.isArray(user.inscriptions)) {
                        user.inscriptions.forEach(course => {
                            editInscription.push(course); // Ajoute au tableau
                        });
                    }

                }
            })

            //editInscription = utilisateurs.find(user => user.name === editName).inscription;

            const nameMessage = document.createElement('p');
            nameMessage.textContent = 'Nom :';
            modalContent.appendChild(nameMessage);

            // Ajouter le champ pour le nom
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.id = 'edit-name';
            nameInput.value = editName;
            modalContent.appendChild(nameInput);
            modalContent.appendChild(document.createElement('br'));

            const first_nameMessage = document.createElement('p');
            first_nameMessage.textContent = 'Prenom :';
            modalContent.appendChild(first_nameMessage);

            const first_nameInput = document.createElement('input');
            first_nameInput.type = 'text';
            first_nameInput.id = 'edit-first_name';
            first_nameInput.value = editFirst_name;
            modalContent.appendChild(first_nameInput);
            modalContent.appendChild(document.createElement('br'));

            const roleMessage = document.createElement('p');
            roleMessage.textContent = 'Role :';
            modalContent.appendChild(roleMessage);

            const roleSelect = document.createElement('select');
            roleSelect.id = 'edit-role';
            roleSelect.className = 'role-select';
            const options = ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_PROF', 'ROLE_PA'];
            let flagAdmin = false;
            options.forEach(role => {
                const option = document.createElement('option'); // Crée une option
                option.value = role; // Attribue la valeur de l'option
                if (role === 'ROLE_USER') {
                    option.textContent = "Etudiant";
                }
                else if (role === 'ROLE_ADMIN') {
                    option.textContent = "Admin";
                }
                else if (role === 'ROLE_PROF') {
                    option.textContent = "Professeur";
                }
                else if (role === 'ROLE_PA') {
                    option.textContent = "Professeur / Admin";
                }
                else{
                    option.textContent = "Inconnu";
                }
                if (option.textContent === editRole) {
                    option.selected = true; // Définit l'option sélectionnée par défaut (si correspond à "editRole")
                    if (option.textContent === "Admin") {
                        flagAdmin = true;
                    }
                }
                roleSelect.appendChild(option); // Ajoute l'option au <select>
            });
            modalContent.appendChild(roleSelect);
            modalContent.appendChild(document.createElement('br'));

            roleSelect.addEventListener('change', function () {
                if (roleSelect.value === 'ROLE_ADMIN') {
                    inscriptionsSelect.disabled = true;
                    defaultOption.textContent = "Vous ne pouvez pas ajouter de cours à un admin";
                    const ueList = document.getElementById('edit-ueList');

                    if (ueList) {
                        const listItems = ueList.querySelectorAll('li');

                        listItems.forEach((listItem) => {
                            listItem.remove(); // Supprimer les <li>
                        });

                        const emptyItem = document.createElement('li');
                        emptyItem.textContent = '- Aucune UE';
                        ueList.appendChild(emptyItem);

                    }
                }
                else {
                    inscriptionsSelect.disabled = false;
                    defaultOption.textContent = "-- Choisissez un cours --";
                }
            })

            const inscriptionsMessage = document.createElement('p');
            inscriptionsMessage.textContent = 'Inscription aux UE :';
            modalContent.appendChild(inscriptionsMessage);

            const inscriptionsSelect = document.createElement('select');
            inscriptionsSelect.id = 'edit-inscription';
            inscriptionsSelect.className = 'inscription-select';
            const defaultOption = document.createElement('option');
            defaultOption.value = ""; // Attribue la valeur de l'option
            if (flagAdmin === true){
                inscriptionsSelect.disabled = true;
                defaultOption.textContent = "-- Choisissez un cours --";
            }
            else {
                inscriptionsSelect.disabled = false;
                defaultOption.textContent = "-- Choisissez un cours --";
            }
            inscriptionsSelect.appendChild(defaultOption); // Ajoute l'option au <select>
            ue.forEach(course => {
                const option = document.createElement('option'); // Crée une option
                option.value = course.id; // Attribue la valeur de l'option
                option.textContent = course.code;
                inscriptionsSelect.appendChild(option); // Ajoute l'option au <select>
            })
            modalContent.appendChild(inscriptionsSelect);
            modalContent.appendChild(document.createElement('br'));

            const ueList = document.createElement('ul');
            ueList.id = 'edit-ueList';
            if (editInscription.length == 0) {
                const listItem = document.createElement('li');
                listItem.textContent = '- Aucune UE';
                ueList.appendChild(listItem);
            }
            else {
                // Parcourt le tableau dynamiquement
                editInscription.forEach(inscription => {
                    const listItem = document.createElement('li'); // Crée un élément <li>
                    listItem.textContent = `- Erreur`;
                    ue.forEach(course => {
                        if (course.id == inscription) {
                            listItem.value = course.id;
                            listItem.textContent = `- ${course.code}`; // Définit le contenu de chaque élément

                            // Ajout d'un bouton pour supprimer l'UE
                            const deleteButton = document.createElement('button');
                            deleteButton.textContent = 'X';
                            deleteButton.style.marginLeft = '10px'; // Espace entre le texte et le bouton
                            deleteButton.style.backgroundColor = 'red';
                            deleteButton.style.color = 'white'; // Couleur du texte
                            deleteButton.style.border = 'none';
                            deleteButton.style.cursor = 'pointer'; // Cliquable

                            // Ajout d'un événement pour supprimer l'UE
                            deleteButton.addEventListener('click', function () {
                                listItem.remove(); // Supprime cet élément de la liste
                                if (ueList.querySelectorAll('li').length === 0) {
                                    // Si la liste est vide, afficher "Aucune UE"
                                    const emptyItem = document.createElement('li');
                                    emptyItem.textContent = '- Aucune UE';
                                    ueList.appendChild(emptyItem);
                                }
                            });

                            listItem.appendChild(deleteButton); // Ajoute le bouton à côté de l'UE

                        }
                    })
                    ueList.appendChild(listItem); // Ajoute l'élément <li> à la liste <ul>
                });
            }

            // Ajoute la liste <ul> au modal
            modalContent.appendChild(ueList);

            inscriptionsSelect.addEventListener('change', function () {
                const selectedOption = parseInt(inscriptionsSelect.value, 10); // Récupère la valeur sélectionnée
                const selectedCourse = ue.find(course => course.id === selectedOption); // Trouve le cours correspondant
                const ueListItems = Array.from(ueList.querySelectorAll('li'));

                if (ueListItems.length === 1 && ueListItems[0].textContent === '- Aucune UE') {
                    ueListItems[0].remove(); // Supprime cet élément
                }

                const stringToCompare = '- ' + selectedCourse.code;
                const alreadyInList = ueListItems.some(item => item.textContent === stringToCompare);
                if (alreadyInList) {
                    alert('Ce cours est déjà assigné à cet utilisateur.');
                    inscriptionsSelect.value = "";
                    return; // On arrête l'exécution ici si l'élément existe déjà
                }
                const listItem = document.createElement('li');
                listItem.textContent = '- ' + selectedCourse.code; // Ajout du code du cours ici
                listItem.value = selectedCourse.id;

                // Ajout d'un bouton pour supprimer l'UE
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'X';
                deleteButton.style.marginLeft = '10px'; // Espace entre le texte et le bouton
                deleteButton.style.backgroundColor = 'red';
                deleteButton.style.color = 'white'; // Couleur du texte
                deleteButton.style.border = 'none';
                deleteButton.style.cursor = 'pointer'; // Cliquable

                // Ajout d'un événement pour supprimer l'UE
                deleteButton.addEventListener('click', function () {
                    listItem.remove(); // Supprime cet élément de la liste
                    if (ueList.querySelectorAll('li').length === 0) {
                        // Si la liste est vide, afficher "Aucune UE"
                        const emptyItem = document.createElement('li');
                        emptyItem.textContent = '- Aucune UE';
                        ueList.appendChild(emptyItem);
                    }
                });

                listItem.appendChild(deleteButton); // Ajoute le bouton à côté de l'UE

                ueList.appendChild(listItem);

                inscriptionsSelect.value = "";

            });


        } else {
            ue.forEach(course => {
                if (course.id == editId) {
                    editCode = course.code;
                    editName = course.nom;
                    editDescription = course.description;
                    editImage = "images/" + course.image;

                    if (Array.isArray(course.users)) {
                        course.users.forEach(user => {
                            editInscription.push(user); // Ajoute au tableau
                        });
                    }
                }
            })

            const codeMessage = document.createElement('p');
            codeMessage.textContent = 'Code :';
            modalContent.appendChild(codeMessage);

            // Ajouter le champ pour le code
            const codeInput = document.createElement('input');
            codeInput.type = 'text';
            codeInput.id = 'edit-code';
            codeInput.value = editCode;
            modalContent.appendChild(codeInput);
            modalContent.appendChild(document.createElement('br'));

            const nameMessage = document.createElement('p');
            nameMessage.textContent = 'Nom :';
            modalContent.appendChild(nameMessage);

            // Ajouter le champ pour le libelle
            const libelleInput = document.createElement('input');
            libelleInput.type = 'text';
            libelleInput.id = 'edit-libelle';
            libelleInput.value = editName;
            modalContent.appendChild(libelleInput);
            modalContent.appendChild(document.createElement('br'));

            const imageMessage = document.createElement('p');
            imageMessage.textContent = 'Image de l\'UE';
            modalContent.appendChild(imageMessage);

            const imageInput = document.createElement('input');
            imageInput.type = 'file';
            imageInput.id = 'edit-image';
            imageInput.accept = 'image/*';
            modalContent.appendChild(imageInput);
            modalContent.appendChild(document.createElement('br'));

            const imagePreview = document.createElement('img');
            imagePreview.id = 'image-preview';
            imagePreview.style.display = 'none';
            imagePreview.style.marginTop = '10px';
            imagePreview.style.maxWidth = '40%';
            if (editImage !== 'images/null') {
                imagePreview.src = editImage;
                imagePreview.style.display = 'block';
            }
            modalContent.appendChild(imagePreview);

            imageInput.addEventListener('change', function () {
                const file = imageInput.files[0];

                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();

                    reader.onload = function (event) {
                        imagePreview.src = event.target.result;
                        imagePreview.style.display = 'block';
                    };

                    reader.readAsDataURL(file);
                } else {
                    alert('Veuillez sélectionner un fichier image valide.');
                    imagePreview.style.display = 'none';
                }
            });

            const confirmationMessage = document.createElement('p');
            confirmationMessage.textContent = 'Description de l\'UE';
            modalContent.appendChild(confirmationMessage);

            const descriptionInput = document.createElement('textarea');
            descriptionInput.type = 'text';
            descriptionInput.id = 'edit-description';
            descriptionInput.value = editDescription;
            modalContent.appendChild(descriptionInput);
            modalContent.appendChild(document.createElement('br'));

            const inscriptionsMessage = document.createElement('p');
            inscriptionsMessage.textContent = 'Inscriptions :';
            modalContent.appendChild(inscriptionsMessage);

            const inscriptionsSelect = document.createElement('select');
            const defaultOption = document.createElement('option');
            defaultOption.value = ""; // Attribue la valeur de l'option
            defaultOption.textContent = "-- Choisissez un utilisateur --";
            inscriptionsSelect.appendChild(defaultOption); // Ajoute l'option au <select>
            inscriptionsSelect.id = 'edit-inscription';
            inscriptionsSelect.className = 'inscription-select';
            utilisateurs.forEach(user => {
                const option = document.createElement('option'); // Crée une option
                option.value = user.id + ' ' + user.nom + ' ' + user.prenom; // Attribue la valeur de l'option
                option.textContent = user.id + ' ' + user.nom + ' ' + user.prenom;
                inscriptionsSelect.appendChild(option); // Ajoute l'option au <select>
            })
            modalContent.appendChild(inscriptionsSelect);
            modalContent.appendChild(document.createElement('br'));

            const usersList = document.createElement('ul');
            usersList.id = 'edit-usersList';
            if (editInscription.length == 0) {
                const listItem = document.createElement('li');
                listItem.textContent = '- Aucun utilisateur inscrit';
                usersList.appendChild(listItem);
            }
            else {
                // Parcourt le tableau dynamiquement
                editInscription.forEach(inscription => {
                    const listItem = document.createElement('li'); // Crée un élément <li>
                    listItem.textContent = `- Erreur`; // Définit le contenu de chaque élément
                    utilisateurs.forEach(user => {
                        if (user.id == inscription) {
                            listItem.value = user.id;
                            listItem.textContent = `- ${user.id} ${user.nom} ${user.prenom}`; // Définit le contenu de chaque élément

                            // Ajout d'un bouton pour supprimer l'utilisateur
                            const deleteButton = document.createElement('button');
                            deleteButton.textContent = 'X';
                            deleteButton.style.marginLeft = '10px'; // Espace entre le texte et le bouton
                            deleteButton.style.backgroundColor = 'red';
                            deleteButton.style.color = 'white'; // Couleur du texte
                            deleteButton.style.border = 'none';
                            deleteButton.style.cursor = 'pointer'; // Cliquable

                            // Ajout d'un événement pour supprimer l'Utilisateur
                            deleteButton.addEventListener('click', function () {
                                listItem.remove(); // Supprime cet élément de la liste
                                if (usersList.querySelectorAll('li').length === 0) {
                                    // Si la liste est vide, afficher "Aucun utilisateur inscrit"
                                    const emptyItem = document.createElement('li');
                                    emptyItem.textContent = '- Aucun utilisateur inscrit';
                                    usersList.appendChild(emptyItem);
                                }
                            });

                            listItem.appendChild(deleteButton); // Ajoute le bouton à côté de l'utilisateur
                        }
                    })
                    usersList.appendChild(listItem); // Ajoute l'élément <li> à la liste <ul>
                });
            }

            // Ajoute la liste <ul> au modal
            modalContent.appendChild(usersList);

            inscriptionsSelect.addEventListener('change', function () {
                const selectedOption = parseInt(inscriptionsSelect.value, 10); // Récupère la valeur sélectionnée
                const selectedUser = utilisateurs.find(user => user.id === selectedOption); // Trouve le user correspondant
                const userListItem = Array.from(usersList.querySelectorAll('li'));

                if (userListItem.length === 1 && userListItem[0].textContent === '- Aucun utilisateur inscrit') {
                    userListItem[0].remove(); // Supprime cet élément
                }

                const stringToCompare = '- ' + selectedUser.id + ' ' + selectedUser.nom + ' ' + selectedUser.prenom;
                const alreadyInList = userListItem.some(item => item.textContent === stringToCompare);
                if (alreadyInList) {
                    alert('Cet utilisateur est déjà assigné à cet ue.');
                    inscriptionsSelect.value = "";
                    return; // On arrête l'exécution ici si l'élément existe déjà
                }
                const listItem = document.createElement('li');
                listItem.textContent = '- ' + selectedUser.id + ' ' + selectedUser.nom + ' ' + selectedUser.prenom; // Ajout des infos du user

                // Ajout d'un bouton pour supprimer l'utilisateur
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'X';
                deleteButton.style.marginLeft = '10px'; // Espace entre le texte et le bouton
                deleteButton.style.backgroundColor = 'red';
                deleteButton.style.color = 'white'; // Couleur du texte
                deleteButton.style.border = 'none';
                deleteButton.style.cursor = 'pointer'; // Cliquable

                // Ajout d'un événement pour supprimer l'Utilisateur
                deleteButton.addEventListener('click', function () {
                    listItem.remove(); // Supprime cet élément de la liste
                    if (usersList.querySelectorAll('li').length === 0) {
                        // Si la liste est vide, afficher "Aucun utilisateur inscrit"
                        const emptyItem = document.createElement('li');
                        emptyItem.textContent = '- Aucun utilisateur inscrit';
                        usersList.appendChild(emptyItem);
                    }
                });

                listItem.appendChild(deleteButton); // Ajoute le bouton à côté de l'utilisateur

                usersList.appendChild(listItem);

                inscriptionsSelect.value = "";

            });
        }

        /*const messageUE = document.createElement('p');
        messageUE.textContent = 'Modifier les inscriptions :';
        modalContent.appendChild(messageUE);

        const ulUE = document.createElement('ul');
        ulUE.id = 'ue-list';
        editInscription.forEach(inscription => {
            const liUE = document.createElement('li');
            liUE.id = `liInscr-${inscription}`;

            const inscriptionSpan = document.createElement('span');
            inscriptionSpan.className = 'item-inscription';
            inscriptionSpan.textContent = inscription;
            liUE.appendChild(inscriptionSpan);

            const removeButton = document.createElement('button');
            removeButton.className = 'btn-remove btn-action';
            removeButton.textContent = 'Enlever';
            removeButton.id = `removeButton-${inscription}`;
            removeButton.onclick = function () {

            };
            liUE.appendChild(removeButton);

            ulUE.appendChild(liUE);

        })
        modalContent.appendChild(ulUE);

        const addButton = document.createElement('button');
        addButton.className = 'btn-add btn-action';
        addButton.textContent = 'Ajouter';
        addButton.id = 'addButton';
        addButton.onclick = function () {

        }
        modalContent.appendChild(addButton);*/

        modalContent.appendChild(document.createElement('p'));

        // Ajouter le bouton "Confirmer"
        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirmer';
        confirmButton.className = 'btn-confirm btn-answer';
        confirmButton.setAttribute('data-list-item-id', listItem.id);
        confirmButton.onclick = function () {
            confirm(this);
        };
        modalContent.appendChild(confirmButton);
    
        // Ajouter le bouton "Annuler"
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Annuler';
        cancelButton.className = 'btn-cancel btn-answer';
        cancelButton.onclick = function () {
            confirm(this);
        };
        modalContent.appendChild(cancelButton);
    }
    

    // Fonction qui permet d'afficher le formulaire de suppression d'un élément d'une des listes
    function showDeleteModal(isUser, button) {
        const listItem = button.parentElement;

        const modal = document.getElementById('modal');
        modal.style.display = 'block';

        // Modifier le titre du modal
        const modalTitle = document.getElementById('modal-title');
        modalTitle.textContent = isUser ? 'Supprimer un utilisateur' : 'Supprimer un cours';


        // Effacer le contenu précédent du modal
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = '';

        // Ajouter le message de confirmation
        const confirmationMessage = document.createElement('p');
        confirmationMessage.textContent = 'Êtes-vous sûr de vouloir supprimer cet élément ?';
        modalContent.appendChild(confirmationMessage);

        // Ajouter le bouton "Confirmer"
        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirmer';
        confirmButton.className = 'btn-confirm btn-answer';
        confirmButton.setAttribute('data-list-item-id', listItem.id);
        confirmButton.onclick = function () {
            confirm(this);
        };
        modalContent.appendChild(confirmButton);

        // Ajouter le bouton "Annuler"
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Annuler';
        cancelButton.className = 'btn-cancel btn-answer';
        cancelButton.onclick = function () {
            confirm(this);
        };
        modalContent.appendChild(cancelButton);
}
    


    // Fonction qui permet de confirmer la création d'un élément dans l'une des listes
    function confirmCreate() {
        if (utilisateursButton.disabled) {
            const name = document.getElementById('new-name').value;
            const first_name = document.getElementById('new-first_name').value;
            const password = document.getElementById('new-password').value;
            const email = document.getElementById('new-email').value;
            const role = document.getElementById('new-role').value;
            const ueList = document.getElementById('new-ueList');
            const inscriptions = Array.from(ueList.querySelectorAll('li')).map(item => item.value);

            if (!name || !first_name) {
                alert('Veuillez remplir tous les champs avant de confirmer.');
                return;
            }

            const maxId = utilisateurs.reduce((max, utilisateur) => {
                return utilisateur.id > max ? utilisateur.id : max;
            }, 0);

            const newId = maxId + 1;

            let newRole;
            if (role === 'ROLE_USER') {
                newRole = ['ROLE_USER'];
            }
            else if (role === 'ROLE_ADMIN') {
                newRole = ['ROLE_ADMIN'];
            }
            else if (role === 'ROLE_PROF') {
                newRole = ['ROLE_PROF'];
            }
            else if (role === 'ROLE_PA') {
                newRole = ['ROLE_ADMIN', 'ROLE_PROF'];
            }


            let newUser = {
                id: newId,
                nom: name,
                prenom: first_name,
                password: password,
                email: email,
                roles: newRole,
                inscriptions: [] // Initialise un tableau vide pour les inscriptions
            };

            inscriptions.forEach(course => {
                ue.forEach(cours => {
                    if (course == cours.id) {
                        newUser.inscriptions.push(cours.id); // Ajoute au tableau
                        newUser.inscriptions.sort()
                        cours.users.push(newUser.id);
                    }
                });

            });

            fetch('/api/admin/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.user && data.user.id) {
                        // Ajouter l'utilisateur dans la liste locale
                        newUser = {
                            id: data.user.id,
                            nom: data.user.nom,
                            prenom: data.user.prenom,
                            email: data.user.email,
                            roles: data.user.roles,
                            inscriptions: data.user.inscriptions,
                        };
                        alert(`Utilisateur ${data.user.nom} ${data.user.prenom} créé avec succès et ajouté à la liste.`);
                        utilisateurs.push(newUser);
                        closeModal();
                        showUtilisateurs();
                    } else if (data.error) {
                        alert('Erreur : ' + data.error);
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de la création de l\'utilisateur:', error);
                });
        }
        else {
            const code = document.getElementById('new-code').value;
            const nom = document.getElementById('new-libelle').value;
            const description = document.getElementById('new-description').value;
            const userList = document.getElementById('new-usersList');
            const inscriptions = Array.from(userList.querySelectorAll('li')).map(item => item.value);
            const imageInput = document.getElementById('new-image');
            const imageUrl = imageInput.value;
            const imageFilename = imageUrl.split('\\').pop();


            if (!code || !nom || !description) {
                alert('Veuillez remplir tous les champs avant de confirmer.');
                return;
            }

            const maxId = ue.reduce((max, course) => {
                return course.id > max ? course.id : max;
            }, 0);

            const newId = maxId + 1;

            let newCourse = {
                id: newId,
                nom: nom,
                code: code,
                description: description,
                image: imageFilename,
                users: [] // Initialise un tableau vide pour les inscriptions
            };

            inscriptions.forEach(user => {
                utilisateurs.forEach(utilisateur => {
                    if (user == utilisateur.id) {
                        newCourse.users.push(utilisateur.id); // Ajoute au tableau
                        newCourse.users.sort()
                        utilisateur.inscriptions.push(newCourse.id);
                    }
                });

            });

            fetch('/api/admin/create-course', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCourse),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.course && data.course.id) {
                        // Ajouter le cours dans la liste locale
                        newCourse = {
                            id: data.course.id,
                            code: data.course.code,
                            nom: data.course.nom,
                            description: data.course.description,
                            image: data.course.image,
                            users: data.course.users,
                        };
                        alert(`Cours ${data.course.nom} créé avec succès et ajouté à la liste.`);
                        ue.push(newCourse);
                        closeModal();
                        showUE();
                    } else if (data.error) {
                        alert('Erreur : ' + data.error);
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de la création du cours :', error);
                });
        }
    }

    // Fonction qui permet de confirmer la modification d'un élément d'une des listes
    function confirmEdit(button) {
        const listItemId = button.getAttribute('data-list-item-id');
        const listItem = document.getElementById(listItemId);
        const numericId = parseInt(listItem.textContent, 10);

        if (utilisateursButton.disabled) {

            const newName = document.getElementById('edit-name').value;
            const newFirst_name = document.getElementById('edit-first_name').value;
            const newRole = document.getElementById('edit-role').value;
            const ueList = document.getElementById('edit-ueList');
            const newInscriptions = Array.from(ueList.querySelectorAll('li')).map(item => item.value);

            if (!newName || !newFirst_name) {
                alert('Veuillez remplir tous les champs avant de confirmer.');
                return;
            }

            const nameSpan = listItem.querySelector('.item-name');
            const first_nameSpan = listItem.querySelector('.item-first_name');
            const roleSpan = listItem.querySelector('.item-role');

            if (nameSpan) nameSpan.textContent = newName;
            if (first_nameSpan) first_nameSpan.textContent = newFirst_name;
            let role;
            if (roleSpan) {
                if (newRole === 'ROLE_USER') {
                    roleSpan.textContent = "Etudiant";
                    role = ['ROLE_USER'];
                }
                else if (newRole === 'ROLE_ADMIN') {
                    roleSpan.textContent = "Admin";
                    role = ['ROLE_ADMIN'];
                }
                else if (newRole === 'ROLE_PROF') {
                    roleSpan.textContent = "Professeur";
                    role = ['ROLE_PROF'];
                }
                else if (newRole === 'ROLE_PA') {
                    roleSpan.textContent = "Professeur / Admin";
                    role = ['ROLE_ADMIN', 'ROLE_PROF'];
                }
            }

            utilisateurs.forEach(user => {
                if (user.id === numericId) {
                    user.nom = newName;
                    user.prenom = newFirst_name;
                    user.roles = role;
                    user.inscriptions = [];
                    newInscriptions.forEach(course => {
                        ue.forEach(cours => {
                            if (course == cours.id) {
                                user.inscriptions.push(cours.id); // Ajoute au tableau
                                user.inscriptions.sort()

                                let flagUserPresent = false;
                                cours.users.forEach(utilisateur => {
                                    if (user.id == utilisateur) {
                                        flagUserPresent = true;
                                    }
                                })
                                if (!flagUserPresent) {
                                    cours.users.push(user.id);
                                }
                            }
                        });

                    });

                    fetch('/api/admin/update-user', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id: user.id,
                            nom: newName,
                            prenom: newFirst_name,
                            email: user.email,
                            roles: role,
                            inscriptions: user.inscriptions,
                        }),
                    })
                        .then((response) => {
                            if (response.ok) {
                                return response.json(); // Parse la réponse en JSON
                            } else {
                                throw new Error('Erreur lors de l\'enregistrement des modifications');
                            }
                        })
                        .then((data) => {
                            alert(data.message); // Affiche un message de succès
                        })
                        .catch((error) => {
                            console.error('Erreur :', error);
                        });

                }
            })
        }
        else {
            const newCode = document.getElementById('edit-code').value;
            const newLibelle = document.getElementById('edit-libelle').value;
            const newDescription = document.getElementById('edit-description').value;
            const usersList = document.getElementById('edit-usersList');
            const newInscriptions = Array.from(usersList.querySelectorAll('li')).map(item => item.textContent.trim());


            if (!newCode || !newLibelle || !newDescription) {
                alert('Veuillez remplir tous les champs avant de confirmer.');
                return;
            }

            const codeSpan = listItem.querySelector('.item-code');
            const libelleSpan = listItem.querySelector('.item-libelle');
            const descriptionSpan = listItem.querySelector('.item-description');

            if (codeSpan) codeSpan.textContent = newCode;
            if (libelleSpan) libelleSpan.textContent = newLibelle;
            if (descriptionSpan) descriptionSpan.textContent = newDescription;

            ue.forEach(course => {
                if (course.id === numericId){
                    course.code = newCode;
                    course.nom = newLibelle
                    course.users = [];
                    newInscriptions.forEach(user => {
                        utilisateurs.forEach(utilisateur => {
                            if (user == '- ' + utilisateur.id + ' ' + utilisateur.nom + ' ' + utilisateur.prenom + 'X') {
                                course.users.push(utilisateur.id); // Ajoute au tableau
                                course.users.sort()

                                let flagUePresent = false;
                                utilisateur.inscriptions.forEach(cours => {
                                    if (course.id == cours) {
                                        flagUePresent = true;
                                    }
                                })
                                if (!flagUePresent) {
                                    utilisateur.inscriptions.push(course.id);
                                }
                            }
                        });

                    });
                    fetch('/api/admin/update-course', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id: course.id,
                            nom: newLibelle,
                            code: newCode,
                            description: newDescription,
                            users: course.users,
                        }),
                    })
                        .then((response) => {
                            if (response.ok) {
                                return response.json(); // Parse la réponse en JSON
                            } else {
                                throw new Error('Erreur lors de l\'enregistrement des modifications');
                            }
                        })
                        .then((data) => {
                            alert(data.message); // Affiche un message de succès
                        })
                        .catch((error) => {
                            console.error('Erreur :', error);
                        });

                }
            })
        }
    }

    // Fonction qui permet de confirmer la suppression d'un élément d'une des listes
    function confirmDelete(button) {
        const listItemId = button.getAttribute('data-list-item-id');
        const listItem = document.getElementById(listItemId);
        const numericId = parseInt(listItem.textContent, 10);

        listItem.remove();

        if (utilisateursButton.disabled) {
            utilisateurs.forEach(user => {
                if (user.id === numericId) {
                    utilisateurs.splice(utilisateurs.indexOf(user), 1);
                }
            })
        }
        else {
            ue.forEach(course => {
                if (course.id === numericId){
                    ue.splice(ue.indexOf(course), 1);
                }
            })
        }

        fetch(`/api/admin/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: numericId, // ID de l'élément à supprimer
                type: utilisateursButton.disabled ? 'user' : 'course' // (utilisateur ou cours)
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression dans la base de données.');
                }
                return response.json();
            })
            .then(data => {
                console.log(`Suppression réussie :`, data);
            })
            .catch(error => {
                console.error('Erreur lors de la suppression :', error);
                alert('Une erreur est survenue lors de la suppression côté serveur.');
            });

    }

    // Fonction qui permet de rediriger les boutons de confirmation/annulation des fenêtres modales vers les fonctions correspondantes
    function confirm(button) {
        if (button.classList.contains('btn-cancel')){
            closeModal();
        } else if (button.classList.contains('btn-confirm')) {
            const modalTitle = document.getElementById('modal-title').textContent;
            if (modalTitle.includes('Créer')) {
                confirmCreate();
            }
            else if (modalTitle.includes('Modifier')) {
                confirmEdit(button);
            }
            else if (modalTitle.includes('Supprimer')) {
                confirmDelete(button);
            }
            closeModal();
        }
    }

    // Fonction qui permet de fermer le formulaire
    function closeModal() {
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
    }
    window.closeModal = closeModal;

    // Fonction appelé lorsqu'on clique sur les boutons creer, modifier et supprimer
    // Renvoie vers la fonction affichant le formulaire correspondant
    function showForm(button) {
        const isUser = utilisateursButton.disabled; // Vérifie si on est dans la liste des utilisateurs ou des UE
        if (button.classList.contains('btn-create')) {
            showCreateModal(isUser);
        } else if (button.classList.contains('btn-edit')) {
            showEditModal(isUser, button);
        } else if (button.classList.contains('btn-delete')) {
            showDeleteModal(isUser, button);
        }
    }

    // Fonction qui permet d'afficher le formulaire (fonction showForm) lorsque l'on clique surles boutons creer, modifier et supprimer
    document.querySelectorAll('.btn-action').forEach(button => {
        button.addEventListener('click', function(event) {
            showForm(event.target);
        });
    });

    document.querySelectorAll('.btn-answer').forEach(button => {
        button.addEventListener('click', function(event) {
            confirm(event.target);
        });
    });

    // Fonction qui permet de fermer le formulaire quand on clique en dehors de celui-ci
    window.onclick = function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target == modal) {
                closeModal();
            }
        });
    }
});