let isEditing = false;
let activePart = null; // Variable pour stocker la partie active

document.addEventListener('DOMContentLoaded', function() {
    function togglePartContent(header) {
        if (isEditing) return;
        const partContent = header.nextElementSibling;
        const isCollapsed = partContent.style.display === 'none';
        partContent.style.display = isCollapsed ? 'block' : 'none';
        header.classList.toggle('collapsed', !isCollapsed);
    }

    // Créer une nouvelle partie
    function createPart(title, elements) {
        const courseContent = document.querySelector('.course-content');
        if (!courseContent) {
            console.error('Element .course-content introuvable.');
            return;
        }
    
        // Vérifier si une partie avec le même titre existe déjà
        const existingPart = Array.from(courseContent.querySelectorAll('.part h2')).find(
            h2 => h2.innerText === title
        );
        if (existingPart) {
            console.warn(`Une partie avec le titre "${title}" existe déjà.`);
            return;
        }
        
        // Créer la nouvelle partie en html
        const newPart = document.createElement('div');
        newPart.classList.add('part');
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
                    <div class="element">
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
            newPart.remove();
        });
    
        newPart.querySelectorAll('.btn-delete-element').forEach(btn => {
            btn.addEventListener('click', function () {
                deleteElement(btn.parentElement.parentElement);
            });
        });
    
        const addElementButton = newPart.querySelector('.btn-add-element');
        addElementButton.addEventListener('click', function () {
            showElementForm(newPart);
        });
    }

    // Modifier une partie
    function editPart(part, editButton) {
        const header = part.querySelector('.part-header');
        const title = header.querySelector('h2');
        const elements = part.querySelectorAll('.element p');
    
        // Toggle the edit mode
        if (title.isContentEditable) {
            title.contentEditable = 'false';
            elements.forEach(element => element.contentEditable = 'false');
            editButton.name = "create-outline";
            editButton.title = "Modifier";
            title.classList.remove('editable');
            elements.forEach(element => element.classList.remove('editable'));
            isEditing = false;
    
            // Update the date for each element
            part.querySelectorAll('.element').forEach(element => {
                const dateElement = element.querySelector('.element-date');
                if (dateElement) {
                    dateElement.innerText = new Date().toLocaleString();
                }
            });
        } else {
            title.contentEditable = 'true';
            elements.forEach(element => element.contentEditable = 'true');
            editButton.name = "checkmark-outline";
            editButton.title = "Valider";
            title.classList.add('editable');
            elements.forEach(element => element.classList.add('editable'));
            isEditing = true;
        }
    }

    // View the form to add a new part
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
                const elementDate = new Date().toLocaleString();
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
                const elementDate = new Date().toLocaleString();
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
                        <p class="element-date">${new Date().toLocaleString()}</p>
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
    
            // Create the new part
            createPart(title, elements);
            const modal = document.getElementById('part-modal');
            modal.style.display = 'none'; // Close the modal

        });


        // Handle cancel button
        document.getElementById('cancel-part').addEventListener('click', function () {
            modal.style.display = 'none';
        });
    }
    
    // Get the icon name based on the file type
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

    // Display the form to add a new element
    function showElementForm(part) {
        activePart = part;
        console.log('Active part:', activePart);
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
            addElementToPart();
        });
    }

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
        const elementDate = new Date().toLocaleString();

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
        if (event.target == partModal || event.target == elementModal) {
            partModal.style.display = 'none';
            elementModal.style.display = 'none';
        }
    }
});