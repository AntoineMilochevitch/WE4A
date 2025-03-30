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
    const markAsReadBtn = popup?.querySelector('p');

    dot.addEventListener('click', function (event) {
      event.stopPropagation();
      event.preventDefault();

      document.querySelectorAll('.menu-popup').forEach(otherPopup => {
        if (otherPopup !== popup) {
          otherPopup.style.display = 'none';
        }
      });

      popup.style.display = (popup.style.display === 'block') ? 'none' : 'block';
    });

    markAsReadBtn?.addEventListener('click', () => {
      const infoItem = dot.closest('.info-item');
      infoItem?.classList.add('read');
      popup.style.display = 'none';
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.menu-popup').forEach(popup => {
      popup.style.display = 'none';
    });
  });
});
