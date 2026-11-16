document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const form = document.getElementById("analyzerForm");

    if (!form) return;

    const registry = window.GBNIndustryRegistry;

    if (!registry) {
        console.error("GBN Industry Registry is unavailable.");
        return;
    }

    function getValue(id) {
        const element = document.getElementById(id);
        return element ? element.value.trim() : "";
    }

    function getCountries() {
        if (window.GBNTargetCountries) {
            return window.GBNTargetCountries.getSelected();
        }

        const select = document.getElementById("targetCountry");

        return select
            ? Array.from(select.selectedOptions).map(option => option.value)
            : [];
    }

    function addHeading(container, text) {
        const heading = document.createElement("h4");
        heading.textContent = text;
        container.appendChild(heading);
    }

    function addList(container, items) {
        const list = document.createElement("ul");

        items.forEach(function (value) {
            const item = document.createElement("li");
            item.textContent = value;
            list.appendChild(item);
        });

        container.appendChild(list);
    }

    function renderSimpleList(id, items) {
        const container = document.getElementById(id);
        if (!container) return;

        container.replaceChildren();
        addList(container, items);
    }

    function makeGenericProfile(product, category, role, model) {
        const isService = /service|consult|agency|freelance|software|repair|training/i
            .test(product + " " + category);

        const buyers = isService
            ? [
                "Individual and business service customers",
                "Corporate service procurement teams",
                "Organizations requiring specialist services",
                "Service resellers and referral partners",
                "Strategic business partners"
            ]
            : [
                "Potential end users and commercial customers",
                "Importers and purchasing companies",
                "Wholesale and retail distributors",
                "Corporate procurement departments",
                "Resellers and channel partners"
            ];

        const priorities = [
            "Identify the actual customers and organizations that purchase " + product,
            "Research local competitors, substitutes and alternative providers",
            "Investigate customer requirements, quality expectations and purchasing terms",
            "Check applicable laws, licensing, standards and regulatory requirements",
            "Research relevant sales, distribution and partnership channels",
            "Compare independently verified offers, prices and service conditions",
            "Verify potential buyers through official company websites and reliable records"
        ];

        if (model === "Online") {
            priorities.push("Investigate digital sales channels, platform rules and online customer acquisition");
        } else if (model === "Offline") {
            priorities.push("Investigate local premises, physical distribution and regional customer access");
        } else if (model === "Hybrid") {
            priorities.push("Compare online and physical sales channels and how they can work together");
        }

        return {
            name: category || "Open / Custom Business Category",
            buyers: buyers,
            priorities: priorities,
            searchTerms: [
                product + " buyer",
                product + " purchasing company",
                product + " distributor",
                product + " supplier",
                product + " business partnership",
                category + " companies"
            ]
        };
    }

    function renderCountryReports(countries, profile, product) {
        const buyerSegments = document.getElementById("buyerSegments");
        const marketResearch = document.getElementById("marketResearch");
        const buyerCategories = document.getElementById("buyerCategories");
        const buyerKeywords = document.getElementById("buyerKeywords");

        if (buyerSegments) buyerSegments.replaceChildren();
        if (marketResearch) marketResearch.replaceChildren();
        if (buyerCategories) buyerCategories.replaceChildren();
        if (buyerKeywords) buyerKeywords.replaceChildren();

        countries.forEach(function (country) {
            if (buyerSegments) {
                addHeading(buyerSegments, "Potential buyer groups — " + country);

                addList(
                    buyerSegments,
                    profile.buyers.map(item => item + " in " + country)
                );
            }

            if (marketResearch) {
                addHeading(marketResearch, "Market research priorities — " + country);

                addList(
                    marketResearch,
                    profile.priorities.map(item => item + " (" + country + ")")
                );
            }

            if (buyerCategories) {
                addHeading(buyerCategories, country);
                addList(buyerCategories, profile.buyers);
            }

            if (buyerKeywords) {
                const heading = document.createElement("h4");
                heading.textContent = country;
                buyerKeywords.appendChild(heading);

                profile.searchTerms.forEach(function (term) {
                    const tag = document.createElement("span");
                    tag.className = "buyer-keyword";
                    tag.textContent = term + " " + country;
                    buyerKeywords.appendChild(tag);
                });
            }
        });
    }

    function renderProfile(product, category, role, model, countries, profile) {
        const container = document.getElementById("buyerProfile");
        if (!container) return;

        container.replaceChildren();

        const items = [
            "Product or service: " + product,
            "Business category: " + profile.name,
            "Business role: " + role,
            "Operating model: " + (model || "Not specified"),
            "Target markets: " + countries.join(", "),
            "Intelligence mode: Universal business research guidance",
            "Category template: " + (category ? "Custom category supplied" : "General category framework")
        ];

        addList(container, items);
    }

    function syncComparison(countries) {
        const checkboxes = document.querySelectorAll(
            'input[name="gbnCompareCountry"]'
        );

        checkboxes.forEach(function (checkbox) {
            checkbox.checked = countries.includes(checkbox.value);
            checkbox.disabled = true;
        });

        const message = document.getElementById("gbnCompareMessage");

        if (message) {
            message.textContent = countries.length >= 2
                ? "Target countries synced. You can compare these markets."
                : "Select at least 2 target countries to use Country Comparison.";
        }
    }

    form.addEventListener("submit", function () {
        const product = getValue("productName");
        const category = getValue("businessCategory");
        const role = getValue("businessType");
        const model = getValue("businessModel");
        const countries = getCountries();

        if (!product || !role || !countries.length || countries.length > 10) {
            return;
        }

        const specialist = registry.resolve(category, product);

        const profile = specialist || makeGenericProfile(
            product,
            category,
            role,
            model
        );

        renderCountryReports(countries, profile, product);

        renderProfile(
            product,
            category,
            role,
            model,
            countries,
            profile
        );

        renderSimpleList("businessGaps", [
            "Check whether customers are underserved in each selected market",
            "Investigate problems with existing products or services",
            "Identify unmet customer requirements",
            "Compare availability, quality, convenience and service expectations",
            "Validate each potential business gap with reliable evidence"
        ]);

        renderSimpleList("nextSteps", [
            "Prepare a detailed product or service profile",
            "Define the ideal customer and buyer requirements",
            "Research real companies in each target country",
            "Verify applicable regulations through official sources",
            "Compare competitors and independently verified commercial offers",
            "Validate customer interest before making financial commitments"
        ]);

        const summary = document.getElementById("reportSummary");

        if (summary) {
            summary.textContent =
                "Universal business research guidance for " + product +
                " across " + countries.length + " selected markets: " +
                countries.join(", ") +
                ". Category: " + profile.name +
                ". Business role: " + role + ".";
        }

        const explanation = document.getElementById("scoreExplanation");

        if (explanation) {
            explanation.textContent =
                "The readiness score is not a measurement of market demand, " +
                "profitability or business success. This report provides research " +
                "guidance, not verified buyer records or live market statistics. " +
                "Profile framework: " + profile.name + ".";
        }

        syncComparison(countries);
    });

    window.GBNUniversalIntelligence = {
        version: "1.0.0",
        getRegistry: function () {
            return registry.getAll();
        }
    };
});
