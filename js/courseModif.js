document.addEventListener('DOMContentLoaded', function() {
    function togglePartContent(header) {
        const partContent = header.nextElementSibling;
        const isCollapsed = partContent.style.display === 'none';
        partContent.style.display = isCollapsed ? 'block' : 'none';
        header.classList.toggle('collapsed', !isCollapsed);
    }

    function createPart(title, elements) {
        const newPart = document.createElement('div');
        newPart.classList.add('part');
        newPart.innerHTML = `
            <div class="part-header collapsed">
                <ion-icon name="chevron-down-outline"></ion-icon>
                <h2 contenteditable="false">${title}</h2>
                <ion-icon name="create-outline" class="btn-edit-part" title="Modifier"></ion-icon>
                <ion-icon name="trash-outline" class="btn-delete-part" title="Supprimer"></ion-icon>
            </div>
            <div class="part-content" style="display: none;">
                ${elements.map(element => `
                    <div class="element">
                        <ion-icon name="${element.icon}"></ion-icon>
                        <p contenteditable="false">${element.text}</p>
                        <ion-icon name="trash-outline" class="btn-delete-element" title="Supprimer"></ion-icon>
                    </div>
                    <div class="ligne-gris"></div>
                `).join('')}
            </div>
        `;
        document.querySelector('.course-content').appendChild(newPart);

        newPart.querySelector('.part-header').addEventListener('click', function() {
            togglePartContent(this);
        });

        newPart.querySelector('.btn-edit-part').addEventListener('click', function() {
            editPart(newPart, this);
            togglePartContent(newPart.querySelector('.part-header'));
        });

        newPart.querySelector('.btn-delete-part').addEventListener('click', function() {
            newPart.remove();
        });

        newPart.querySelectorAll('.btn-delete-element').forEach(btn => {
            btn.addEventListener('click', function() {
                const element = btn.parentElement;
                const nextElement = element.nextElementSibling;
                if (nextElement && nextElement.classList.contains('ligne-gris')) {
                    nextElement.remove();
                }
                element.remove();
            });
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
        } else {
            title.contentEditable = 'true';
            elements.forEach(element => element.contentEditable = 'true');
            editButton.name = "checkmark-outline";
            editButton.title = "Valider";
        }
    }

    function showPartForm() {
        const modal = document.getElementById('part-modal');
        modal.style.display = 'block';

        // Clear previous form data
        document.getElementById('part-title').value = '';
        document.getElementById('elements-container').innerHTML = '';

        // Remove previous event listeners
        const addElementButton = document.getElementById('add-element');
        const newAddElementButton = addElementButton.cloneNode(true);
        addElementButton.parentNode.replaceChild(newAddElementButton, addElementButton);

        newAddElementButton.addEventListener('click', function() {
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
            document.getElementById('elements-container').insertAdjacentHTML('beforeend', elementHtml);
            document.getElementById('element-text').value = ''; // Clear the input field

            const newElement = document.querySelector('#elements-container .element:last-child');
            newElement.querySelector('.btn-delete-element').addEventListener('click', function() {
                const element = newElement;
                const nextElement = element.nextElementSibling;
                if (nextElement && nextElement.classList.contains('ligne-gris')) {
                    nextElement.remove();
                }
                element.remove();
            });
        });

        // Remove previous event listeners for save and cancel buttons
        const savePartButton = document.getElementById('save-part');
        const newSavePartButton = savePartButton.cloneNode(true);
        savePartButton.parentNode.replaceChild(newSavePartButton, savePartButton);

        const cancelPartButton = document.getElementById('cancel-part');
        const newCancelPartButton = cancelPartButton.cloneNode(true);
        cancelPartButton.parentNode.replaceChild(newCancelPartButton, cancelPartButton);

        newSavePartButton.addEventListener('click', function() {
            const title = document.getElementById('part-title').value;
            const elements = Array.from(document.querySelectorAll('.part-form .element')).map(element => ({
                icon: element.querySelector('ion-icon').getAttribute('name'),
                text: element.querySelector('p').innerText
            }));
            createPart(title, elements);
            modal.style.display = 'none';
        });

        newCancelPartButton.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    document.querySelectorAll('.part-header').forEach(header => {
        header.addEventListener('click', function() {
            togglePartContent(this);
        });
    });

    document.querySelector('.btn-add-part').addEventListener('click', function() {
        showPartForm();
    });

    window.onclick = function(event) {
        const modal = document.getElementById('part-modal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});