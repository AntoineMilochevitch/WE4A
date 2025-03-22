document.addEventListener("DOMContentLoaded", function () {
   
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

// Navigation avec flèches
leftBtn.addEventListener("click", () => {
    scrollToCard(currentIndex - 1);
});

rightBtn.addEventListener("click", () => {
    scrollToCard(currentIndex + 1);
});

// Réinitialisation à la sortie du container
scrollContainer.addEventListener("mouseleave", () => {
    scrollToCard(0);
});

// Initialiser la barre au démarrage
updateProgressBar();
});
