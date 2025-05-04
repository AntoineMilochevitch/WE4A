/*
Ce fichier correspond au code javascript de la page admin

Il contient plusieurs fonctions, articulées autour des deux listes utilisateurs et ue
    - utilisateurs contient la liste des utilisateurs, avec leurs informations respectives
    - ue contient la liste des cours, avec leurs informations respectives
Ces deux listes locales sont mises à jour avec la base de données

Il y a plusieurs fonctions princpales :
    - fetchInfo :
        Permet de récuperer les informations de la base de données (tables Users, UE, et User_UE)
        et les sotcke dans les lsites locales

    - showUtilisateurs
    - showUE
        Ces deux fonctions permettent d'afficher les listes d'utilisateurs / d'ue sur la page admin lorsque l'on clique
        sur les boutons correspondant

    - showCreateModal
    - showEditModal
    - showDeleteModal
        Ces trois fonctions permettent d'afficher les fenêtres modales pour la création, la modification, et la
        suppression des utilisateurs / ue

    - confirmCreate
    - confirmEdit
    - confirmDelete
    - confirm
        Lorsque que l'on clique sur confirmer dans une fenetre modale, on appelle la fonction confirm, qui vient elle
        même appeler la fonction de confirmation correspondant à la fenetre modale. Les fonctions confirmCreate,
        confirmEdit, et confirmDelete utilisent des fonctions de AdminController.php pour mettre à jour la base de
        données (pour créer, modifier, supprimer)
*/


let utilisateurs = [];
let ue = [];

document.addEventListener('DOMContentLoaded', function() {
    const selectionDiv = document.querySelector('.selection');

    // Bouton qui permet d'afficher la liste des utilisateurs
    const utilisateursButton = document.createElement('button');
    utilisateursButton.textContent = 'Utilisateurs';
    utilisateursButton.addEventListener('click', showUtilisateurs);
    utilisateursButton.classList.add('btn-selection', 'btn-enabled');

    // Bouton qui permet d'afficher la liste des UE
    const ueButton = document.createElement('button');
    ueButton.textContent = 'UE';
    ueButton.addEventListener('click', showUE);
    ueButton.classList.add('btn-selection', 'btn-enabled');

    selectionDiv.appendChild(utilisateursButton);
    selectionDiv.appendChild(ueButton);

    // Création du div
    const contentDiv = document.querySelector('.content-display');

    // On récupere les infos de la base de données
    fetchInfo();

    // Fonction qui permet de récuperer les infos de la base de données
    async function fetchInfo(switchToUE = false) {
        // Vider les tableaux locaux avant de les remplir
        utilisateurs = [];
        ue = [];
        fetch('/api/admin') // Appel à la fonction getInfo de AdminController.php
            .then(response => response.json())
            .then(data => {
                const { users, courses } = data;
                users.forEach(user => utilisateurs.push(user));
                courses.forEach(course => ue.push(course));

                if (switchToUE) {
                    showUE(); // Basculer vers l'onglet UE
                } else {
                    showUtilisateurs(); // Afficher les utilisateurs par défaut
                }
            })
            .catch(error => console.error('Error fetching courses/users:', error));
    }

    // Fonction qui affiche la liste des utilisateurs
    function showUtilisateurs() {
        contentDiv.innerHTML = ''; // Efface le contenu précédent

        // On créer ensuite les différents éléments de la page
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
        // Parcours de chaque utilisateur pour afficher ses infos et les boutons de modification / suppression
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

            let roleText = "Inconnu";
                if (utilisateur.roles.includes("ROLE_PROF") && utilisateur.roles.includes("ROLE_ADMIN")) {
                    roleText = "Professeur / Admin";
                } else if (utilisateur.roles.includes("ROLE_PROF")) {
                    roleText = "Professeur";
                } else if (utilisateur.roles.includes("ROLE_USER")) {
                    roleText = "Etudiant";
                } else if (utilisateur.roles.includes("ROLE_ADMIN")) {
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

    // Même chose que showUtilisateurs mais pour les cours
    function showUE() {
        contentDiv.innerHTML = '';

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
        // Parcours des cours
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
        // On crée les différents élément du formulaire
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
            // On adapte le formulaire pour les utilisateurs
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

                roleSelect.appendChild(option); // Ajoute l'option au select
            });
            modalContent.appendChild(roleSelect);
            modalContent.appendChild(document.createElement('br'));

            // Fonction qui permet d'ajouter des inscriptions à l'utilisateur, ainsi que de bloquer l'accès aux inscriptions si l'utilisateur est un admin
            roleSelect.addEventListener('change', function () {
                if (roleSelect.value === 'ROLE_ADMIN') {
                    inscriptionsSelect.disabled = true;
                    defaultOption.textContent = "Vous ne pouvez pas ajouter de cours à un admin";
                    const ueList = document.getElementById('new-ueList');

                    if (ueList) {
                        const listItems = ueList.querySelectorAll('li');

                        listItems.forEach((listItem) => {
                            listItem.remove(); // Supprimer les li
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
            inscriptionsSelect.appendChild(defaultOption); // Ajoute l'option au select
            ue.forEach(course => {
                const option = document.createElement('option'); // Crée une option
                option.value = course.id; // Attribue la valeur de l'option
                option.textContent = course.code;
                inscriptionsSelect.appendChild(option); // Ajoute l'option au select
            })
            modalContent.appendChild(inscriptionsSelect);
            modalContent.appendChild(document.createElement('br'));

            const ueList = document.createElement('ul');
            ueList.id = 'new-ueList';
            const listItem = document.createElement('li');
            listItem.textContent = '- Aucune UE';
            ueList.appendChild(listItem);
            // Ajoute la liste ul au modal
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
            // On adapte de la même façon le formulaire pour les cours
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
            // Ajoute la liste ul au modal
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

                // Ajout d'un événement pour supprimer l'utilisateur
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

        // On finit d'implémenter le formulaire
        modalContent.appendChild(document.createElement('p'));

        // Ajouter les boutons de confirmation et d'annulation
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

        //Définition des variables qui serviront pour récuperer les infos
        // Variables pour les utilisateur
        let editName; // Présente pour les deux
        let editFirst_name;
        let editRole;
        let editInscription = []; // Présente pour les deux

        //Variables pour les cours
        let editCode;
        let editDescription;
        let editImage;

        const editId = listItem.querySelector('.item-id').textContent;
        if (isUser) {
            // On récupère les infos de l'utilisateur, et on affiche le formulaire
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
                            listItem.remove(); // Supprimer les li
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
                    const listItem = document.createElement('li'); // Crée un élément li
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
                    ueList.appendChild(listItem); // Ajoute l'élément li à la liste ul
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
            // De la même manière, on récupère les infos du cours, et on affiche le formulaire
            ue.forEach(course => {
                if (course.id == editId) {
                    editCode = course.code;
                    editName = course.nom;
                    editDescription = course.description;
                    editImage = "images/" + course.image;

                    if (Array.isArray(course.users)) {
                        course.users.forEach(user => {
                            editInscription.push(user); // Ajoute au tableau local
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
                inscriptionsSelect.appendChild(option); // Ajoute l'option au select
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
                    const listItem = document.createElement('li'); // Crée un élément li
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
                    usersList.appendChild(listItem); // Ajoute l'élément li à la liste ul
                });
            }

            // Ajoute la liste ul au modal
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

        // On affiche ensuite le reste du formulaire
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
            // L'élément est un utilisateur, on récupère les infos rentrées sur le formulaire
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

            // On définit le nouvel utilisateur en regroupant les variables
            let newUser = {
                id: newId,
                nom: name,
                prenom: first_name,
                password: password,
                email: email,
                roles: newRole,
                inscriptions: [] // Initialise un tableau vide pour les inscriptions
            };

            console.log("newUser", newUser);

            inscriptions.forEach(course => {
                ue.forEach(cours => {
                    if (course == cours.id) {
                        newUser.inscriptions.push(cours.id); // Ajoute au tableau
                        newUser.inscriptions.sort()
                        cours.users.push(newUser.id);
                    }
                });

            });

            // Appel de la fonction createUser pour créer l'utilisateur sur la base de données
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
                        // On récupère l'utilisateur pour l'ajouter à la liste locale
                        newUser = {
                            id: data.user.id,
                            nom: data.user.nom,
                            prenom: data.user.prenom,
                            email: data.user.email,
                            roles: data.user.roles,
                            inscriptions: data.user.inscriptions,
                        };
                        alert(`Utilisateur ${data.user.nom} ${data.user.prenom} créé avec succès et ajouté à la liste.`);
                        utilisateurs.push(newUser); // On ajoute l'utilisateur à la liste locale
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
            const imageInput = document.getElementById('new-image').files[0];
            const userList = document.getElementById('new-usersList');
            const inscriptions = Array.from(userList.querySelectorAll('li')).map(item => item.value);

            if (!code || !nom || !description) {
                alert('Veuillez remplir tous les champs avant de confirmer.');
                return;
            }

            // Création de l'objet FormData
            const formData = new FormData();
            formData.append('code', code);
            formData.append('nom', nom);
            formData.append('description', description);
            if (imageInput) {
                formData.append('image', imageInput); // Ajout de l'image
            }

            // Ajout des utilisateurs uniquement si la liste n'est pas vide
            if (inscriptions.length > 0) {
                inscriptions
                    .filter(userId => userId !== 0 && userId !== null && userId !== undefined) // Filtrer les valeurs invalides
                    .forEach(userId => formData.append('users[]', userId));
            }

            console.log("formData", formData);

            // Envoi de la requête avec fetch
            fetch('/api/admin/create-course', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.course && data.course.id) {
                        alert(`Cours ${data.course.nom} créé avec succès.`);
                        closeModal();
                        fetchInfo(true); // Rafraîchit les données
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
            // L'élément est un utilisateur, on récupère les informations rentrées dans le formulaire
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
                    // On modifie l'utilisateur local
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

                    // Appel de la fonction updateUser de AdminController.php pour mettre à jour la base de données
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
            // L'élément est un cours, on récupère les informations rentrées dans le formulaire
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
                    // On modifie le cours local
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

                    // Appel de la fonction updateCourse de AdminController.php pour mettre à jour la base de données
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

        listItem.remove(); // On enlève la ligne correspondante dans la liste de la page

        // On enlève l'élément local du tableau correspondant
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

        // Appel de la fonction deleteElement de AdminController.php pour suppprimer l'entrée dans la base de données
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