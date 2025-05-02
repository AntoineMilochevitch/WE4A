document.addEventListener('DOMContentLoaded', function() {
    // === GESTION DU PANNEAU DE NOTIFICATIONS ===

    // Sélection des éléments clés du DOM
    const notificationIcon = document.querySelector('.user ul li a[href="#"] ion-icon[name="notifications-outline"]');
    const notificationPanel = document.getElementById('notificationPanel');
    const closeNotificationPanel = document.getElementById('closeNotificationPanel');
    const notificationCount = document.querySelector('.notification-count');

    /**
     * Ouvre ou ferme le panneau des notifications au clic sur l'icône
     */
    notificationIcon.addEventListener('click', function() {
        notificationPanel.classList.toggle('open');
    });

    /**
     * Ferme le panneau des notifications au clic sur la croix (bouton fermer)
     */
    closeNotificationPanel.addEventListener('click', function() {
        notificationPanel.classList.remove('open');
    });

    // === GESTION DE LA SUPPRESSION DES NOTIFICATIONS ===

    // Ajoute un écouteur sur chaque bouton de suppression
    document.querySelectorAll('.notification-item .delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Supprime visuellement l'élément de notification
            const notificationItem = btn.parentElement;
            notificationItem.remove();
            // Met à jour le compteur après suppression
            updateNotificationCount();
        });
    });

    /**
     * Met à jour le compteur affichant le nombre de notifications restantes
     */
    function updateNotificationCount() {
        const remainingNotifications = document.querySelectorAll('.notification-item').length;
        notificationCount.textContent = remainingNotifications;
    }

    // Initialisation du compteur de notifications au chargement
    updateNotificationCount();
});
