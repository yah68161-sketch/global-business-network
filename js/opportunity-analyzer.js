document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("analyzerForm");
    const results = document.getElementById("analysisResults");

    if (!form || !results) return;

    function safeText(value) {
        return String(value).replace(/[&<>"']/g, function (char) {
            return {
                "&": "&amp;", "<": "&lt;", ">": "&gt;",
                '"': "&quot;", "'": "&#39;"
            }[char];
        });
    }

    function showList(elementId, items) {
        const target = document.getElementById(elementId);
        if (!target) return;
        target.innerHTML = "<ul>" + items.map(item =>
            "<li>" + safeText(item) + "</li>"
        ).join("") + "</ul>";
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const product = document.getElementById("productName").value.trim();
        const countries = window.GBNTargetCountries
            ? window.GBNTargetCountries.getSelected() : [];
        const type = document.getElementById("businessType").value;

        if (!product || countries.length < 1 || countries.length > 10 || !type) {
            alert("Enter a product or service, select 1 to 10 target countries, and choose your business type.");
            return;
        }

        const countryText = countries.join(", ");

        document.getElementById("reportSummary").textContent =
            "Initial assessment for " + product +
            " across " + countries.length + " target market(s): " +
            countryText + " (" + type + ").";

        showList("buyerSegments", countries.flatMap(country => [
            "Importers and sourcing companies in " + country,
            "Wholesale distributors in " + country,
            "Retail chains and specialist retailers in " + country,
            "Relevant B2B purchasing companies in " + country
        ]));

        showList("marketResearch", countries.flatMap(country => [
            "Investigate local demand for " + product + " in " + country,
            "Check import regulations and product standards in " + country,
            "Research local competitors and pricing in " + country,
            "Identify potential distribution channels in " + country
        ]));

        showList("businessGaps", [
            "Look for underserved customer segments in each selected market",
            "Investigate quality and delivery problems",
            "Compare available product varieties",
            "Check whether buyers need smaller order quantities"
        ]);

        showList("nextSteps", [
            "Prepare a clear company and product profile",
            "Research verified potential buyers in each selected country",
            "Compare competitor products and offers across the selected markets",
            "Contact relevant business associations",
            "Validate demand before making business commitments"
        ]);

        results.hidden = false;
        results.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});
