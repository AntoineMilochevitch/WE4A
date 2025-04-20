let isEditing = false;
let activePart = null; // Variable pour stocker la partie active

document.addEventListener('DOMContentLoaded', function() {

    const courseContent = document.querySelector('.course-content');
    const participantsContent = document.querySelector('.participants-content');

    /**
     * Load sections from the API
     * @param ueId
     */
    function loadSections(ueId) {
        fetch(`/api/course/${ueId}/sections`)
            .then(response => response.json())
            .then(data => {
                courseContent.innerHTML = '';
                data.forEach(section => {
                    createPart(
                        section.titre,
                        section.elements.map(element => ({
                            id : element.id,
                            icon: element.type === 'texte' ? 'document-text-outline' : 'cloud-upload-outline',
                            text: element.titre,
                            description: element.description,
                            date: element.date,
                        })),
                        section.id
                    );
                });
            })
            .catch(error => console.error('Erreur lors du chargement des sections :', error));
    }

    loadSections(ueId);

    /**
     * Load participants from the API
     * @param ueId
     */
    function loadParticipants(ueId) {
        fetch(`/api/course/${ueId}/users`)
            .then(response => response.json())
            .then(data => {
                const professorsContainer = participantsContent.querySelector('.professors .part-content');
                const studentsContainer = participantsContent.querySelector('.students .part-content');

                // Vider les conteneurs
                professorsContainer.innerHTML = '';
                studentsContainer.innerHTML = '';

                // Parcourir les utilisateurs et les ajouter dans les conteneurs correspondants
                data.forEach(user => {
                    const participantHtml = `
                        <div class="participant">
                            <img src="/images/${user.avatar}" alt="Photo de profil" class="profile-pic">
                            <span class="participant-name">${user.nom}</span>
                            <span class="participant-firstname">${user.prenom}</span>
                        </div>
                        <div class="ligne-gris"></div>
                    `;

                    if (user.role.includes('enseignant')) {
                        professorsContainer.insertAdjacentHTML('beforeend', participantHtml);
                    } else if (user.role.includes('etudiant')) {
                        studentsContainer.insertAdjacentHTML('beforeend', participantHtml);
                    }
                });
            })
            .catch(error => console.error('Erreur lors du chargement des participants :', error));
    }

    document.querySelectorAll('.course-menu-li a').forEach(item => {
        item.addEventListener('click', function(e) {
            const text = this.textContent.trim();
            if (text === 'Participants') {
                console.log("Chargement des participants...");
                loadParticipants(ueId);
            }
        });
    });

    /**
     * Toggle the display of part content
     * @param header
     */
    function togglePartContent(header) {
        if (isEditing) return;
        const partContent = header.nextElementSibling;
        const isCollapsed = partContent.style.display === 'none';
        partContent.style.display = isCollapsed ? 'block' : 'none';
        header.classList.toggle('collapsed', !isCollapsed);
    }

    /**
     * Save section to server
     * @param ueId
     * @param title
     * @param elements
     */
    function saveSectionToServer(ueId, title, elements) {
        fetch(`/api/course/${ueId}/add_section`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                titre: title,
                elements: elements.map((element, index) => ({
                    titre: element.text,
                    description: element.description,
                    type: element.icon === 'document-text-outline' ? 'texte' : 'fichier',
                    ordre: index + 1,
                })),
            }),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.error || 'Erreur lors de l\'ajout de la section');
                    });
                }
                return response.json();
            });
    }

    /**
     * Save element to server
     * @param ueId
     * @param sectionId
     * @param element
     */
    function saveElementToServer(ueId, sectionId, element) {
        console.log('Données envoyées :', {
            sectionId: sectionId,
            titre: element.text,
            type: element.icon === 'depot' ? 'texte' : 'fichier',
            description: element.description
        });
        fetch(`/api/course/${ueId}/add_element`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sectionId: sectionId,
                titre: element.text,
                type: element.icon === 'depot' ? 'texte' : 'fichier', // Correctement mappé
                description: element.description
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    console.log('Élément ajouté avec succès :', data.message);
                } else {
                    console.error('Erreur lors de l\'ajout de l\'élément :', data.error);
                }
            })
            .catch(error => console.error('Erreur réseau :', error));
    }

    /**
     * Create a new part
     * @param title
     * @param elements
     * @param sectionId
     */
    function createPart(title, elements, sectionId) {
        const courseContent = document.querySelector('.course-content');
        if (!courseContent) {
            console.error('Element .course-content introuvable.');
            return;
        }

        
        // Créer la nouvelle partie en html
        const newPart = document.createElement('div');
        newPart.classList.add('part');
        newPart.setAttribute('data-section-id', sectionId);
        newPart.innerHTML = `
            <div class="part-header collapsed">
                <ion-icon name="chevron-down-outline"></ion-icon>
                <h2 contenteditable="false">${title}</h2>
                <ion-icon name="create-outline" class="btn-edit-part" title="Modifier"></ion-icon>
                <ion-icon name="trash-outline" class="btn-delete-part" title="Supprimer"></ion-icon>
                <ion-icon name="add-circle-outline" class="btn-add-element" title="Ajouter un élément"></ion-icon>
            </div>
            <div class="part-content" style="display: none;">
                ${elements.map(element => `
                    <div class="element" data-element-id="${element.id}">
                        <div class="element-header">
                            <ion-icon name="${element.icon}"></ion-icon>
                            <p contenteditable="false">${element.text}</p>
                            <ion-icon name="trash-outline" class="btn-delete-element" title="Supprimer"></ion-icon>
                        </div>
                        ${element.description ? `<p class="element-description">${element.description}</p>` : ''}
                        ${element.date ? `<p class="element-date">${element.date}</p>` : ''}
                        ${element.icon === 'document-outline' ? `<a href="#" class="element-download" download="${element.text}">Télécharger</a>` : ''}
                    </div>
                    <div class="ligne-gris"></div>
                `).join('')}
                <button type="button" class="btn-add-element" style="display: none;">Ajouter un élément</button>
            </div>
        `;
    
        // Ajouter la nouvelle partie à la fin du contenu du cours
        courseContent.appendChild(newPart);
    
        // Ajouter les événements aux boutons de la nouvelle partie
        const partHeader = newPart.querySelector('.part-header');
        partHeader.addEventListener('click', function () {
            togglePartContent(this);
        });
    
        const editButton = newPart.querySelector('.btn-edit-part');
        editButton.addEventListener('click', function () {
            editPart(newPart, this);
            togglePartContent(newPart.querySelector('.part-header'));
        });

        const deleteButton = newPart.querySelector('.btn-delete-part');
        deleteButton.addEventListener('click', function () {
            const confirmDelete = confirm("Voulez-vous vraiment supprimer cette partie ?");
            if (!confirmDelete) return;

            const sectionId = newPart.dataset.sectionId;
            if (!sectionId) {
                console.error("ID de la section introuvable.");
                return;
            }

            // Supprimer la section du serveur
            fetch(`/api/course/${ueId}/delete_section/${sectionId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(error => {
                            throw new Error(error.error || "Erreur lors de la suppression de la section.");
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Section supprimée avec succès :", data.message);
                    newPart.remove(); // Supprime la section du DOM
                })
                .catch(error => console.error("Erreur réseau :", error));
        });

        // Ajouter les événements aux éléments de la nouvelle partie
        newPart.querySelectorAll('.btn-delete-element').forEach(btn => {
            btn.addEventListener('click', function () {
                const element = btn.parentElement.parentElement;
                const elementId = element.dataset.elementId;
                const sectionId = newPart.dataset.sectionId;

                if (!elementId || !sectionId) {
                    console.error("ID de l'élément ou de la section introuvable.");
                    return;
                }

                const confirmDelete = confirm("Voulez-vous vraiment supprimer cet élément ?");
                if (!confirmDelete) return;

                fetch(`/api/course/${ueId}/delete_element/${sectionId}/${elementId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(error => {
                                throw new Error(error.error || "Erreur lors de la suppression de l'élément.");
                            });
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log("Élément supprimé avec succès :", data.message);
                        element.remove(); // Supprime l'élément du DOM
                    })
                    .catch(error => console.error("Erreur réseau :", error));
            });
        });
    
        const addElementButton = newPart.querySelector('.btn-add-element');
        addElementButton.addEventListener('click', function () {
            showElementForm(newPart);
        });
    }

    /**
     * Save changes to the section
     * @param part
     */
    function saveChanges(part) {
        const sectionId = part.dataset.sectionId;
        const title = part.querySelector('.part-header h2').innerText;
        const elements = Array.from(part.querySelectorAll('.element')).map(element => ({
            id: element.dataset.elementId,
            titre: element.querySelector('.element-header p').innerText,
            description: element.querySelector('.element-description')?.innerText || '',
            date: element.querySelector('.element-date')?.innerText || ''
        }));

        // Mettre à jour la section
        fetch(`/api/course/${ueId}/update_section/${sectionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ titre: title, elements }),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.error || "Erreur lors de la mise à jour de la section.");
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log("Section mise à jour avec succès :", data.message);
            })
            .catch(error => console.error("Erreur réseau :", error));
    }

    /**
     * Edit the part
     * @param part
     * @param editButton
     */
    function editPart(part, editButton) {
        const header = part.querySelector('.part-header');
        const title = header.querySelector('h2');
        const elements = part.querySelectorAll('.element p:not(.element-date)');
        const descriptions = part.querySelectorAll('.element-description');

        // Toggle le mode édition
        if (title.isContentEditable) {
            saveChanges(part);
            title.contentEditable = 'false';
            elements.forEach(element => element.contentEditable = 'false');
            descriptions.forEach(description => description.contentEditable = 'false');
            editButton.name = "create-outline";
            editButton.title = "Modifier";
            title.classList.remove('editable');
            elements.forEach(element => element.classList.remove('editable'));
            descriptions.forEach(description => description.classList.remove('editable'));
            isEditing = false;
        } else {
            title.contentEditable = 'true';
            elements.forEach(element => element.contentEditable = 'true');
            descriptions.forEach(description => description.contentEditable = 'true');
            editButton.name = "checkmark-outline";
            editButton.title = "Valider";
            title.classList.add('editable');
            elements.forEach(element => element.classList.add('editable'));
            descriptions.forEach(description => description.classList.add('editable'));
            isEditing = true;
        }
    }

    /**
     * Display the form to add a new part
     */
    function showPartForm() {
        const modal = document.getElementById('part-modal');
        modal.style.display = 'block';
    
        // Clear previous form data
        document.getElementById('part-title').value = '';
        document.getElementById('part-elements-container').innerHTML = '';
        document.getElementById('part-element-type').value = '';
        document.getElementById('part-element-fields').innerHTML = '';
    
        // Remove previous event listeners
        const addElementButton = document.getElementById('part-add-element');
        addElementButton.replaceWith(addElementButton.cloneNode(true));
    
        // Handle adding a new element to the form
        document.getElementById('part-add-element').addEventListener('click', function () {
            const elementType = document.getElementById('part-element-type').value;
            const elementText = document.getElementById('element-text').value;
            let elementHtml = '';
    
            // Create dynamic html based on the element type
            if (elementType === 'text') {
                const elementDate = new Date().toLocaleDateString();
                const elementDescription = document.getElementById('element-description').value;
                elementHtml = `
                    <div class="element">
                        <div class="element-header">
                            <ion-icon name="document-text-outline"></ion-icon>
                            <p>${elementText}</p>
                            <ion-icon name="trash-outline" class="btn-delete-element" title="Supprimer"></ion-icon>
                        </div>
                        <p class="element-description">${elementDescription}</p>
                        <p class="element-date">${elementDate}</p>
                    </div>
                    <div class="ligne-gris"></div>
                `;
            } else if (elementType === 'file') {
                const elementDate = new Date().toLocaleDateString();
                const elementDescription = document.getElementById('element-description').value;
                const elementFile = document.getElementById('part-element-file').files[0];
                const fileType = elementFile.type.split('/')[1];
                const fileIcon = getFileIcon(fileType);
                elementHtml = `
                    <div class="element">
                        <div class="element-header">
                            <ion-icon name="${fileIcon}"></ion-icon>
                            <p>${elementText}</p>
                            <ion-icon name="trash-outline" class="btn-delete-element" title="Supprimer"></ion-icon>
                        </div>
                        <p class="element-description">${elementDescription}</p>
                        <p class="element-date">${elementDate}</p>
                        <a href="#" class="element-download" download="${elementFile.name}">Télécharger</a>
                    </div>
                    <div class="ligne-gris"></div>
                `;
            } else if (elementType === 'depot') {
                const elementDescription = document.getElementById('element-description').value;
                elementHtml = `
                    <div class="element">
                        <div class="element-header">
                            <ion-icon name="cloud-upload-outline"></ion-icon>
                            <p>${elementText}</p>
                            <ion-icon name="trash-outline" class="btn-delete-element" title="Supprimer"></ion-icon>
                        </div>
                        <p class="element-description">${elementDescription}</p>
                        <p class="element-date">${new Date().toLocaleDateString()}</p>
                    </div>
                    <div class="ligne-gris"></div>
                `;
            } else {
                elementHtml = `
                    <div class="element">
                        <div class="element-header">
                            <ion-icon name="${elementType}"></ion-icon>
                            <p>${elementText}</p>
                            <ion-icon name="trash-outline" class="btn-delete-element" title="Supprimer"></ion-icon>
                        </div>
                    </div>
                    <div class="ligne-gris"></div>
                `;
            }
    
            // Add the new element to the form
            document.getElementById('part-elements-container').insertAdjacentHTML('beforeend', elementHtml);
            document.getElementById('element-text').value = ''; // Clear the input field
        });
    
        // Handle form submission
        const partForm = document.getElementById('part-form');
        partForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent page reload
    
            const title = document.getElementById('part-title').value;
            const elements = Array.from(document.querySelectorAll('#part-elements-container .element')).map(element => ({
                icon: element.querySelector('ion-icon').getAttribute('name'),
                text: element.querySelector('p').innerText,
                description: element.querySelector('.element-description') ? element.querySelector('.element-description').innerText : '',
                date: element.querySelector('.element-date') ? element.querySelector('.element-date').innerText : ''
            }));

            // Send the data to the server
            saveSectionToServer(ueId, title, elements)
                .then(response => {
                    if (response.id) {
                        createPart(title, elements, response.id);
                    } else {
                        console.error('Erreur lors de la création de la section :', response.error);
                    }
                })
                .catch(error => console.error('Erreur réseau :', error));

            const modal = document.getElementById('part-modal');
            modal.style.display = 'none'; // Close the modal

        });


        // Handle cancel button
        document.getElementById('cancel-part').addEventListener('click', function () {
            modal.style.display = 'none';
        });
    }

    /**
     * Get the file icon based on the file type
     * @param fileType
     * @returns {string}
     */
    function getFileIcon(fileType) {
        switch (fileType) {
            case 'pdf':
                return 'document-outline';
            case 'doc':
            case 'docx':
                return 'document-text-outline';
            case 'ppt':
            case 'pptx':
                return 'document-text-outline';
            case 'zip':
                return 'archive-outline';
            default:
                return 'document-outline';
        }
    }

    /**
     * Display the form to add a new element
     * @param part
     */
    function showElementForm(part) {
        activePart = part;
        const modal = document.getElementById('element-modal');
        modal.style.display = 'block';

        // Clear previous form data
        document.getElementById('ele-element-type').value = 'document-outline';
        document.getElementById('ele-element-text').value = '';
        document.getElementById('ele-element-fields').innerHTML = `
            <label for="element-text">Nom de l'élément:</label>
            <input type="text" id="ele-element-text" name="element-text">
        `;

        // Remove previous event listeners
        const addElementButton = document.getElementById('add-element-modal');
        if (!addElementButton) {
            console.error('Bouton "add-element-modal" introuvable.');
            return;
        }
        addElementButton.replaceWith(addElementButton.cloneNode(true));
        document.getElementById('add-element-modal').addEventListener('click', function(event) {
            event.preventDefault(); // Empêche le rechargement de la page

            if (!activePart) {
                console.error('Aucune partie active définie.');
                return;
            }

            // Récupérer les valeurs des champs
            const sectionId = activePart.dataset.sectionId;
            const elementType = document.getElementById('ele-element-type').value;
            const elementText = document.getElementById('ele-element-text').value;
            const elementDescription = document.getElementById('ele-element-description')
                ? document.getElementById('ele-element-description').value
                : '';
            const elementDate = new Date().toLocaleDateString();

            const icon = elementType === 'text' ? 'document-text-outline' :
                elementType === 'file' ? 'document-outline' :
                    'cloud-upload-outline';

            const element = {
                icon: icon,
                text: elementText,
                description: elementDescription,
                date: elementDate,
            };

            saveElementToServer(ueId, sectionId, element);

            addElementToPart();
        });
    }

    /**
     * Add the new element to the active part
     */
    function addElementToPart() {
        if (!activePart) {
            console.error('Aucune partie active définie.');
            return;
        }
    
        const partContent = activePart.querySelector('.part-content');
        if (!partContent) {
            console.error('Impossible de trouver .part-content dans la partie active.');
            return;
        }
    
        const elementType = document.getElementById('ele-element-type').value || 'text'; // Default icon
        const elementText = document.getElementById('ele-element-text').value;
        const elementDescription = document.getElementById('ele-element-description') 
            ? document.getElementById('ele-element-description').value 
            : '';
        const elementDate = new Date().toLocaleDateString();

        // Déterminer l'icône en fonction du type d'élément
        let iconName = '';
        switch (elementType) {
            case 'text':
                iconName = 'document-text-outline';
                break;
            case 'file':
                iconName = 'document-outline';
                break;
            case 'depot':
                iconName = 'cloud-upload-outline';
                break;
            default:
                iconName = 'help-outline'; // Icône par défaut
        }
    
        // Créer le HTML de l'élément
        const elementHtml = `
            <div class="element">
                <div class="element-header">
                    <ion-icon name="${iconName}"></ion-icon>
                    <p>${elementText}</p>
                    <ion-icon name="trash-outline" class="btn-delete-element" title="Supprimer"></ion-icon>
                </div>
                ${elementDescription ? `<p class="element-description">${elementDescription}</p>` : ''}
                <p class="element-date">${elementDate}</p>
            </div>
            <div class="ligne-gris"></div>
        `;
    
        // Ajouter l'élément à la partie active
        partContent.insertAdjacentHTML('beforeend', elementHtml);
    
        // Fermer la modal
        const modal = document.getElementById('element-modal');
        if (modal) {
            console.log('Modal trouvée :', modal);
            modal.style.display = 'none';
        } else {
            console.error('Modal introuvable');
        }
    
        activePart.querySelectorAll('.btn-delete-element').forEach(btn => {
            btn.addEventListener('click', function () {
                deleteElement(btn.parentElement.parentElement);
            });
        });

        // Réinitialiser les champs du formulaire
        document.getElementById('ele-element-text').value = '';
        document.getElementById('ele-element-description').value = '';
    }

    /**
     * Delete an element
     * @param element
     */
    function deleteElement(element) {
        //add pop up to confirm removal
        const confirmDelete = confirm("Voulez-vous vraiment supprimer cet élément ?");
        if (!confirmDelete) return;


        const nextElement = element.nextElementSibling;
        if (nextElement && nextElement.classList.contains('ligne-gris')) {
            nextElement.remove();
        }
        element.remove();
    }

    /**
     * Listener for the element type dropdown
     */
    document.getElementById('part-element-type').addEventListener('change', function() {
        const elementType = this.value;
        const elementFields = document.getElementById('part-element-fields');
        elementFields.innerHTML = '';

        if (elementType === 'text') {
            elementFields.innerHTML = `
                <label for="element-text">Nom de l'élément:</label>
                <input type="text" id="element-text" name="element-text">
                <label for="element-description">Description:</label>
                <textarea id="element-description" name="element-description"></textarea>
            `;
        } else if (elementType === 'file') {
            elementFields.innerHTML = `
                <label for="element-text">Nom de l'élément:</label>
                <input type="text" id="element-text" name="element-text">
                <label for="element-description">Description:</label>
                <textarea id="element-description" name="element-description"></textarea>
                <label for="element-file">Fichier:</label>
                <input type="file" id="element-file" name="element-file">
            `;
        } else if (elementType === 'depot') {
            elementFields.innerHTML = `
                <label for="element-text">Nom de l'élément:</label>
                <input type="text" id="element-text" name="element-text">
                <label for="element-description">Description:</label>
                <textarea id="element-description" name="element-description"></textarea>
            `;
        } else {
            elementFields.innerHTML = `
                <label for="element-text">Nom de l'élément:</label>
                <input type="text" id="element-text" name="element-text">
            `;
        }
    });

    /**
     * Listener for the element type dropdown in the modal
     */
    document.getElementById('ele-element-type').addEventListener('change', function() {
        const elementType = this.value;
        const elementFields = document.getElementById('ele-element-fields');
        elementFields.innerHTML = '';
    
        if (elementType === 'text') {
            elementFields.innerHTML = `
                <label for="ele-element-text">Nom de l'élément:</label>
                <input type="text" id="ele-element-text" name="element-text">
                <label for="ele-element-description">Description:</label>
                <textarea id="ele-element-description" name="element-description"></textarea>
            `;
        } else if (elementType === 'file') {
            elementFields.innerHTML = `
                <label for="ele-element-text">Nom de l'élément:</label>
                <input type="text" id="ele-element-text" name="element-text">
                <label for="ele-element-description">Description:</label>
                <textarea id="ele-element-description" name="element-description"></textarea>
                <label for="element-file">Fichier:</label>
                <input type="file" id="element-file" name="element-file">
            `;
        } else if (elementType === 'depot') {
            elementFields.innerHTML = `
                <label for="ele-element-text">Nom de l'élément:</label>
                <input type="text" id="ele-element-text" name="element-text">
                <label for="ele-element-description">Description:</label>
                <textarea id="ele-element-description" name="element-description"></textarea>
            `;
        } else {
            elementFields.innerHTML = `
                <label for="ele-element-text">Nom de l'élément:</label>
                <input type="text" id="ele-element-text" name="element-text">
            `;
        }
    });

    // Ajouter les événements aux boutons de chaque partie
    document.querySelectorAll('.part-header').forEach(header => {
        header.addEventListener('click', function() {
            togglePartContent(this);
        });
    });

    document.getElementById('cancel-element').addEventListener('click', function () {
        const modal = document.getElementById('element-modal');
        modal.style.display = 'none'; // Ferme la modal des éléments
    });

    document.querySelector('.btn-add-part').addEventListener('click', function() {
        showPartForm();
    });

    window.onclick = function(event) {
        const partModal = document.getElementById('part-modal');
        const elementModal = document.getElementById('element-modal');
        if (event.target === partModal || event.target === elementModal) {
            partModal.style.display = 'none';
            elementModal.style.display = 'none';
        }
    }
});