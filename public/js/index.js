document.addEventListener("DOMContentLoaded", function () {

  // === GESTION DES CARTES SCROLLABLES ===
  const scrollContainer = document.getElementById("scrollContainer");
  const progressBar = document.getElementById("progressBar");
  const cards = document.querySelectorAll(".cards-container .card");
  const leftBtn = document.getElementById("arrowLeft");
  const rightBtn = document.getElementById("arrowRight");

  let currentIndex = 0;

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
    if (progressBar) {
      const progress = ((currentIndex + 1) / cards.length) * 100;
      progressBar.style.width = progress + "%";
    }
  }

  if (leftBtn && rightBtn && scrollContainer && cards.length > 0) {
    leftBtn.addEventListener("click", () => {
      scrollToCard(currentIndex - 1);
    });

    rightBtn.addEventListener("click", () => {
      scrollToCard(currentIndex + 1);
    });

    scrollContainer.addEventListener("mouseleave", () => {
      scrollToCard(0);
    });

    updateProgressBar();
  }

  // === GESTION DES MENUS INFO ===
  const menuDots = document.querySelectorAll('.menu-dots');

  menuDots.forEach(dot => {
    const popup = dot.nextElementSibling;

    dot.addEventListener('click', function (event) {
      event.stopPropagation();
      event.preventDefault();

      // Fermer tous les autres popups ouverts
      document.querySelectorAll('.menu-popup').forEach(otherPopup => {
        if (otherPopup !== popup) {
          otherPopup.style.display = 'none';
        }
      });

      // Basculer l'affichage du popup actuel
      if (popup) {
        popup.style.display = (popup.style.display === 'block') ? 'none' : 'block';
      }
    });

    // Gestion des boutons dans le popup
    const markAsReadBtn = popup?.querySelector('.mark-read-btn');
    const deleteBtn = popup?.querySelector('.delete-btn');

    markAsReadBtn?.addEventListener('click', function (e) {
      e.stopPropagation();
      const infoItem = dot.closest('.info-item');
      if (infoItem) {
        infoItem.classList.add('read');
      }
      if (popup) popup.style.display = 'none';
    });

    deleteBtn?.addEventListener('click', function (e) {
      e.stopPropagation();
      const infoItem = dot.closest('.info-item');
      if (infoItem) {
        infoItem.remove();
      }
      if (popup) popup.style.display = 'none';
    });
  });

  // Fermer les popups si clic en dehors
  document.addEventListener('click', () => {
    document.querySelectorAll('.menu-popup').forEach(popup => {
      popup.style.display = 'none';
    });
  });

});
