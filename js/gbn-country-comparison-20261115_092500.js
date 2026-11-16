document.addEventListener("DOMContentLoaded", function () {

    const compareButton = document.getElementById("gbnCompareButton");
    const results = document.getElementById("gbnCompareResults");
    const message = document.getElementById("gbnCompareMessage");

    if (!compareButton || !results || !message) return;
    // GBN: Maximum five countries can be selected
    const countryCheckboxes = document.querySelectorAll('input[name="gbnCompareCountry"]');

    countryCheckboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", function () {
            const selectedCount = document.querySelectorAll(
                'input[name="gbnCompareCountry"]:checked'
            ).length;

            if (selectedCount > 10) {
                checkbox.checked = false;
                message.textContent = "You can select a maximum of 10 countries.";
            } else {
                message.textContent = "";
            }
        });
    });


    function getBuyerGroups(product) {
        const text = product.toLowerCase();

        if (/garment|apparel|textile|clothing|fashion/.test(text)) {
            return [
                "Clothing and apparel importers",
                "Fashion brands and private-label businesses",
                "Textile and apparel wholesalers",
                "Retail sourcing and procurement teams"
            ];
        }

        if (/agri|farm|crop|fruit|vegetable|food|rice/.test(text)) {
            return [
                "Food importers",
                "Agricultural wholesalers",
                "Food processing businesses",
                "Supermarket purchasing teams"
            ];
        }

        if (/software|technology|digital|computer|app|it service/.test(text)) {
            return [
                "Technology resellers",
                "Corporate IT procurement teams",
                "Software distributors and partners",
                "Businesses seeking technology services"
            ];
        }

        if (/machine|machinery|equipment|industrial/.test(text)) {
            return [
                "Industrial equipment distributors",
                "Factory procurement departments",
                "Machinery importers",
                "Industrial wholesalers"
            ];
        }

        return [
            "Importers and purchasing companies",
            "Wholesale distributors",
            "Specialist retailers",
            "B2B procurement teams"
        ];
    }

    function addList(parent, items) {
        const list = document.createElement("ul");

        items.forEach(function (value) {
            const item = document.createElement("li");
            item.textContent = value;
            list.appendChild(item);
        });

        parent.appendChild(list);
    }

    compareButton.addEventListener("click", function () {

        const selected = Array.from(
            document.querySelectorAll('input[name="gbnCompareCountry"]:checked')
        ).map(function (input) {
            return input.value;
        });

        if (selected.length < 2 || selected.length > 10) {
            message.textContent = "Please select between 2 and 10 countries.";
            results.replaceChildren();
            return;
        }

        const productInput = document.getElementById("productName");
        const businessInput = document.getElementById("businessType");

        const product = productInput ? productInput.value.trim() : "";
        const businessType = businessInput ? businessInput.value : "";

        if (!product || !businessType) {
            message.textContent = "First complete the Opportunity Analyzer form.";
            results.replaceChildren();
            return;
        }

        message.textContent = "Research comparison prepared for " + selected.length + " countries.";

        const buyers = getBuyerGroups(product);
        const fragment = document.createDocumentFragment();

        selected.forEach(function (country) {

            const card = document.createElement("article");
            card.className = "gbn-cc-card";

            const title = document.createElement("h3");
            title.textContent = country;
            card.appendChild(title);

            const profile = document.createElement("p");
            profile.textContent = "Product: " + product + " | Business role: " + businessType;
            card.appendChild(profile);

            const buyerHeading = document.createElement("h4");
            buyerHeading.textContent = "Potential Buyer Groups to Research";
            card.appendChild(buyerHeading);
            addList(card, buyers);

            const researchHeading = document.createElement("h4");
            researchHeading.textContent = "Market Research Priorities";
            card.appendChild(researchHeading);

            addList(card, [
                "Identify verified buyers and check whether they purchase " + product + " in " + country + ".",
                "Check current import rules, customs duties and product requirements through official sources.",
                "Research product standards, labeling and any required certifications.",
                "Compare competitor products, independently verified prices and supplier offers.",
                "Identify suitable distributors, wholesalers and business-to-business channels.",
                "Verify company registration, purchasing activity and payment terms before doing business."
            ]);

            fragment.appendChild(card);
        });

        results.replaceChildren(fragment);
    });

});

