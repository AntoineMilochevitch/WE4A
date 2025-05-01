let isEditing = false; // Variable pour savoir si on est en mode édition
let activePart = null; // Variable pour stocker la partie active

function updateNotificationCount() {
    const notificationCount = document.querySelector('.notification-count');
    const remainingNotifications = document.querySelectorAll('.notification-item').length;
    if (notificationCount) {
        notificationCount.textContent = remainingNotifications;
    }
}

// Fonction pour recharger les notifications depuis le serveur
function loadNotifications() {
    fetch('/notification/user')
        .then(response => response.json())
        .then(data => {
            const notificationList = document.querySelector('.notification-content');
            if (!notificationList) return;

            // Nettoyer l'ancien contenu
            notificationList.innerHTML = '';

            if (data.notifications.length === 0) {
                notificationList.innerHTML = '<p class="no-notif">Aucune notification</p>';
            } else {
                data.notifications.forEach(notification => {
                    const notificationItem = document.createElement('div');
                    notificationItem.classList.add('notification-item');
                    if (notification.typeNotif) {
                        notificationItem.classList.add(notification.typeNotif.toLowerCase());
                    }
                    if (notification.estVu) {
                        notificationItem.classList.add('read');
                    }
                    notificationItem.innerHTML = `
                        <p>${notification.message}</p>
                        <span class="delete-btn">&times;</span>
                    `;

                    // Attacher l'événement pour supprimer
                    notificationItem.querySelector('.delete-btn').addEventListener('click', function() {
                        notificationItem.remove();
                        updateNotificationCount();
                    });

                    notificationList.appendChild(notificationItem);
                });
            }

            updateNotificationCount();
        })
        .catch(error => console.error('Erreur chargement notifications :', error));
}


document.addEventListener('DOMContentLoaded', function() {

    const courseContent = document.querySelector('.course-content');
    const participantsContent = document.querySelector('.participants-content'); // div pour les participants

    /**
     * Verifie si l'utilisateur a le role admin ou prof
     * @returns boolean
     */
    function hasRole() {
        return userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_PROF');
    }

    /**
     * Active ou désactive les boutons en fonction du rôle de l'utilisateur
     */
    function enableButtonsBasedOnRole() {
        document.querySelectorAll('.btn-edit-part, .btn-delete-part, .btn-add-element, .btn-pin-part, .btn-add-part').forEach(button => {
            if (hasRole()) {
                button.style.display = 'block'; // Affiche le bouton
                button.removeAttribute('disabled');   // Active le bouton
            } else {
                button.style.display = 'none';
            }
        });
    }

    enableButtonsBasedOnRole();
    /**
     * Charge les sections du cours
     * @param ueId
     */
    function loadSections(ueId) {
        console.log("Chargement des sections...");
        fetch(`/api/course/${ueId}/sections`)
            .then(response => response.json())
            .then(data => {
                const courseContent = document.querySelector('.course-content'); // div pour le contenu du cours
                const courseEpingle = document.querySelector('.course-epingle'); // div pour le contenu épinglé

                // Vider les conteneurs
                courseContent.innerHTML = '';
                courseEpingle.innerHTML = '';
                data.forEach(section => {
                    const part = createPart(
                        section.titre,
                        section.elements.map(element => ({
                            id : element.id,
                            icon: element.type === 'text'
                                ? 'document-text-outline'
                                : element.type === 'file'
                                    ? 'document-outline'
                                    : 'cloud-upload-outline',
                            text: element.titre,
                            type: element.type,
                            description: element.description,
                            date: element.date,
                            importance: element.importance,
                        })),
                        section.id

                    );
                    if (section.estEpingle) {
                        courseEpingle.appendChild(part);
                    } else {
                        courseContent.appendChild(part);
                    }
                });

                updateCourseEpingleVisibility(); // Mettre à jour la visibilité de la section épinglée
                if (hasRole()) {
                    // Activer le drag and drop pour changer l'ordre
                    enableDragAndDrop('.course-content', ueId);
                    enableDragAndDrop('.course-epingle', ueId);
                }

            })
            .catch(error => console.error('Erreur lors du chargement des sections :', error));
    }

    loadSections(ueId);

    /**
     * Met à jour la visibilité de la section épinglée
     */
    function updateCourseEpingleVisibility() {
        const courseEpingle = document.querySelector('.course-epingle'); // div pour le contenu épinglé
        if (courseEpingle.children.length === 0) {
            courseEpingle.style.display = 'none'; // Masquer la section épinglée si elle est vide
        } else {
            courseEpingle.style.display = 'block'; // Afficher la section épinglée si elle n'est pas vide
        }
    }

    /**
     * Active le drag and drop pour réorganiser les sections
     * @param containerSelector
     * @param ueId
     */
    function enableDragAndDrop(containerSelector, ueId) {
        const container = document.querySelector(containerSelector);

        Sortable.create(container, {
            animation: 150,
            handle: '.part-header', // Drag via header
            scroll: true,
            scrollSensitivity: 100, // Sensibilité de défilement
            scrollSpeed: 15, // Vitesse de défilement
            onEnd: function () {
                const parts = container.querySelectorAll('.part'); // Sélectionner toutes les parties
                const updates = [];

                parts.forEach((part, index) => {
                    const sectionId = part.getAttribute('data-section-id'); // Récupérer l'ID de la section
                    updates.push({ id: sectionId, ordre: index + 1 }); // Ajouter à la liste des mises à jour
                });

                // Envoyer les nouveaux ordres a la bdd
                fetch(`/api/course/${ueId}/update_section_order`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ sections: updates })
                })
                    .then(res => res.json())
                    .then(data => console.log("Ordre mis à jour :", data))
                    .catch(err => console.error("Erreur de mise à jour de l'ordre :", err));
            }
        });


    }


    /**
     * Charger les participants
     * @param ueId
     */
    function loadParticipants(ueId) {
        fetch(`/api/course/${ueId}/users`)
            .then(response => response.json())
            .then(data => {
                const professorsContainer = participantsContent.querySelector('.professors .part-content'); // div pour les professeurs
                const studentsContainer = participantsContent.querySelector('.students .part-content'); // div pour les étudiants

                // Vider les conteneurs
                professorsContainer.innerHTML = '';
                studentsContainer.innerHTML = '';

                // Parcourir les utilisateurs et les ajouter dans les conteneurs correspondants
                data.forEach(user => {
                    const randomNumber = Math.floor(Math.random() * 7) + 1;
                    const participantHtml = `
                        <div class="participant">
                            <img src="/images/${user.avatar ? user.avatar : `profil_pic${randomNumber}.jpg`}" alt="Photo de profil" class="profile-pic">
                            <span class="participant-name">${user.nom}</span>
                            <span class="participant-firstname">${user.prenom}</span>
                            <a href="mailto:${user.email}" class="participant-email">${user.email}</a>
                        </div>
                        <div class="ligne-gris"></div>
                    `;

                    // Ajouter l'utilisateur dans le conteneur approprié
                    if (user.role.includes('ROLE_PROF')) {
                        professorsContainer.insertAdjacentHTML('beforeend', participantHtml);
                    } else if (user.role.includes('ROLE_USER')) {
                        studentsContainer.insertAdjacentHTML('beforeend', participantHtml);
                    }
                });
            })
            .catch(error => console.error('Erreur lors du chargement des participants :', error));
    }

    // Ajouter un événement pour charger les participants
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
     * Basculer l'affichage du contenu de la partie
     * @param header
     */
    function togglePartContent(header) {
        if (isEditing) return;
        const partContent = header.nextElementSibling;
        const isCollapsed = partContent.style.display === 'none';
        partContent.style.display = isCollapsed ? 'block' : 'none';
        header.classList.toggle('collapsed', !isCollapsed);
    }


    function sendNotification(ueId, message, type = 'low') {
        return fetch('/notification/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ueId: ueId,
                message: message,
                type: type
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Notification envoyée avec succès.');

                    // Rafraîchir les notifications du panneau
                    if (typeof loadNotifications === 'function') {
                        loadNotifications();
                    } else {
                        console.error('La fonction loadNotifications n\'existe pas.');
                    }

                } else {
                    console.error('Erreur serveur notification :', data.error);
                }
                return data;
            })
            .catch(error => {
                console.error('Erreur réseau notification :', error);
                throw error;
            });
    }


    /**
     * Enregistre une section sur le serveur
     * @param ueId
     * @param title
     * @param elements
     * @returns {Promise<Response>}
     */
    function saveSectionToServer(ueId, title, elements) {
        console.log("Elements file :", elements);

        const body = {
            titre: title,
            // map pour transformer les éléments : async car on doit attendre le fichier
            elements: elements.map(async (element) => {
                let fichierBase64 = null;
                let fileName = null;

                // Vérifiez si un fichier est présent
                if (element.file) {
                    console.log("Fichier sélectionné :", element.file);
                    fichierBase64 = await convertFileToBase64(element.file);
                    fileName = element.file.name;
                }

                return {
                    titre: element.text,
                    type: element.type,
                    description: element.description,
                    fichier: fichierBase64,
                    importance: element.importance || null,
                    fileName: fileName || null,
                };
            }),
        };

        // Utiliser Promise.all pour attendre la résolution de tous les fichiers
        return Promise.all(body.elements).then((resolvedElements) => {
            body.elements = resolvedElements;
            // Envoyer la requête au serveur
            return fetch(`/api/course/${ueId}/add_section`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Erreur lors de la requête : ' + response.statusText);
                    }
                    return response.json();
                })
                .then((sectionResponse) => {
                    if (sectionResponse.id) {
                        // Choisir la plus haute importance
                        const importances = elements.map(e => e.importance || 'low');
                        let finalImportance = 'low';
                        if (importances.includes('hard')) {
                            finalImportance = 'hard';
                        } else if (importances.includes('medium')) {
                            finalImportance = 'medium';
                        }
                        // Envoyer la notification
                        sendNotification(ueId, `Nouvelle partie ajoutée : ${title}`, finalImportance);
                    } else {
                        console.error('Erreur serveur création section :', sectionResponse.error);
                    }
                    return sectionResponse;
                });

        });
    }


    /**
     * Enregistre un élément sur le serveur
     * @param ueId
     * @param sectionId
     * @param element
     */
    function saveElementToServer(ueId, sectionId, element) {
        let files;
        if (element.type === 'file') {
            files = element.fileInput.files;
        } else {
            files = null;
        }

        let fichierBase64 = null;
        let fileName = null;

        if (files && files.length > 0) {
            const file = files[0];
            console.log("Fichier sélectionné :", file);
            fichierBase64 = convertFileToBase64(file);
            fileName = file.name;
        }

        // Enregistrer l'élément sur le serveur
        const saveElement = (body) => {
            return fetch(`/api/course/${ueId}/add_element`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...body, sectionId }),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Élément enregistré avec succès :', data);
                })
                .catch((error) => {
                    console.error('Erreur lors de l\'enregistrement de l\'élément :', error);
                });
        };

        // Vérifier si un fichier est présent
        if (fichierBase64) {
            fichierBase64.then((base64) => {
                const body = {
                    titre: element.text,
                    type: element.type,
                    description: element.description || null,
                    fichier: base64,
                    importance: element.importance || null,
                    fileName: fileName,
                };

                saveElement(body).then(() => {
                    loadSections(ueId); // Charger les sections après l'enregistrement
                });
            });
        } else {
            const body = {
                titre: element.text,
                type: element.type,
                description: element.description || null,
                fichier: null,
                importance: element.importance || null,
            };

            saveElement(body).then(() => {
                loadSections(ueId); // Charger les sections après l'enregistrement
            });
        }

        const modal = document.getElementById('element-modal');
        // Fermer la modal
        if (modal) {
            modal.style.display = 'none';
        } else {
            console.error('Modal introuvable');
        }
    }

    /**
     * Convertit un fichier en base64 pour l'envoi
     * @param file
     * @returns {Promise<unknown>}
     */
    function convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]); // Supprime le préfixe "data:..."
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    }

    /**
     * Créer une partie dans le contenu du cours
     * @param title
     * @param elements
     * @param sectionId
     */
    function createPart(title, elements, sectionId) {
        const courseContent = document.querySelector('.course-content'); // div pour le contenu du cours
        if (!courseContent) {
            console.error('Element .course-content introuvable.');
            return;
        }

        // Créer la nouvelle partie en HTML
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
            <ion-icon name="bookmark-outline" class="btn-pin-part" title="Épingler"></ion-icon>
        </div>
        <div class="part-content" style="display: none;">
            ${elements.map(element => {
                
                // Déterminer la classe CSS en fonction de l'importance
                let importanceClass = '';
                if (element.importance === 'low') {
                    importanceClass = 'icon-importance-low';
                } else if (element.importance === 'medium') {
                    importanceClass = 'icon-importance-medium';
                } else if (element.importance === 'high') {
                    importanceClass = 'icon-importance-high';
                }

                // Ajouter un bouton "Télécharger" si le type est "file"
                const downloadButton = element.type === 'file'
                    ? `<ion-icon name="download-outline" class="btn-download-element" title="Télécharger"></ion-icon>`
                    : '';
                
                return `
                    <div class="element" data-element-id="${element.id}">
                        <div class="element-header" data-importance="${element.importance}">
                            <ion-icon name="${element.icon}" class="${importanceClass}"></ion-icon>
                            <p contenteditable="false">${element.text}</p>
                            ${element.type === 'text' ? `
                                <select class="importance-select" disabled>
                                    <option value="low" ${element.importance === 'low' ? 'selected' : ''}>Faible</option>
                                    <option value="medium" ${element.importance === 'medium' ? 'selected' : ''}>Moyenne</option>
                                    <option value="high" ${element.importance === 'high' ? 'selected' : ''}>Élevée</option>
                                </select>
                            ` : ''}
                            ${element.type === 'file' ? `
                                <input type="file" class="file-input">
                            ` : ''} 
                            ${downloadButton}                      
                            ${hasRole() ? `
                                <ion-icon name="trash-outline" class="btn-delete-element" title="Supprimer"></ion-icon>
                            ` : ''}
                        </div>
                        ${element.description ? `<p class="element-description">${element.description}</p>` : ''}
                        ${element.date ? `<p class="element-date">${element.date}</p>` : ''}
                    </div>
                    <div class="ligne-gris"></div>
                `;
        }).join('')}

        </div>
    `;

        // Ajouter la nouvelle partie à la fin du contenu du cours
        courseContent.appendChild(newPart);

        // Ajouter les événements aux boutons de la nouvelle partie
        const partHeader = newPart.querySelector('.part-header');
        partHeader.addEventListener('click', function () {
            togglePartContent(this);
        });

        // Ajouter l'événement pour le bouton de sauvegarde
        const editButton = newPart.querySelector('.btn-edit-part');
        editButton.addEventListener('click', function () {
            editPart(newPart, this);
            togglePartContent(newPart.querySelector('.part-header'));
        });

        // Ajouter les événements aux boutons de téléchargement
        newPart.querySelectorAll('.btn-download-element').forEach(btn => {
            btn.addEventListener('click', function () {
                const element = btn.parentElement.parentElement;
                const elementId = element.dataset.elementId;

                if (!elementId) {
                    console.error("ID de l'élément introuvable.");
                    return;
                }

                // Envoyer une requête GET pour télécharger le fichier
                fetch(`/api/course/${ueId}/download_file/${elementId}`, {
                    method: 'GET',
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Erreur lors du téléchargement du fichier.");
                        }
                        const fileName = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || `fichier_element_${elementId}`;
                        return response.blob().then(blob => ({ blob, fileName }));
                    })
                    .then(({ blob, fileName }) => {
                        // Créer un lien pour télécharger le fichier
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileName; // Utilise le nom de base du fichier
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    })
                    .catch(error => console.error("Erreur réseau :", error));
            });
        });


        // Ajouter l'événement pour le bouton de suppression
        const deleteButton = newPart.querySelector('.btn-delete-part');
        deleteButton.addEventListener('click', function () {
            const confirmDelete = confirm("Voulez-vous vraiment supprimer cette partie ?"); // demande de confirmation
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

                const confirmDelete = confirm("Voulez-vous vraiment supprimer cet élément ?"); // demande de confirmation
                if (!confirmDelete) return;

                // Supprimer l'élément du serveur
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

        const courseEpingle = document.querySelector('.course-epingle');
        const pinButton = newPart.querySelector('.btn-pin-part'); // Sélectionner le bouton d'épinglage

        // Ajouter l'événement pour le bouton d'épinglage
        pinButton.addEventListener('click', function (e) {
            e.stopPropagation();
            const part = this.closest('.part'); // Sélectionner la partie parente
            const sectionId = part.dataset.sectionId; // Récupérer l'ID de la section
            const isPinned = part.classList.contains('epingle'); // Vérifier si la section est déjà épinglée

            // Appel AJAX pour épingler/désépingler
            fetch(`/api/course/${ueId}/pin_section/${sectionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estEpingle: !isPinned }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        if (isPinned) {
                            // Si désépinglé, déplacer dans course-content
                            part.classList.remove('epingle');
                            document.querySelector('.course-content').appendChild(part);
                        } else {
                            // Si épinglé, déplacer dans course-epingle
                            part.classList.add('epingle');
                            document.querySelector('.course-epingle').appendChild(part);
                        }
                        // Mettre à jour la visibilité de la section épinglée
                        updateCourseEpingleVisibility();
                    } else {
                        console.error('Erreur lors de la mise à jour de l\'épinglage.');
                    }
                })
                .catch(error => console.error('Erreur réseau :', error));
        });

        // Ajouter l'événement pour le bouton d'ajout d'élément
        const addElementButton = newPart.querySelector('.btn-add-element');
        addElementButton.addEventListener('click', function () {
            showElementForm(newPart); // Afficher le formulaire d'ajout d'élément
        });
        enableButtonsBasedOnRole(); // Réactiver les boutons en fonction du rôle de l'utilisateur
        return newPart;
    }


    /**
     * Enregistre les modifications de la section
     * @param part
     */
    function saveChanges(part) {
        const sectionId = part.dataset.sectionId; // Récupérer l'ID de la section
        const title = part.querySelector('.part-header h2').innerText;
        // Récupérer tous les éléments de la section
        const elements = Array.from(part.querySelectorAll('.element')).map(element => {
            const textElement = element.querySelector('.element-header p');
            const importanceSelect = element.querySelector('.importance-select');
            const fileInput = element.querySelector('.file-input');

            let fichierBase64 = null;
            let fileName = null;

            if (fileInput && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                fichierBase64 = convertFileToBase64(file); // Convertir le fichier en base64
                fileName = file.name;
            }

            return {
                id: element.dataset.elementId,
                titre: textElement.innerText,
                description: element.querySelector('.element-description')?.innerText || '',
                date: element.querySelector('.element-date')?.innerText || '',
                importance: importanceSelect ? importanceSelect.value : null,
                fichier: fichierBase64,
                fileName: fileName,
            };
        });

        // Utiliser Promise.all pour attendre la résolution de tous les fichiers
        Promise.all(elements.map(e => e.fichier)).then(resolvedFiles => {
            resolvedFiles.forEach((file, index) => {
                elements[index].fichier = file;
            });

            fetch(`/api/course/${ueId}/update_section/${sectionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ titre: title, elements }),
            })
                .then(response => response.json())
                .then(data => console.log("Section mise à jour :", data))
                .catch(error => console.error("Erreur réseau :", error));
        });
    }

    /**
     * Editer une partie
     * @param part
     * @param editButton
     */
    function editPart(part, editButton) {
        const header = part.querySelector('.part-header'); // Sélectionner l'en-tête de la partie
        const title = header.querySelector('h2'); // Sélectionner le titre
        const elements = part.querySelectorAll('.element'); // Sélectionner tous les éléments de la partie

        if (title.isContentEditable) {
            // Désactiver le mode édition
            saveChanges(part);
            title.contentEditable = 'false';
            // Récupérer tous les éléments de la section
            elements.forEach(element => {
                const textElement = element.querySelector('.element-header p');
                const descriptionElement = element.querySelector('.element-description');
                const importanceSelect = element.querySelector('.importance-select');
                if (importanceSelect) {
                    importanceSelect.style.display = 'none';
                    importanceSelect.disabled = true;
                }
                const fileInput = element.querySelector('.file-input');
                const fileInputLabel = element.querySelector('.file-input-label');

                // Désactiver le mode édition pour chaque texte
                if (textElement) {
                    textElement.contentEditable = 'false';
                    textElement.classList.remove('editable');
                }
                // Désactiver le mode édition pour la description
                if (descriptionElement) {
                    descriptionElement.contentEditable = 'false';
                    descriptionElement.classList.remove('editable');
                }
                // Désactiver le mode édition pour le select
                if (importanceSelect) importanceSelect.style.display = 'none';
                // Désactiver le mode édition pour le file input
                if (fileInput) fileInput.style.display = 'none';
                if (fileInputLabel) fileInputLabel.style.display = 'none';
            });
            // Changer l'icône du bouton
            editButton.name = "create-outline";
            editButton.title = "Modifier";
            title.classList.remove('editable');
            isEditing = false;
        } else {
            // Activer le mode édition
            title.contentEditable = 'true';
            elements.forEach(element => {
                const textElement = element.querySelector('.element-header p');
                const descriptionElement = element.querySelector('.element-description');
                const importanceSelect = element.querySelector('.importance-select');
                if (importanceSelect) {
                    importanceSelect.style.display = 'block'; // Passer en display block
                    importanceSelect.disabled = false; // Activer le menu
                }
                // Ajouter un événement pour changer l'importance
                document.querySelectorAll('.importance-select').forEach(select => {
                    select.addEventListener('change', function () {
                        const elementHeader = this.closest('.element-header');
                        const icon = elementHeader.querySelector('ion-icon');

                        icon.classList.remove('icon-importance-low', 'icon-importance-medium', 'icon-importance-high');

                        if (this.value === 'low') {
                            icon.classList.add('icon-importance-low');
                        } else if (this.value === 'medium') {
                            icon.classList.add('icon-importance-medium');
                        } else if (this.value === 'high') {
                            icon.classList.add('icon-importance-high');
                        }
                    });
                });
                const fileInput = element.querySelector('.file-input');
                const fileInputLabel = element.querySelector('.file-input-label');

                // Activer le mode édition pour chaque texte
                if (textElement) {
                    textElement.contentEditable = 'true';
                    textElement.classList.add('editable');
                }
                // Activer le mode édition pour la description
                if (descriptionElement) {
                    descriptionElement.contentEditable = 'true';
                    descriptionElement.classList.add('editable');
                }

                // Activer le mode édition pour le fichier
                if (fileInput) fileInput.style.display = 'inline-block';
                if (fileInputLabel) fileInputLabel.style.display = 'inline-block';
            });
            // Changer l'icône du bouton
            editButton.name = "checkmark-outline";
            editButton.title = "Valider";
            title.classList.add('editable');
            isEditing = true;
        }
    }

    document.querySelectorAll('.importance-select').forEach(select => {
        select.addEventListener('click', function(event) {
            event.stopPropagation(); // Empêche la propagation du clic vers les éléments parents
        });
    });

    /**
     * Afficher le formulaire pour ajouter une nouvelle partie
     */
    function showPartForm() {
        const modal = document.getElementById('part-modal');
        modal.style.display = 'block';

        // Réinitialiser les données de la modal
        document.getElementById('part-title').value = '';
        document.getElementById('part-elements-container').innerHTML = '';
        document.getElementById('part-element-type').value = '';
        document.getElementById('part-element-fields').innerHTML = '';

        let elements = []; // Réinitialiser le tableau des éléments

        // Remplacer le formulaire
        const partForm = document.getElementById('part-form');
        const clonedForm = partForm.cloneNode(true);
        partForm.replaceWith(clonedForm);

        // Réattacher le gestionnaire d'événement pour le dropdown
        const partElementType = document.getElementById('part-element-type');
        partElementType.addEventListener('change', function () {
            const elementType = this.value;
            const elementFields = document.getElementById('part-element-fields');
            elementFields.innerHTML = '';

            if (elementType === 'text') {
                elementFields.innerHTML = `
                <label for="element-text">Nom de l'élément:</label>
                <input type="text" id="element-text" name="element-text">
                <label for="element-description">Description:</label>
                <textarea id="element-description" name="element-description"></textarea>
                <label for="element-importance">Importance:</label>
                <select id="element-importance" name="element-importance">
                    <option value="" disabled selected>Choisir une importance</option>
                    <option value="low">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Élevée</option>
                </select>
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

        // Ajouter un gestionnaire pour le bouton "Ajouter un élément"
        document.getElementById('part-add-element').addEventListener('click', function () {
            // Récupérer les valeurs des champs
            const elementType = document.getElementById('part-element-type').value;
            const elementText = document.getElementById('element-text').value;
            const elementDescription = document.getElementById('element-description').value;
            const elementDate = new Date().toLocaleDateString();
            const elementImportanceField = document.getElementById('element-importance');
            const elementImportance = elementImportanceField ? elementImportanceField.value : null;
            const elementFileField = document.getElementById('element-file');
            const elementFile = elementFileField ? elementFileField.files[0] : null;

            const newElement = {
                text: elementText,
                type: elementType,
                description: elementDescription,
                importance: elementImportance,
                file: elementFile,
                date: elementDate,
            };

            const elementHtml = `
            <div class="element">
                <div class="element-header">
                    <ion-icon name="${elementType === 'text' ? 'document-text-outline' : elementType === 'depot' ? 'cloud-upload-outline' : 'document-outline'}"></ion-icon>
                    <p>${elementText}</p>
                    ${elementDescription ? `<p class="element-description">${elementDescription}</p>` : ''}
                </div>
            </div>
        `;

            // Ajouter l'élément au conteneur
            document.getElementById('part-elements-container').insertAdjacentHTML('beforeend', elementHtml);

            elements.push(newElement);

            // Réinitialiser les champs du formulaire
            document.getElementById('element-text').value = '';
            if (elementDescription) document.getElementById('element-description').value = '';
            if (elementImportanceField) elementImportanceField.value = '';
            if (elementFileField) elementFileField.value = '';
        });

        // Gestion de la soumission du formulaire
        document.getElementById('part-form').addEventListener('submit', function (event) {
            event.preventDefault();

            const title = document.getElementById('part-title').value;

            // Envoyer la requête pour créer la section
            saveSectionToServer(ueId, title, elements)
                .then((response) => {
                    if (response.id) {
                        createPart(title, elements, response.id); // Créer la partie dans le DOM
                        loadSections(ueId); // Recharger les sections
                        elements = []; // Réinitialiser le tableau des éléments
                    } else {
                        console.error('Erreur lors de la création de la section :', response.error);
                    }
                })
                .catch((error) => console.error('Erreur réseau :', error));

            modal.style.display = 'none';
        });

        document.getElementById('cancel-part').addEventListener('click', function () {
            modal.style.display = 'none';
        });
    }

    /**
     * Afficher le formulaire pour ajouter un élément
     * @param part
     */
    function showElementForm(part) {
        activePart = part;
        const modal = document.getElementById('element-modal');
        modal.style.display = 'block';

        // supprimer les champs de la modal
        document.getElementById('ele-element-type').value = 'document-outline';
        document.getElementById('ele-element-text').value = '';
        document.getElementById('ele-element-fields').innerHTML = `
            <label for="element-text">Nom de l'élément:</label>
            <input type="text" id="ele-element-text" name="element-text">
        `;

        // supprimer le listener d'événement précédent
        const addElementButton = document.getElementById('add-element-modal');
        if (!addElementButton) {
            console.error('Bouton "add-element-modal" introuvable.');
            return;
        }
        addElementButton.replaceWith(addElementButton.cloneNode(true));
        // ajouter un nouvel événement
        document.getElementById('add-element-modal').addEventListener('click', function(event) {
            event.preventDefault(); // Empêche le rechargement de la page

            if (!activePart) {
                console.error('Aucune partie active définie.');
                return;
            }

            // Récupérer les valeurs des champs
            const sectionId = activePart.dataset.sectionId;
            const elementType = document.getElementById('ele-element-type').value || 'text';
            const elementText = document.getElementById('ele-element-text').value;
            const elementDescription = document.getElementById('ele-element-description')
                ? document.getElementById('ele-element-description').value
                : '';
            const elementDate = new Date().toLocaleDateString();
            const fileInput = elementType === 'file' ? document.getElementById('ele-element-file') : null;
            const elementImportanceField = document.getElementById('ele-element-importance');
            const elementImportance = elementImportanceField ? elementImportanceField.value : null;


            const icon = elementType === 'text' ? 'document-text-outline' :
                elementType === 'file' ? 'document-outline' :
                    elementType === 'depot' ? 'cloud-upload-outline' :
                        'help-outline'; // Icône par défaut si le type est inconnu

            const element = {
                icon: icon,
                text: elementText,
                type: elementType,
                description: elementDescription,
                date: elementDate,
                fileInput: fileInput,
                importance:elementImportance,
            };

            saveElementToServer(ueId, sectionId, element);
        });
    }



    /**
     * Listenner pour le changement de type d'élément
     */
    document.getElementById('ele-element-type').addEventListener('change', function() {
        const elementType = this.value;
        const elementFields = document.getElementById('ele-element-fields');
        elementFields.innerHTML = '';

        // Afficher les champs en fonction du type d'élément sélectionné
        if (elementType === 'text') {
            elementFields.innerHTML = `
                <label for="ele-element-text">Nom de l'élément:</label>
                <input type="text" id="ele-element-text" name="element-text">
                <label for="ele-element-description">Description:</label>
                <textarea id="ele-element-description" name="element-description"></textarea>
                <label for="ele-element-importance">Importance:</label>
                <select id="ele-element-importance" name="element-importance">
                    <option value="" disabled selected>Choisir une importance</option>
                    <option value="low">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Élevée</option>
                </select>
            `;
        } else if (elementType === 'file') {
            elementFields.innerHTML = `
                <label for="ele-element-text">Nom de l'élément:</label>
                <input type="text" id="ele-element-text" name="element-text">
                <label for="ele-element-description">Description:</label>
                <textarea id="ele-element-description" name="element-description"></textarea>
                <label for="ele-element-file">Fichier:</label>
                <input type="file" id="ele-element-file" name="element-file">
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

    // Ajouter les événements aux boutons de cancel de chaque partie
    document.getElementById('cancel-element').addEventListener('click', function () {
        const modal = document.getElementById('element-modal');
        modal.style.display = 'none'; // Ferme la modal des éléments
    });

    // Ajouter les événements aux boutons d'ajout de chaque partie
    document.querySelector('.btn-add-part').addEventListener('click', function() {
        showPartForm();
    });

    // Fermer la modal si l'utilisateur clique en dehors de celle-ci
    window.onclick = function(event) {
        const partModal = document.getElementById('part-modal');
        const elementModal = document.getElementById('element-modal');
        if (event.target === partModal || event.target === elementModal) {
            partModal.style.display = 'none';
            elementModal.style.display = 'none';
        }
    }

});