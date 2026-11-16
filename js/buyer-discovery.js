document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("analyzerForm");
    const section = document.getElementById("buyerDiscovery");
    if (!form || !section) return;

    function addList(elementId, items) {
        const container = document.getElementById(elementId);
        if (!container) return;
        container.replaceChildren();

        const list = document.createElement("ul");
        items.forEach(value => {
            const item = document.createElement("li");
            item.textContent = value;
            list.appendChild(item);
        });
        container.appendChild(list);
    }

    form.addEventListener("submit", function () {
        const product = document.getElementById("productName").value.trim();
        const countries = window.GBNTargetCountries
            ? window.GBNTargetCountries.getSelected() : [];
        const type = document.getElementById("businessType").value;

        if (!product || !countries.length || !type) return;

        const text = product.toLowerCase();
        let category = "General business";
        let buyers = [
            "Importers and purchasing companies",
            "Wholesale distributors",
            "Specialist retailers",
            "Business-to-business procurement teams"
        ];

        if (/garment|apparel|textile|clothing|fashion/.test(text)) {
            category = "Garments and textiles";
            buyers = [
                "Clothing importers",
                "Fashion brands and private-label companies",
                "Textile and apparel wholesalers",
                "Retail sourcing and procurement companies"
            ];
        } else if (/agri|farm|crop|fruit|vegetable|food|rice/.test(text)) {
            category = "Agriculture and food";
            buyers = [
                "Food importers",
                "Agricultural wholesalers",
                "Food processing companies",
                "Supermarket purchasing teams"
            ];
        } else if (/software|technology|digital|computer|app|it service/.test(text)) {
            category = "Technology";
            buyers = [
                "Technology resellers",
                "Corporate IT procurement teams",
                "Software distributors and partners",
                "Businesses seeking technology services"
            ];
        } else if (/machine|machinery|equipment|industrial/.test(text)) {
            category = "Industrial products";
            buyers = [
                "Industrial equipment distributors",
                "Factory procurement departments",
                "Machinery importers",
                "Industrial wholesalers"
            ];
        }

        addList("buyerCategories", buyers);

        const keywords = countries.flatMap(country => [
            product + " importer " + country,
            product + " distributor " + country,
            product + " wholesale buyer " + country,
            product + " sourcing company " + country
        ]);

        const keywordContainer = document.getElementById("buyerKeywords");
        keywordContainer.replaceChildren();

        keywords.forEach(keyword => {
            const tag = document.createElement("span");
            tag.className = "buyer-keyword";
            tag.textContent = keyword;
            keywordContainer.appendChild(tag);
        });

        addList("buyerProfile", [
            "Product or service: " + product,
            "Target markets (" + countries.length + "): " + countries.join(", "),
            "Business category: " + category,
            "Your business role: " + type,
            "Look for buyers whose purchasing needs match your capacity."
        ]);

        addList("buyerChecklist", [
            "Confirm that the company is legally registered.",
            "Check its official website and business activity.",
            "Verify whether it actually purchases your product.",
            "Review its import or distribution experience.",
            "Confirm contact details from an official source.",
            "Check payment terms and business references before making commitments."
        ]);

        section.hidden = false;
    });
});
