let isEditing = false;

document.addEventListener('DOMContentLoaded', function() {
    function togglePartContent(header) {
        if (isEditing) return;
        const partContent = header.nextElementSibling;
        const isCollapsed = partContent.style.display === 'none';
        partContent.style.display = isCollapsed ? 'block' : 'none';
        header.classList.toggle('collapsed', !isCollapsed);
    }

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
    
        courseContent.appendChild(newPart);
    
        // Ajout des événements nécessaires
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

    function editPart(part, editButton) {
        const header = part.querySelector('.part-header');
        const title = header.querySelector('h2');
        const elements = part.querySelectorAll('.element p');
    
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

    function showPartForm() {
        const modal = document.getElementById('part-modal');
        modal.style.display = 'block';
    
        // Clear previous form data
        document.getElementById('part-title').value = '';
        document.getElementById('elements-container').innerHTML = '';
        document.getElementById('element-type').value = '';
        document.getElementById('element-fields').innerHTML = '';
    
        // Remove previous event listeners
        const addElementButton = document.getElementById('add-element');
        addElementButton.replaceWith(addElementButton.cloneNode(true));
    
        document.getElementById('add-element').addEventListener('click', function () {
            const elementType = document.getElementById('element-type').value;
            const elementText = document.getElementById('element-text').value;
            let elementHtml = '';
    
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
                const elementFile = document.getElementById('element-file').files[0];
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
    
            document.getElementById('elements-container').insertAdjacentHTML('beforeend', elementHtml);
            document.getElementById('element-text').value = ''; // Clear the input field
    
            const newElement = document.querySelector('#elements-container .element:last-child');
            newElement.querySelector('.btn-delete-element').addEventListener('click', function () {
                deleteElement(newElement);
            });
        });
    
        // Handle form submission
        const partForm = document.getElementById('part-form');
        partForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent page reload
    
            const title = document.getElementById('part-title').value;
            const elements = Array.from(document.querySelectorAll('#elements-container .element')).map(element => ({
                icon: element.querySelector('ion-icon').getAttribute('name'),
                text: element.querySelector('p').innerText,
                description: element.querySelector('.element-description') ? element.querySelector('.element-description').innerText : '',
                date: element.querySelector('.element-date') ? element.querySelector('.element-date').innerText : ''
            }));
    
            createPart(title, elements);
            // Fermer la modale après l'enregistrement
            const modal = document.getElementById('part-modal');
            modal.style.display = 'none'; // Close the modal

        });
    
        document.getElementById('cancel-part').addEventListener('click', function () {
            modal.style.display = 'none';
        });
    }
    
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

    function showElementForm(part) {
        const modal = document.getElementById('element-modal');
        modal.style.display = 'block';

        // Clear previous form data
        document.getElementById('element-type').value = 'document-outline';
        document.getElementById('element-text').value = '';

        // Remove previous event listeners
        const addElementButton = document.getElementById('add-element-modal');
        addElementButton.replaceWith(addElementButton.cloneNode(true));

        document.getElementById('add-element-modal').addEventListener('click', function() {
            const elementType = document.getElementById('element-type').value;
            const elementText = document.getElementById('element-text').value;
            const elementHtml = `
                <div class="element">
                    <ion-icon name="${elementType}"></ion-icon>
                    <p>${elementText}</p>
                    <ion-icon name="trash-outline" class="btn-delete-element" title="Supprimer"></ion-icon>
                </div>
                <div class="ligne-gris"></div>
            `;
            part.querySelector('.part-content').insertAdjacentHTML('beforeend', elementHtml);
            modal.style.display = 'none';

            const newElement = part.querySelector('.part-content .element:last-child');
            newElement.querySelector('.btn-delete-element').addEventListener('click', function() {
                deleteElement(newElement);
            });
        });
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

    document.getElementById('element-type').addEventListener('change', function() {
        const elementType = this.value;
        const elementFields = document.getElementById('element-fields');
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