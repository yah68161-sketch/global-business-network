document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const form = document.getElementById("analyzerForm");
    if (!form) return;

    const getValue = id => {
        const element = document.getElementById(id);
        return element ? element.value.trim() : "";
    };

    const getCountries = () => {
        if (window.GBNTargetCountries &&
            typeof window.GBNTargetCountries.getSelected === "function") {
            return window.GBNTargetCountries.getSelected();
        }

        const select = document.getElementById("targetCountry");
        if (!select) return [];

        return Array.from(select.selectedOptions)
            .map(option => option.value)
            .filter(Boolean);
    };

    function makeList(container, items) {
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

    function makeCountryResearch(container, countries, product, category, model, specialist) {
        if (!container) return;

        container.replaceChildren();

        countries.forEach(country => {
            const heading = document.createElement("h4");
            heading.textContent = "Research focus: " + country;
            container.appendChild(heading);

            const items = [
                "Identify companies that purchase or use " + product + ".",
                "Research local importers, distributors, wholesalers and relevant service buyers.",
                "Check competing products, services and alternative suppliers.",
                "Investigate local pricing, purchasing requirements and expected quality.",
                "Verify applicable regulations, certifications and business requirements.",
                "Research logistics, payment practices and distribution channels."
            ];

            if (category) {
                items.push("Investigate the market requirements for the category: " + category + ".");
            }

            if (model) {
                items.push("Check whether the operating model '" + model +
                    "' fits local buyer expectations and business conditions.");
            }

            if (specialist && specialist.priorities) {
                specialist.priorities.forEach(priority => items.push(priority));
            }

            makeList(containerForCountry(container, heading), items);
        });
    }

    function containerForCountry(parent, heading) {
        const list = document.createElement("ul");
        heading.insertAdjacentElement("afterend", list);
        return list;
    }

    function makeBuyers(product, category, role, specialist) {
        const roleText = role.toLowerCase();

        let buyers = [];

        if (/importer|buyer|purchas|procurement/.test(roleText)) {
            buyers = [
                "Manufacturers and direct suppliers of " + product,
                "Exporters and wholesale suppliers",
                "Verified product distributors",
                "Potential business sourcing partners"
            ];
        } else if (/service|freelancer|consultant|agency/.test(roleText)) {
            buyers = [
                "Companies seeking " + product + " services",
                "Business owners and corporate clients",
                "Procurement and operations departments",
                "Agencies and potential service partners"
            ];
        } else {
            buyers = [
                "Importers and purchasing companies",
                "Wholesale distributors and resellers",
                "Retailers and specialist stores",
                "Manufacturers and business procurement teams",
                "E-commerce businesses and marketplace sellers",
                "Potential commercial partners and institutional buyers"
            ];
        }

        if (specialist && Array.isArray(specialist.buyers)) {
            buyers = buyers.concat(specialist.buyers);
        }

        if (category) {
            buyers.push("Businesses purchasing products or services within " + category);
        }

        return [...new Set(buyers)];
    }

    function makeKeywords(product, countries, category, specialist) {
        const keywords = [];

        countries.forEach(country => {
            [
                product + " buyer " + country,
                product + " purchasing company " + country,
                product + " distributor " + country,
                product + " supplier " + country,
                product + " business partnership " + country,
                product + " wholesale " + country
            ].forEach(term => keywords.push(term));

            if (category) {
                keywords.push(category + " companies " + country);
            }

            if (specialist && Array.isArray(specialist.searchTerms)) {
                specialist.searchTerms.forEach(term => {
                    keywords.push(term + " " + country);
                });
            }
        });

        return [...new Set(keywords)];
    }

    function renderKeywords(container, keywords) {
        if (!container) return;

        container.replaceChildren();

        keywords.forEach(keyword => {
            const tag = document.createElement("span");
            tag.className = "buyer-keyword";
            tag.textContent = keyword;
            container.appendChild(tag);
        });
    }

    function render() {
        const product = getValue("productName");
        const categoryInput = getValue("businessCategory");
        const role = getValue("businessType");
        const model = getValue("businessModel");
        const countries = getCountries();

        if (!product || !countries.length) return;

        const registry = window.GBNIndustryRegistry;

        const specialist = registry &&
            typeof registry.resolve === "function"
            ? registry.resolve(categoryInput, product)
            : null;

        const category = categoryInput ||
            (specialist ? specialist.name : "General / custom business");

        const buyers = makeBuyers(product, category, role, specialist);
        const keywords = makeKeywords(product, countries, category, specialist);

        const profile = [
            "Product or service: " + product,
            "Business category: " + category,
            "Business role: " + (role || "Not specified"),
            "Business operating model: " + (model || "Not specified"),
            "Target countries (" + countries.length + "): " + countries.join(", "),
            "Intelligence approach: Universal business research guidance",
            "Note: Buyer groups and research keywords are suggestions, not verified companies."
        ];

        makeList(document.getElementById("buyerSegments"), buyers);
        makeList(document.getElementById("buyerCategories"), buyers);
        makeList(document.getElementById("buyerProfile"), profile);

        renderKeywords(document.getElementById("buyerKeywords"), keywords);

        makeCountryResearch(
            document.getElementById("marketResearch"),
            countries,
            product,
            category,
            model,
            specialist
        );

        const gaps = [
            "Are buyers satisfied with existing product or service quality?",
            "Are there unmet needs involving price, delivery or customer support?",
            "Do buyers need different specifications, packages or service options?",
            "Are smaller businesses or underserved customer groups overlooked?",
            "Which certifications, standards or legal requirements apply?",
            "Are current suppliers meeting buyers' expected delivery times?",
            "What problems do customers repeatedly report about existing solutions?"
        ];

        makeList(document.getElementById("marketGapList"), gaps);

        makeList(document.getElementById("businessGaps"), [
            "Research unmet customer needs in each selected country.",
            "Compare existing competitors and alternative solutions.",
            "Identify possible gaps in pricing, quality, delivery and service.",
            "Check whether the selected business model addresses those gaps.",
            "Validate each potential opportunity through reliable market evidence."
        ]);

        makeList(document.getElementById("nextSteps"), [
            "Define the exact product or service specifications.",
            "Identify relevant buyer and supplier company types.",
            "Research each target country separately.",
            "Collect official company websites and business contact details.",
            "Verify company activity and purchasing relevance.",
            "Compare costs, regulations, logistics and commercial terms.",
            "Contact suitable businesses with a clear proposal."
        ]);

        makeList(document.getElementById("buyerChecklist"), [
            "Confirm that the company is legally registered.",
            "Check its official website and business activities.",
            "Verify whether it purchases or uses the relevant product or service.",
            "Check its distribution, sourcing or service history.",
            "Confirm contact details through official sources.",
            "Review commercial terms and references before making commitments."
        ]);

        let score = 30;

        if (product.length >= 7) score += 10;
        if (product.length >= 18) score += 5;
        if (categoryInput || specialist) score += 10;
        if (role) score += 10;
        if (model) score += 10;
        if (countries.length >= 1) score += 10;
        if (countries.length >= 3) score += 5;
        if (countries.length >= 5) score += 5;

        score = Math.min(score, 85);

        const scoreElement = document.getElementById("opportunityScore");
        const levelElement = document.getElementById("scoreLevel");
        const barElement = document.getElementById("scoreBar");
        const explanation = document.getElementById("scoreExplanation");

        if (scoreElement) scoreElement.textContent = score;
        if (levelElement) {
            levelElement.textContent = score >= 70
                ? "Detailed business profile"
                : score >= 50
                    ? "Developing business profile"
                    : "Initial business profile";
        }

        if (barElement) barElement.style.width = score + "%";

        if (explanation) {
            explanation.textContent =
                "This is a profile completeness indicator, not a market demand, profitability or success score. " +
                "It does not use live market data. Selected countries: " +
                countries.length + ".";
        }

        const summary = document.getElementById("reportSummary");

        if (summary) {
            summary.textContent =
                "Initial business research profile for " + product +
                ". Category: " + category +
                ". Role: " + (role || "Not specified") +
                ". Operating model: " + (model || "Not specified") +
                ". Selected markets: " + countries.join(", ") +
                ". Research suggestions require independent verification.";
        }

        const results = document.getElementById("analysisResults");
        if (results) results.hidden = false;

        const discovery = document.getElementById("buyerDiscovery");
        if (discovery) discovery.hidden = false;

        console.info("[GBN] Integrated Intelligence Engine completed.");
    }

    // This file is loaded last, so its report is the final unified output.
    form.addEventListener("submit", function () {
        render();
    });

    window.GBNIntegratedIntelligence = {
        version: "2026-11-15",
        render: render
    };
});
