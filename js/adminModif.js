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
        { name: 'Utilisateur 3', description: 'Description 3' }
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
        createButton.onclick = function() {showCreateModal(true);};
        contentDiv.appendChild(createButton);

        const header = document.createElement('h2');
        header.textContent = 'Liste des Utilisateurs';
        contentDiv.appendChild(header);

        const ul = document.createElement('ul');
        utilisateurs.forEach(utilisateur => {
            const li = document.createElement('li');
            const nameSpan = document.createElement('span');
            nameSpan.className = 'item-name';
            nameSpan.textContent = utilisateur.name;
            li.appendChild(nameSpan);

            const descriptionSpan = document.createElement('span');
            descriptionSpan.className = 'item-description';
            descriptionSpan.textContent = utilisateur.description;
            li.appendChild(descriptionSpan);

            const editButton = document.createElement('button');
            editButton.className = 'btn-action btn-modify';
            editButton.textContent = 'Modifier';
            editButton.onclick = function() { showEditModal(this); };
            li.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn-action btn-delete';
            deleteButton.textContent = 'Supprimer';
            deleteButton.onclick = function() { showDeleteModal(this); };
            li.appendChild(deleteButton);

            ul.appendChild(li);
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
        createButton.onclick = function() {showCreateModal(false);};
        contentDiv.appendChild(createButton);

        const header = document.createElement('h2');
        header.textContent = 'Liste des UE';
        contentDiv.appendChild(header);

        const ul = document.createElement('ul');
        ue.forEach(course => {
            const li = document.createElement('li');
            const nameSpan = document.createElement('span');
            nameSpan.className = 'item-name';
            nameSpan.textContent = course.name;
            li.appendChild(nameSpan);

            const descriptionSpan = document.createElement('span');
            descriptionSpan.className = 'item-description';
            descriptionSpan.textContent = course.description;
            li.appendChild(descriptionSpan);

            const editButton = document.createElement('button');
            editButton.className = 'btn-action btn-modify';
            editButton.textContent = 'Modifier';
            editButton.onclick = function() { showEditModal(this); };
            li.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn-action btn-delete';
            deleteButton.textContent = 'Supprimer';
            deleteButton.onclick = function() { showDeleteModal(this); };
            li.appendChild(deleteButton);

            ul.appendChild(li);
        });
        contentDiv.appendChild(ul);

        ueButton.disabled = true;
        ueButton.classList.remove('btn-enabled');
        utilisateursButton.disabled = false;
        utilisateursButton.classList.add('btn-enabled');
    }

    function showCreateModal(isUser) {
        if (isUser){
            text1 = 'Nom';
            text2 = 'Prenom';
        }
        else{
            text1 = 'Code';
            text2 = 'Description';
        }
        const modal = document.getElementById('modal');
        modal.style.display = 'block';
        document.getElementById('modal-title').textContent = 'Creation d\'un element';
        //document.getElementById('modal-content').innerHTML = '<input type="text" id="new-name" placeholder="Nom"><br><input type="text" id="new-description" placeholder="Description"><br><button onclick="confirmCreate()">Confirmer</button> <button onclick="closeModal()">Annuler</button>';
        
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = '';

        const input1 = document.createElement(input);
        input1.className = 'input-modal';
        input1.textContent = text1;

        const input2 = document.createElement(input);
        input2.className = 'input-modal';
        input2.textContent = text2;

        modalContent.appendChild(input1);
        modalContent.appendChild(document.createElement('br'));
        modalContent.appendChild(input2);
        modalContent.appendChild(document.createElement('br'));

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirmer';
        confirmButton.onclick = confirmCreate;

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Annuler';
        cancelButton.onclick = closeModal;

        modalContent.appendChild(confirmButton);
        modalContent.appendChild(cancelButton);

    }

    function showEditModal(button) {
        const listItem = button.parentElement;
        const name = listItem.querySelector('.item-name').textContent;
        const description = listItem.querySelector('.item-description').textContent;
        const modal = document.getElementById('modal');
        modal.style.display = 'block';
        document.getElementById('modal-title').textContent = 'Modifier';
        document.getElementById('modal-content').innerHTML = `<input type="text" id="edit-name" value="${name}"><br><input type="text" id="edit-description" value="${description}"><br><button onclick="confirmEdit(this)">Confirmer</button> <button onclick="closeModal()">Annuler</button>`;
    }

    function showDeleteModal(button) {
        const listItem = button.parentElement;
        const modal = document.getElementById('modal');
        modal.style.display = 'block';
        document.getElementById('modal-title').textContent = 'Supprimer';
        document.getElementById('modal-content').innerHTML = '<p>Êtes-vous sûr de vouloir supprimer cet élément ?</p><button onclick="confirmDelete(this)">Confirmer</button> <button onclick="closeModal()">Annuler</button>';
    }

    function closeModal() {
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
    }

    function confirmCreate() {
        const name = document.getElementById('new-name').value;
        const description = document.getElementById('new-description').value;
        const list = utilisateursButton.disabled ? utilisateurs : ue;
        list.push({ name, description });
        closeModal();
        if (utilisateursButton.disabled) {
            showUtilisateurs();
        } else {
            showUE();
        }
    }

    function confirmEdit() {
        const listItem = button.parentElement.parentElement;
        const name = document.getElementById('edit-name').value;
        const description = document.getElementById('edit-description').value;
        listItem.querySelector('.item-name').textContent = name;
        listItem.querySelector('.item-description').textContent = description;
        closeModal();
    }

    function confirmDelete() {
        const listItem = button.parentElement.parentElement;
        listItem.remove();
        closeModal();
    }

    showUtilisateurs(); // Pour initialiser la page avec la liste des users



    /* Rajouter ici des fonctions qui reprennent les éléments ci dessus */



    // Fonction qui permet d'afficher le formulaire (fonction showForm) lorsque l'on clique surles boutons creer, modifier et supprimer
    document.querySelector('.btn-action').addEventListener('click', function() {
        showForm();
    });

    // Fonction qui permet de fermer le formulaire quand on clique en dehors de celui-ci
    window.onclick = function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    }
});