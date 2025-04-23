document.addEventListener("DOMContentLoaded", function () {

  // === GESTION DES CARTES COURS ===

  const scrollContainer = document.getElementById("scrollContainer");
  const progressBar = document.getElementById("progressBar");
  const leftBtn = document.getElementById("arrowLeft");
  const rightBtn = document.getElementById("arrowRight");

  let currentIndex = 0;

  fetch('/api/my-courses')
      .then(response => response.json())
      .then(data => {
        scrollContainer.innerHTML = '';
        data.slice(0, 6).forEach(course => {
          const link = document.createElement('a');
          link.href = '/course/' + course.code;
          link.innerHTML = `
          <div class="card">
            <img src="/images/${course.image}" alt="Course Image" class="card__image">
            <div class="card__content">
              <p class="card__title">${course.nom}</p>
              <p class="card__description">${course.description}</p>
            </div>
          </div>
        `;
          scrollContainer.appendChild(link);
        });

        const cards = scrollContainer.querySelectorAll(".card");

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

        function updateProgressBar() {
          if (progressBar && cards.length > 0) {
            const progress = ((currentIndex + 1) / cards.length) * 100;
            progressBar.style.width = progress + "%";
          }
        }

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

    dot.addEventListener('click', function (event) {
      event.stopPropagation();
      event.preventDefault();

      document.querySelectorAll('.menu-popup').forEach(otherPopup => {
        if (otherPopup !== popup) {
          otherPopup.style.display = 'none';
        }
      });

      if (popup) {
        popup.style.display = (popup.style.display === 'block') ? 'none' : 'block';
      }
    });

    const markAsReadBtn = popup?.querySelector('.mark-read-btn');
    const deleteBtn = popup?.querySelector('.delete-btn');

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
              const infoItem = dot.closest('.info-item');
              if (infoItem) infoItem.classList.add('read');
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

    deleteBtn?.addEventListener('click', function (e) {
      e.stopPropagation();
      const infoItem = dot.closest('.info-item');
      if (infoItem) infoItem.remove();
      if (popup) popup.style.display = 'none';
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.menu-popup').forEach(popup => {
      popup.style.display = 'none';
    });
  });
});
