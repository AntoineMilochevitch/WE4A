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
        { name: 'Utilisateur 1', description: 'Description 1' },
        { name: 'Utilisateur 2', description: 'Description 2' },
        { name: 'Utilisateur 3', description: 'Description 3' },
        { name: 'Utilisateur 4', description: 'Description 4' },
        { name: 'Utilisateur 5', description: 'Description 5' },
        { name: 'Utilisateur 6', description: 'Description 6' },
        { name: 'Utilisateur 7', description: 'Description 7' },
        { name: 'Utilisateur 8', description: 'Description 8' },
        { name: 'Utilisateur 9', description: 'Description 9' }
        
    ];

    const ue = [
        { name: 'UE 1', description: 'Description 1' },
        { name: 'UE 2', description: 'Description 2' },
        { name: 'UE 3', description: 'Description 3' }
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

            const descriptionSpan = document.createElement('span');
            descriptionSpan.className = 'item-description';
            descriptionSpan.textContent = utilisateur.description;
            li.appendChild(descriptionSpan);

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
            nameSpan.className = 'item-name';
            nameSpan.textContent = course.name;
            li.appendChild(nameSpan);

            const descriptionSpan = document.createElement('span');
            descriptionSpan.className = 'item-description';
            descriptionSpan.textContent = course.description;
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
        
        // Ajouter les champs de saisie
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'new-name';
        nameInput.placeholder = isUser ? 'Nom' : 'Code';
        modalContent.appendChild(nameInput);
        modalContent.appendChild(document.createElement('br'));

        const descriptionInput = document.createElement('input');
        descriptionInput.type = 'text';
        descriptionInput.id = 'new-description';
        descriptionInput.placeholder = isUser ? 'Prénom' : 'Description';
        modalContent.appendChild(descriptionInput);
        modalContent.appendChild(document.createElement('br'));

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
        const name = document.getElementById('new-name').value;
        const description = document.getElementById('new-description').value;
        
        if (!name || !description) {
            alert('Veuillez remplir tous les champs avant de confirmer.');
            return;
        }
        
        const list = utilisateursButton.disabled ? utilisateurs : ue;
        list.push({ name, description });
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