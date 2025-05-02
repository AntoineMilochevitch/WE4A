document.addEventListener("DOMContentLoaded", function () {

  // === GESTION DES CARTES COURS ===

  const scrollContainer = document.getElementById("scrollContainer");
  const progressBar = document.getElementById("progressBar");
  const leftBtn = document.getElementById("arrowLeft");
  const rightBtn = document.getElementById("arrowRight");

  let currentIndex = 0;

  // Récupérer la liste des cours via l'API
  fetch('/api/my-courses')
      .then(response => response.json())
      .then(data => {
        scrollContainer.innerHTML = '';

        // Créer dynamiquement les cartes cours (max 6 affichées)
        data.slice(0, 6).forEach(course => {
          const link = document.createElement('a');
          link.href = '/course/' + course.code;
          link.innerHTML = `
          <div class="card">
            <img src="/images/${course.image ? course.image : 'course_image.png'}" alt="Course Image" class="card__image">
            <div class="card__content">
              <p class="card__title">${course.nom}</p>
              <p class="card__description">${course.description}</p>
            </div>
          </div>
        `;
          scrollContainer.appendChild(link);
        });

        const cards = scrollContainer.querySelectorAll(".card");

        /**
         * Fonction pour défiler jusqu'à la carte à l'index donné
         * @param {number} index
         */
        function scrollToCard(index) {
          if (index < 0 || index >= cards.length) return;
          currentIndex = index;
          const card = cards[currentIndex];
          scrollContainer.scrollTo({
            left: card.offsetLeft,
            behavior: "smooth"
          });
          updateProgressBar();
        }

        /**
         * Met à jour la barre de progression en fonction de la carte active
         */
        function updateProgressBar() {
          if (progressBar && cards.length > 0) {
            const progress = ((currentIndex + 1) / cards.length) * 100;
            progressBar.style.width = progress + "%";
          }
        }

        // Gestion des événements des flèches de navigation
        if (leftBtn && rightBtn && scrollContainer && cards.length > 0) {
          leftBtn.addEventListener("click", () => scrollToCard(currentIndex - 1));
          rightBtn.addEventListener("click", () => scrollToCard(currentIndex + 1));
          scrollContainer.addEventListener("mouseleave", () => scrollToCard(0));
          updateProgressBar();
        }
      })
      .catch(error => console.error('Erreur chargement des cours :', error));


  // === GESTION DES MENUS INFO (notifications) ===

  const menuDots = document.querySelectorAll('.menu-dots');

  menuDots.forEach(dot => {
    const popup = dot.nextElementSibling;

    // Affiche ou masque le menu contextuel au clic sur les 3 points
    dot.addEventListener('click', function (event) {
      event.stopPropagation();
      event.preventDefault();

      // Fermer tous les autres menus avant d'ouvrir celui-ci
      document.querySelectorAll('.menu-popup').forEach(otherPopup => {
        if (otherPopup !== popup) {
          otherPopup.style.display = 'none';
        }
      });

      // Bascule l'affichage du menu
      if (popup) {
        popup.style.display = (popup.style.display === 'block') ? 'none' : 'block';
      }
    });

    const markAsReadBtn = popup?.querySelector('.mark-read-btn');
    const deleteBtn = popup?.querySelector('.delete-btn');

    // Action : marquer la notification comme lue
    markAsReadBtn?.addEventListener('click', function (e) {
      e.stopPropagation();
      const notifId = this.dataset.id;

      fetch(`/notification/mark-as-read/${notifId}`, {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
          .then(response => response.json())
          .then(data => {
            if (data.status === 'success') {
              // Marquer visuellement la notification comme lue
              const infoItem = dot.closest('.info-item');
              if (infoItem) infoItem.classList.add('read');
              // Retirer le bouton "Marquer comme lu"
              this.remove();
            } else {
              alert('Erreur lors du marquage comme lu.');
            }
          })
          .catch(error => {
            console.error('Erreur requête marquage comme lu :', error);
          });

      if (popup) popup.style.display = 'none';
    });

    // Action : supprimer la notification (visuellement)
    deleteBtn?.addEventListener('click', function (e) {
      e.stopPropagation();
      const infoItem = dot.closest('.info-item');
      if (infoItem) infoItem.remove();
      if (popup) popup.style.display = 'none';
    });
  });

  // Fermer tous les menus si clic en dehors
  document.addEventListener('click', () => {
    document.querySelectorAll('.menu-popup').forEach(popup => {
      popup.style.display = 'none';
    });
  });
});
