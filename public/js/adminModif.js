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

    const utilisateurs = [
        { name: 'MOLIERES', first_name: 'Samuel', role: 'Etudiant' ,departement: 'INFO', inscription: ['WE4A', 'WE4B', 'SI40', 'AP4A']},
        { name: 'EL ANDALOUSSI BENBRAHIM', first_name: 'Nizar', role: 'Etudiant' ,departement: 'INFO', inscription: ['WE4A', 'WE4B', 'SI40', 'AP4B']},
        { name: 'MILOCHEVITCH', first_name: 'Antoine', role: 'Etudiant' ,departement: 'INFO', inscription: ['WE4A', 'WE4B', 'SI40', 'IA41']},
        { name: 'CORREARD', first_name: 'Alexis', role: 'Etudiant' ,departement: 'INFO', inscription: ['WE4A', 'WE4B', 'SI40', 'IA41']},
        { name: 'BOOL', first_name: 'George', role: 'Etudiant' ,departement: 'MECA', inscription: ['MT3F', 'MAA1', 'PS25']},
        { name: 'LOVELACE', first_name: 'Ada', role: 'Etudiant' ,departement: 'IMSI', inscription: ['MT3F', 'PS25', 'CM1A', 'CM1B']},
        { name: 'HAMILTON', first_name: 'Margaret', role: 'Etudiant' ,departement: 'ENERGIE', inscription: ['PS22', 'AP4A', 'MT3F']},
        { name: 'TURING', first_name: 'Alan', role: 'Etudiant' ,departement: 'EDIM', inscription: ['PS25', 'MT3F', 'MAA1', 'CM1A']},
        { name: 'PROF1', first_name: 'Prof1', role: 'Professeur' ,departement: 'INFO', inscription: ['WE4A', 'WE4B', 'SI40']},
        { name: 'PROF2', first_name: 'Prof2', role: 'Professeur' ,departement: 'INFO', inscription: ['IA41', 'AP4A', 'AP4B']},
        { name: 'PROF3', first_name: 'Prof3', role: 'Professeur' ,departement: 'MECA', inscription: ['MT3F', 'PS25', 'MAA1', 'CM1A', 'CM1B']},
    ];

    const ue = [
        { code: 'WE4A', libelle: 'Technologies et programmation WEB', description: 'Maîtriser les technologies Web permettant de créer des sites Web modernes'},
        { code: 'WE4B', libelle: 'Technologies WEB avancées', description: 'Comprendre et appliquer une architecture web avancée à l\'aide d\'un Framework'},
        { code: 'SI40', libelle: 'Systèmes d\'information', description: 'Mettre en œuvre des outils de conception de systèmes d\'information permettant la mise en application des méthodes associées'},
        { code: 'IA41', libelle: 'Intelligence artificielle', description: 'Acquérir les compétences sur les principaux concepts et outils logiciels dédiés à l\'Intelligence Artificielle (IA)'},
        { code: 'AP4A', libelle: 'Programmation Orientée Objet', description: 'Acquérir les compétences pour analyser et concevoir des applications en utilisant les principes de la POO'},
        { code: 'AP4B', libelle: 'Programmation Orientée Objet', description: 'Programmation Orientée Objet: Modélisation UML et langage Java'},
        { code: 'MT3F', libelle: 'Algèbre et analyse', description: 'Acquérir l\'essentiel des connaissances fondamentales en algèbre et en analyse, utiles à l\'ingénieur'},
        { code: 'MAA1', libelle: 'Structure et propriétés des matériaux ', description: 'Appréhender et comprendre la structure des matériaux'},
        { code: 'CM1A', libelle: 'Organisation de la matière - partie I', description: 'Connaître les grands principes de base pour la chimie des matériaux'},
        { code: 'CM1B', libelle: 'Organisation de la matière - partie II', description: 'Décrire les concepts de base de la chimie générale : Solubilité, oxydo-réduction, cinétique chimique'},
        { code: 'PS22', libelle: 'Electronique analogique', description: 'Donner les bases tant théoriques que pratiques de l\'électronique analogique'},
        { code: 'PS25', libelle: 'Mécanique du solide', description: 'Apporter les bases générales indispensables pour l\'analyse cinématique et technologique des mécanismes'}
    ];

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

        i = 0;
        const ul = document.createElement('ul');
        utilisateurs.forEach(utilisateur => {
            const li = document.createElement('li');
            li.id = `liUser-${i}`;

            const nameSpan = document.createElement('span');
            nameSpan.className = 'item-name';
            nameSpan.textContent = utilisateur.name;
            li.appendChild(nameSpan);

            const firstNameSpan = document.createElement('span');
            firstNameSpan.className = 'item-first_name';
            firstNameSpan.textContent = utilisateur.first_name;
            li.appendChild(firstNameSpan);

            const roleSpan = document.createElement('span');
            roleSpan.className = 'item-role';
            roleSpan.textContent = utilisateur.role;
            li.appendChild(roleSpan);

            const departementSpan = document.createElement('span');
            departementSpan.className = 'item-departement';
            departementSpan.textContent = utilisateur.departement;
            li.appendChild(departementSpan);

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
            descriptionSpan.textContent = course.libelle;
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


    showUtilisateurs(); // Pour initialiser la page avec la liste des users

    
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

            const descriptionInput = document.createElement('input');
            descriptionInput.type = 'text';
            descriptionInput.id = 'new-description';
            descriptionInput.placeholder = 'Description';
            modalContent.appendChild(descriptionInput);
            modalContent.appendChild(document.createElement('br'));

            modalContent.appendChild(document.createElement('p'));
        }

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
        const name = listItem.querySelector('.item-name').textContent;
        const description = listItem.querySelector('.item-description').textContent;
    
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
    
        // Ajouter le champ pour le nom
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'edit-name';
        nameInput.value = name;
        modalContent.appendChild(nameInput);
        modalContent.appendChild(document.createElement('br'));
    
        // Ajouter le champ pour la description
        const descriptionInput = document.createElement('input');
        descriptionInput.type = 'text';
        descriptionInput.id = 'edit-description';
        descriptionInput.value = description;
        modalContent.appendChild(descriptionInput);
        modalContent.appendChild(document.createElement('br'));

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

        const newName = document.getElementById('edit-name').value;
        const newDescription = document.getElementById('edit-description').value;

        if (!newName || !newDescription) {
            alert('Veuillez remplir tous les champs avant de confirmer.');
            return;
        }

        const nameSpan = listItem.querySelector('.item-name');
        const descriptionSpan = listItem.querySelector('.item-description');

        if (nameSpan) nameSpan.textContent = newName;
        if (descriptionSpan) descriptionSpan.textContent = newDescription;
    }

    // Fonction qui permet de confirmer la suppression d'un élément d'une des listes
    function confirmDelete(button) {
        const listItemId = button.getAttribute('data-list-item-id');
        const listItem = document.getElementById(listItemId);
        listItem.remove();
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