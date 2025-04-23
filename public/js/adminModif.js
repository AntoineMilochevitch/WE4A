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
                    alert(user.nom);
                    alert(user.roles);
                    alert(user.userUe);
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
        header.textContent = 'Liste des Utilisateurs';
        contentDiv.appendChild(header);

        let i = 0;
        const ul = document.createElement('ul');
        utilisateurs.forEach(utilisateur => {
            const li = document.createElement('li');
            li.id = `liUser-${i}`;

            const nameSpan = document.createElement('span');
            nameSpan.className = 'item-name';
            nameSpan.textContent = utilisateur.nom;
            li.appendChild(nameSpan);

            const firstNameSpan = document.createElement('span');
            firstNameSpan.className = 'item-first_name';
            firstNameSpan.textContent = utilisateur.prenom;
            li.appendChild(firstNameSpan);

            /* Activer si les utilisateurs sont associés à un role
            const roleSpan = document.createElement('span');
            roleSpan.className = 'item-role';
            roleSpan.textContent = utilisateur.role;
            li.appendChild(roleSpan);
             */

            /* Activer si les utilisateurs sont associés à un departement
            const departementSpan = document.createElement('span');
            departementSpan.className = 'item-departement';
            departementSpan.textContent = utilisateur.departement;
            li.appendChild(departementSpan);
             */

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

            const roleInput = document.createElement('input');
            roleInput.type = 'text';
            roleInput.id = 'new-role';
            roleInput.placeholder =  'Rôle';
            modalContent.appendChild(roleInput);
            modalContent.appendChild(document.createElement('br'));

            const departementInput = document.createElement('input');
            departementInput.type = 'text';
            departementInput.id = 'new-departement';
            departementInput.placeholder = 'Departement';
            modalContent.appendChild(departementInput);
            modalContent.appendChild(document.createElement('br'));

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
            libelleInput.placeholder = 'Libellé';
            modalContent.appendChild(libelleInput);
            modalContent.appendChild(document.createElement('br'));

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
        }

        const messageUE = document.createElement('p');
        messageUE.textContent = 'Ajouter des inscriptions :';
        modalContent.appendChild(messageUE);

        const addButton = document.createElement('button');
        addButton.className = 'btn-add btn-action';
        addButton.textContent = 'Ajouter';
        addButton.id = 'addButton';
        addButton.onclick = function () {

        }
        modalContent.appendChild(addButton);

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
        confirmationMessage.textContent = 'Veuillez modifier les champs ci-dessus.';
        modalContent.appendChild(confirmationMessage);

        let editInscription;
        let editDescription;
        if (isUser) {
            const editName = listItem.querySelector('.item-name').textContent;
            const editFirst_name = listItem.querySelector('.item-first_name').textContent;
            //const editRole = listItem.querySelector('.item-role').textContent;
            //const editDepartement = listItem.querySelector('.item-departement').textContent;
            //editInscription = utilisateurs.find(user => user.name === editName).inscription;

            // Ajouter le champ pour le nom
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.id = 'edit-name';
            nameInput.value = editName;
            modalContent.appendChild(nameInput);
            modalContent.appendChild(document.createElement('br'));

            const first_nameInput = document.createElement('input');
            first_nameInput.type = 'text';
            first_nameInput.id = 'edit-first_name';
            first_nameInput.value = editFirst_name;
            modalContent.appendChild(first_nameInput);
            modalContent.appendChild(document.createElement('br'));

            /*const roleInput = document.createElement('input');
            roleInput.type = 'text';
            roleInput.id = 'edit-role';
            roleInput.value = editRole;
            modalContent.appendChild(roleInput);
            modalContent.appendChild(document.createElement('br'));*/

            /*// Ajouter le champ pour le departement
            const departementInput = document.createElement('input');
            departementInput.type = 'text';
            departementInput.id = 'edit-departement';
            departementInput.value = editDepartement;
            modalContent.appendChild(departementInput);
            modalContent.appendChild(document.createElement('br'));*/
        } else {
            const editCode = listItem.querySelector('.item-code').textContent;
            const editLibelle = listItem.querySelector('.item-libelle').textContent;
            /*editInscription = [];
            utilisateurs.forEach(user => {
                if (user.inscription.includes(editCode)) {
                    editInscription.push(user.name);
                }
            })*/
            let editDescription;
            ue.forEach(course => {
                if (course.code === editCode) {
                    editDescription = course.description;
                }
            })

            // Ajouter le champ pour le code
            const codeInput = document.createElement('input');
            codeInput.type = 'text';
            codeInput.id = 'edit-code';
            codeInput.value = editCode;
            modalContent.appendChild(codeInput);
            modalContent.appendChild(document.createElement('br'));

            // Ajouter le champ pour le libelle
            const libelleInput = document.createElement('input');
            libelleInput.type = 'text';
            libelleInput.id = 'edit-libelle';
            libelleInput.value = editLibelle;
            modalContent.appendChild(libelleInput);
            modalContent.appendChild(document.createElement('br'));

            const confirmationMessage = document.createElement('p');
            confirmationMessage.textContent = 'Description de l\'UE';
            modalContent.appendChild(confirmationMessage);

            const descriptionInput = document.createElement('textarea');
            descriptionInput.type = 'text';
            descriptionInput.id = 'edit-description';
            descriptionInput.value = editDescription;
            modalContent.appendChild(descriptionInput);
            modalContent.appendChild(document.createElement('br'));
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
            const role = document.getElementById('new-role').value;
            const departement = document.getElementById('new-departement').value;

            if (!name  || !first_name || !role || !departement) {
                alert('Veuillez remplir tous les champs avant de confirmer.');
                return;
            }

            utilisateurs.push({ name, first_name, role, departement });
        }
        else {
            const code = document.getElementById('new-code').value;
            const libelle = document.getElementById('new-libelle').value;
            const description = document.getElementById('new-description').value;

            if (!code || !libelle || !description) {
                alert('Veuillez remplir tous les champs avant de confirmer.');
                return;
            }

            ue.push({ code, libelle, description });
        }

        closeModal();

        // Rafraichissement de la liste, à remplacer par du Ajax plus tard
        if (utilisateursButton.disabled) {
            showUtilisateurs();
        } else {
            showUE();
        }
    }

    // Fonction qui permet de confirmer la modification d'un élément d'une des listes
    function confirmEdit(button) {
        const listItemId = button.getAttribute('data-list-item-id');
        const listItem = document.getElementById(listItemId);

        if (utilisateursButton.disabled) {
            const newName = document.getElementById('edit-name').value;
            const newFirst_name = document.getElementById('edit-first_name').value;
            const newRole = document.getElementById('edit-role').value;
            const newDepartement = document.getElementById('edit-departement').value;

            if (!newName || !newFirst_name || !newRole || !newDepartement) {
                alert('Veuillez remplir tous les champs avant de confirmer.');
                return;
            }

            const nameSpan = listItem.querySelector('.item-name');
            const first_nameSpan = listItem.querySelector('.item-first_name');
            const roleSpan = listItem.querySelector('.item-role');
            const departementSpan = listItem.querySelector('.item-departement');

            if (nameSpan) nameSpan.textContent = newName;
            if (first_nameSpan) first_nameSpan.textContent = newFirst_name;
            if (roleSpan) roleSpan.textContent = newRole;
            if (departementSpan) departementSpan.textContent = newDepartement;

            utilisateurs.forEach(user => {
                if (user.id === Number(listItemId[listItemId.length - 1]) + 1 ) {
                    user.name = newName;
                    user.first_name = newFirst_name;
                    user.role = newRole;
                    user.departement = newDepartement;
                }
            })
        }
        else {
            const newCode = document.getElementById('edit-code').value;
            const newLibelle = document.getElementById('edit-libelle').value;
            const newDescription = document.getElementById('edit-description').value;

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
                if (course.id === Number(listItemId[listItemId.length - 1]) + 1 ){
                    course.code = newCode;
                    course.libelle = newLibelle
                }
            })
        }
    }

    // Fonction qui permet de confirmer la suppression d'un élément d'une des listes
    function confirmDelete(button) {
        const listItemId = button.getAttribute('data-list-item-id');
        const listItem = document.getElementById(listItemId);

        listItem.remove();

        if (utilisateursButton.disabled) {
            utilisateurs.forEach(user => {
                if (user.id === Number(listItemId[listItemId.length - 1]) + 1 ) {
                    utilisateurs.splice(utilisateurs.indexOf(user), 1);
                }
            })
        }
        else {
            ue.forEach(course => {
                if (course.id === Number(listItemId[listItemId.length - 1]) + 1 ){
                    ue.splice(ue.indexOf(course), 1);
                }
            })
        }
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