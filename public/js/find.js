document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector("#coursesTable tbody");

    function displayCourses(courses) {
        tableBody.innerHTML = ""; // Vide le tableau avant d'ajouter les cours

        courses.forEach(course => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${course.code}</td>
                <td>${course.name}</td>
                <td>${course.description ?? ""}</td>
                <td><button class="info-btn">+ Infos</button></td>
            `;

            tableBody.appendChild(row);
        });
    }

    // Récupérer les données depuis Symfony (API)
    fetch('/api/ue')
        .then(response => response.json())
        .then(data => {
            displayCourses(data);  // Afficher les cours dynamiquement à partir de l'API
        })
        .catch(error => console.error("Erreur lors du chargement des cours:", error));
});
