document.addEventListener("DOMContentLoaded", function () {
    const courses = [
        { name: "Mathématiques", professor: "M. Dupont", duration: "3 mois" },
        { name: "Physique", professor: "Mme Leblanc", duration: "4 mois" },
        { name: "Informatique", professor: "M. Martin", duration: "5 mois" },
        { name: "Histoire", professor: "Mme Durand", duration: "2 mois" },
        { name: "Anglais", professor: "M. Smith", duration: "6 mois" },
    ];

    const tableBody = document.querySelector("#coursesTable tbody");

    function displayCourses(filteredCourses = courses) {
        tableBody.innerHTML = ""; // Vide le tableau avant d'ajouter les cours

        filteredCourses.forEach(course => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${course.name}</td>
                <td>${course.professor}</td>
                <td>${course.duration}</td>
            `;

            tableBody.appendChild(row);
        });
    }

    // Afficher tous les cours au chargement
    displayCourses();

    // Gestion de la recherche
    document.getElementById("searchButton").addEventListener("click", function () {
        const searchText = document.getElementById("searchInput").value.toLowerCase();

        const filteredCourses = courses.filter(course =>
            course.name.toLowerCase().includes(searchText)
        );

        displayCourses(filteredCourses);
    });
});
