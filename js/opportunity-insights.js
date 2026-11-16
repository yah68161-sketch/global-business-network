document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("analyzerForm");
    if (!form) return;

    form.addEventListener("submit", function () {
        const product = document.getElementById("productName").value.trim();
        const countries = window.GBNTargetCountries
            ? window.GBNTargetCountries.getSelected() : [];
        const type = document.getElementById("businessType").value;

        if (!product || !countries.length || !type) return;

        const text = product.toLowerCase();
        let score = 35;
        let category = "General business";

        if (product.length >= 15) score += 15;
        else if (product.length >= 7) score += 8;

        if (/garment|apparel|textile|clothing|fashion/.test(text)) {
            category = "Garments and textiles";
            score += 15;
        } else if (/agri|farm|crop|fruit|vegetable|food|rice/.test(text)) {
            category = "Agriculture and food";
            score += 15;
        } else if (/software|technology|digital|computer|app|it service/.test(text)) {
            category = "Technology";
            score += 15;
        } else if (/machine|machinery|equipment|industrial/.test(text)) {
            category = "Industrial products";
            score += 15;
        } else {
            score += 5;
        }

        if (["Manufacturer", "Exporter", "Supplier"].includes(type)) score += 15;
        else if (["Importer", "Distributor", "Service Provider"].includes(type)) score += 12;
        else score += 8;

        if (countries.length > 0) score += 10;
        score = Math.min(score, 90);

        let level = "Early-stage profile";
        let explanation = "This score measures profile readiness, not actual market opportunity or profitability.";

        if (score >= 75) {
            level = "Detailed profile";
            explanation = "Your profile contains several useful details for further market research. This does not confirm market demand.";
        } else if (score >= 60) {
            level = "Developing profile";
            explanation = "Your profile has a starting point. More specific information can improve research.";
        }

        document.getElementById("opportunityScore").textContent = score;
        document.getElementById("scoreLevel").textContent = level;
        document.getElementById("scoreExplanation").textContent =
            explanation + " Category: " + category + ". Markets selected: " + countries.length + ".";
        document.getElementById("scoreBar").style.width = score + "%";

        let baseGaps = [
            "Are buyers satisfied with current supplier prices?",
            "Do buyers need smaller minimum order quantities?",
            "Are delivery times and product quality consistent?",
            "Are there underserved buyer groups in this market?",
            "What certifications or standards do buyers expect?"
        ];

        if (category === "Garments and textiles") {
            baseGaps.unshift(
                "Do buyers need specific fabric types, designs or private-label services?",
                "Are there unmet needs for sustainable or traceable clothing?"
            );
        } else if (category === "Agriculture and food") {
            baseGaps.unshift(
                "Do buyers need better seasonal supply or product consistency?",
                "Are packaging, storage and food-safety requirements being met?"
            );
        } else if (category === "Technology") {
            baseGaps.unshift(
                "Do businesses need more affordable or locally adapted software?",
                "Are customer support and integration needs underserved?"
            );
        } else if (category === "Industrial products") {
            baseGaps.unshift(
                "Do buyers need better after-sales service or spare-parts availability?",
                "Are there unmet needs for customized equipment?"
            );
        }

        const list = document.getElementById("marketGapList");
        list.replaceChildren();

        countries.forEach(country => {
            const heading = document.createElement("li");
            heading.textContent = "Research questions for " + country + ":";
            heading.style.fontWeight = "bold";
            list.appendChild(heading);

            baseGaps.forEach(question => {
                const item = document.createElement("li");
                item.textContent = country + ": " + question;
                list.appendChild(item);
            });
        });
    });
});
