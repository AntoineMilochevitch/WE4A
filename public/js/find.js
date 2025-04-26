document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector("#coursesTable tbody");
    const searchButton = document.getElementById("searchButton");
    const searchInput = document.getElementById("searchInput");

    const modal = document.getElementById("ueModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalDescription = document.getElementById("modalDescription");
    const modalCode = document.getElementById("modalCode");
    const modalClose = document.getElementById("modalClose");

    // Fonction pour afficher les cours
    function displayCourses(courses) {
        tableBody.innerHTML = "";

        courses.forEach(course => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${course.code}</td>
                <td>${course.name}</td>
                <td>${course.description ?? ""}</td>
                <td style="text-align: center;">
                    <button class="info-btn" data-code="${course.code}">+ Infos</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    }

    // Fonction pour faire la recherche au clic
    function searchCourses() {
        const searchTerm = searchInput.value.trim();

        fetch(`/api/ue?search=${encodeURIComponent(searchTerm)}`)
            .then(response => response.json())
            .then(data => {
                displayCourses(data);
            })
            .catch(error => console.error("Erreur lors du chargement des cours:", error));
    }

    // Clic sur le bouton pour faire la recherche
    searchButton.addEventListener("click", function () {
        searchCourses();
    });

    // Ouvrir le modal quand on clique sur "+ Infos"
    tableBody.addEventListener("click", function (e) {
        if (e.target.classList.contains("info-btn")) {
            const code = e.target.dataset.code;

            fetch(`/api/ue?search=${encodeURIComponent(code)}`)
                .then(res => res.json())
                .then(data => {
                    const ue = data[0];
                    modalCode.innerText = ue.code;
                    modalTitle.innerText = ue.name;
                    modalDescription.innerText = ue.description ?? "Aucune description disponible";

                    modal.style.display = "flex";
                })
                .catch(error => console.error("Erreur lors de la récupération des infos:", error));
        }
    });

    // Fermer le modal en cliquant sur la croix
    modalClose.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Fermer le modal en cliquant en dehors
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    // Chargement initial de tous les cours
    fetch('/api/ue')
        .then(response => response.json())
        .then(data => {
            displayCourses(data);
        })
        .catch(error => console.error("Erreur lors du chargement initial des cours:", error));
});
