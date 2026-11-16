console.log("Global Business Network is running!");

function searchBusinesses() {
    const search = document.getElementById("businessSearch").value.trim().toLowerCase();
    const country = document.getElementById("countryFilter").value;
    const category = document.getElementById("categoryFilter").value;
    const cards = document.querySelectorAll(".business-card");

    let count = 0;

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();

        const matchSearch = text.includes(search);
        const matchCountry = !country || card.dataset.country === country;
        const matchCategory = !category || card.dataset.category === category;

        if (matchSearch && matchCountry && matchCategory) {
            card.style.display = "";
            count++;
        } else {
            card.style.display = "none";
        }
    });

    document.getElementById("searchMessage").textContent =
        count + (count === 1 ? " business found." : " businesses found.");
}

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("businessSearch");
    const countryFilter = document.getElementById("countryFilter");
    const categoryFilter = document.getElementById("categoryFilter");

    searchInput.addEventListener("input", searchBusinesses);
    countryFilter.addEventListener("change", searchBusinesses);
    categoryFilter.addEventListener("change", searchBusinesses);

    searchBusinesses();

    console.log("GBN Search System Ready");
});

