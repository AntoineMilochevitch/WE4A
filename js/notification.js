document.addEventListener('DOMContentLoaded', function() {
    // Gestion de l'ouverture et de la fermeture du panneau de notifications
    const notificationIcon = document.querySelector('.user ul li a[href="#"] ion-icon[name="notifications-outline"]');
    const notificationPanel = document.getElementById('notificationPanel');
    const closeNotificationPanel = document.getElementById('closeNotificationPanel');
    const notificationCount = document.querySelector('.notification-count');
    
    notificationIcon.addEventListener('click', function() {
        notificationPanel.classList.toggle('open');
    });

    closeNotificationPanel.addEventListener('click', function() {
        notificationPanel.classList.remove('open');
    });

    // Gestion de la suppression des notifications
    document.querySelectorAll('.notification-item .delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const notificationItem = btn.parentElement;
            notificationItem.remove();
            updateNotificationCount();
        });
    });

    // Fonction pour mettre à jour le nombre de notifications
    function updateNotificationCount() {
        const remainingNotifications = document.querySelectorAll('.notification-item').length;
        notificationCount.textContent = remainingNotifications;
    }

    // Initialisation du nombre de notifications
    updateNotificationCount();
});