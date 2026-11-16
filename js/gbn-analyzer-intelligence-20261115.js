document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("analyzerForm");
    if (!form) return;

    const countrySelect = document.getElementById("targetCountry");
    const comparisonGrid = document.querySelector(".gbn-cc-country-grid");
    const comparisonMessage = document.getElementById("gbnCompareMessage");

    function getCountries() {
        if (window.GBNTargetCountries) {
            return window.GBNTargetCountries.getSelected();
        }

        return countrySelect
            ? Array.from(countrySelect.selectedOptions).map(option => option.value)
            : [];
    }

    function detectCategory(product) {
        const text = product.toLowerCase();

        if (/graments|garment|apparel|textile|clothing|fashion|fabric/.test(text)) {
            return {
                name: "Garments and textiles",
                buyers: [
                    "Garment and apparel importers",
                    "Fashion brands and private-label buyers",
                    "Textile and fabric wholesalers",
                    "Clothing retail sourcing teams",
                    "Uniform and workwear purchasing companies"
                ],
                priorities: [
                    "Research importers purchasing garments and textiles",
                    "Check fabric composition, labeling and product standards",
                    "Investigate demand for private-label and custom designs",
                    "Compare competitor product ranges and independently verified prices",
                    "Research wholesale, retail and distribution channels",
                    "Check order quantities, quality requirements and delivery expectations"
                ],
                keywords: [
                    "garment importer",
                    "apparel wholesaler",
                    "textile sourcing company",
                    "private label clothing buyer",
                    "fashion distributor",
                    "fabric importer"
                ]
            };
        }

        if (/agri|farm|crop|fruit|vegetable|food|rice/.test(text)) {
            return {
                name: "Agriculture and food",
                buyers: [
                    "Agricultural product importers",
                    "Food and grocery wholesalers",
                    "Food processing companies",
                    "Supermarket purchasing teams",
                    "Agricultural distributors"
                ],
                priorities: [
                    "Research importers purchasing the selected agricultural product",
                    "Check food safety, packaging and labeling requirements",
                    "Investigate seasonal purchasing and supply consistency",
                    "Research storage, transport and shelf-life expectations",
                    "Compare wholesale and distribution channels",
                    "Verify applicable import and inspection requirements through official sources"
                ],
                keywords: [
                    "agricultural product importer",
                    "food wholesale buyer",
                    "food processing company",
                    "fresh produce distributor",
                    "grocery procurement"
                ]
            };
        }

        if (/software|technology|digital|computer|app|it service/.test(text)) {
            return {
                name: "Technology",
                buyers: [
                    "Technology resellers",
                    "Corporate IT procurement teams",
                    "Software distributors and partners",
                    "Digital service companies",
                    "Enterprise technology purchasing teams"
                ],
                priorities: [
                    "Identify businesses that purchase or distribute this technology",
                    "Research local competitors and available alternatives",
                    "Check data protection and relevant technology regulations",
                    "Investigate localization, integration and support expectations",
                    "Research reseller and partnership channels",
                    "Compare pricing models and service requirements"
                ],
                keywords: [
                    "technology reseller",
                    "software distributor",
                    "IT procurement company",
                    "technology business partner",
                    "enterprise software buyer"
                ]
            };
        }

        if (/machine|machinery|equipment|industrial/.test(text)) {
            return {
                name: "Industrial products",
                buyers: [
                    "Industrial machinery importers",
                    "Factory procurement departments",
                    "Industrial equipment distributors",
                    "Engineering and maintenance companies",
                    "Industrial wholesalers"
                ],
                priorities: [
                    "Research machinery importers and industrial distributors",
                    "Check applicable technical and safety standards",
                    "Investigate spare-parts and after-sales service expectations",
                    "Compare equipment specifications and independently verified prices",
                    "Research factory procurement and dealer networks",
                    "Check installation, warranty and maintenance requirements"
                ],
                keywords: [
                    "industrial machinery importer",
                    "factory equipment buyer",
                    "industrial distributor",
                    "machinery wholesale company",
                    "engineering procurement"
                ]
            };
        }

        return {
            name: "General business",
            buyers: [
                "Product importers and purchasing companies",
                "Wholesale distributors",
                "Specialist retailers",
                "B2B procurement teams",
                "Commercial sourcing companies"
            ],
            priorities: [
                "Identify companies that purchase this product or service",
                "Research local competitors and alternative suppliers",
                "Check relevant import, licensing and product requirements",
                "Investigate buyer expectations and purchasing volumes",
                "Compare distribution and partnership channels",
                "Validate buyer activity using official company sources"
            ],
            keywords: [
                "product importer",
                "wholesale buyer",
                "product distributor",
                "commercial sourcing company",
                "B2B purchasing company"
            ]
        };
    }

    function addList(container, items) {
        if (!container) return;

        container.replaceChildren();

        const list = document.createElement("ul");

        items.forEach(function (value) {
            const item = document.createElement("li");
            item.textContent = value;
            list.appendChild(item);
        });

        container.appendChild(list);
    }

    function renderCountryBuyerCategories(countries, category) {
        const container = document.getElementById("buyerCategories");
        if (!container) return;

        container.replaceChildren();

        countries.forEach(function (country) {
            const heading = document.createElement("h4");
            heading.textContent = country;
            container.appendChild(heading);

            const list = document.createElement("ul");

            category.buyers.forEach(function (buyer) {
                const item = document.createElement("li");
                item.textContent = buyer + " in " + country;
                list.appendChild(item);
            });

            container.appendChild(list);
        });
    }

    function renderKeywords(countries, category, product) {
        const container = document.getElementById("buyerKeywords");
        if (!container) return;

        container.replaceChildren();

        countries.forEach(function (country) {
            category.keywords.forEach(function (keyword) {
                const tag = document.createElement("span");
                tag.className = "buyer-keyword";
                tag.textContent = product + " " + keyword + " " + country;
                container.appendChild(tag);
            });
        });
    }

    function renderCountryResearch(countries, category, product) {
        const buyers = document.getElementById("buyerSegments");
        const research = document.getElementById("marketResearch");

        if (buyers) {
            buyers.replaceChildren();

            countries.forEach(function (country) {
                const heading = document.createElement("h4");
                heading.textContent = "Potential buyer groups — " + country;
                buyers.appendChild(heading);

                const list = document.createElement("ul");

                category.buyers.forEach(function (buyer) {
                    const item = document.createElement("li");
                    item.textContent = buyer + " in " + country;
                    list.appendChild(item);
                });

                buyers.appendChild(list);
            });
        }

        if (research) {
            research.replaceChildren();

            countries.forEach(function (country) {
                const heading = document.createElement("h4");
                heading.textContent = "Research priorities — " + country;
                research.appendChild(heading);

                const list = document.createElement("ul");

                category.priorities.forEach(function (priority) {
                    const item = document.createElement("li");
                    item.textContent = priority + " (" + country + ")";
                    list.appendChild(item);
                });

                research.appendChild(list);
            });
        }
    }

    function syncComparison(countries) {
        const checkboxes = document.querySelectorAll(
            'input[name="gbnCompareCountry"]'
        );

        if (!checkboxes.length) return;

        checkboxes.forEach(function (checkbox) {
            checkbox.checked = countries.includes(checkbox.value);
            checkbox.disabled = true;
        });

        if (comparisonGrid) {
            let note = document.getElementById("gbnAutoSyncNote");

            if (!note) {
                note = document.createElement("p");
                note.id = "gbnAutoSyncNote";
                note.className = "gbn-auto-sync-note";
                comparisonGrid.parentNode.insertBefore(note, comparisonGrid);
            }

            note.textContent =
                "Automatically synced from Target Country. Selected: " +
                countries.length + " / 10.";
        }

        if (comparisonMessage) {
            comparisonMessage.textContent =
                countries.length >= 2
                    ? "Target countries synced. You can compare these markets."
                    : "Select at least 2 countries in Target Country to use Country Comparison.";
        }
    }

    form.addEventListener("submit", function () {
        const productInput = document.getElementById("productName");
        const typeInput = document.getElementById("businessType");

        const product = productInput ? productInput.value.trim() : "";
        const type = typeInput ? typeInput.value : "";
        const countries = getCountries();

        if (!product || !type || !countries.length) return;

        const category = detectCategory(product);

        renderCountryBuyerCategories(countries, category);
        renderKeywords(countries, category, product);
        renderCountryResearch(countries, category, product);
        syncComparison(countries);

        const profile = document.getElementById("buyerProfile");

        if (profile) {
            addList(profile, [
                "Product or service: " + product,
                "Business category: " + category.name,
                "Your business role: " + type,
                "Selected target markets: " + countries.join(", "),
                "Research each market separately and verify companies before contacting them."
            ]);
        }

        const scoreExplanation = document.getElementById("scoreExplanation");
        if (scoreExplanation) {
            scoreExplanation.textContent =
                "This score measures profile readiness, not market demand or profitability. " +
                "Detected category: " + category.name +
                ". Markets selected: " + countries.length + ".";
        }

        const summary = document.getElementById("reportSummary");
        if (summary) {
            summary.textContent =
                "Research guidance for " + product + " across " +
                countries.length + " selected markets: " +
                countries.join(", ") + ". Category: " + category.name + ".";
        }
    });

    if (countrySelect) {
        countrySelect.addEventListener("change", function () {
            syncComparison(getCountries());
        });
    }

    // Initial synchronization
    syncComparison(getCountries());
});
