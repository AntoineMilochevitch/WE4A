document.addEventListener("DOMContentLoaded", function () {
    const courses = [
        { code: "MTH101", name: "Mathématiques", description: "Cours sur l'algèbre et l'analyse." },
        { code: "PHY202", name: "Physique", description: "Étude des lois fondamentales de la physique." },
        { code: "INF103", name: "Informatique", description: "Introduction aux algorithmes et à la programmation." },
        { code: "HIS104", name: "Histoire", description: "Exploration des grandes périodes historiques." },
        { code: "ENG105", name: "Anglais", description: "Cours d’anglais général et technique." },
    ];

    const tableBody = document.querySelector("#coursesTable tbody");

    function displayCourses(filteredCourses = courses) {
        tableBody.innerHTML = ""; // Vide le tableau avant d'ajouter les cours

        filteredCourses.forEach(course => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${course.code}</td>
                <td>${course.name}</td>
                <td>${course.description}</td>
                <td><button class="info-btn">+ Infos</button></td>
            `;

            tableBody.appendChild(row);
        });
    }

    // Afficher tous les cours au chargement
    displayCourses();
});
