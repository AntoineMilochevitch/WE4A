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
      const progress = ((currentIndex + 1) / cards.length) * 100;
      progressBar.style.width = progress + "%";
    }
  
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
  
    // === GESTION DES MENUS INFO ===
    const menuDots = document.querySelectorAll('.menu-dots');
  
    menuDots.forEach(dot => {
      const popup = dot.nextElementSibling;
      const markAsReadBtn = popup.querySelector('p');
  
      // Ajout du click sur les 3 points
      dot.addEventListener('click', function (event) {
        event.stopPropagation();
        event.preventDefault();
  
        // Fermer les autres menus
        document.querySelectorAll('.menu-popup').forEach(otherPopup => {
          if (otherPopup !== popup) {
            otherPopup.style.display = 'none';
          }
        });
  
        // Afficher/Masquer le menu actuel
        popup.style.display = (popup.style.display === 'block') ? 'none' : 'block';
      });
  
      // Ajout unique d'un gestionnaire de clic pour "Marqué comme lu"
      markAsReadBtn.addEventListener('click', () => {
        const infoItem = dot.closest('.info-item');
        infoItem.classList.add('read');
        popup.style.display = 'none';
      });
    });
  
    // Fermer tous les menus si clic en dehors
    document.addEventListener('click', () => {
      document.querySelectorAll('.menu-popup').forEach(popup => {
        popup.style.display = 'none';
      });
    });
  });
  