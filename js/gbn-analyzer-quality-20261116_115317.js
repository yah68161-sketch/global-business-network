document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const form = document.getElementById("analyzerForm");
    if (!form) return;

    function value(id) {
        const element = document.getElementById(id);
        return element ? String(element.value || "").trim() : "";
    }

    function countries() {
        if (window.GBNTargetCountries &&
            typeof window.GBNTargetCountries.getSelected === "function") {
            return window.GBNTargetCountries.getSelected();
        }

        const select = document.getElementById("targetCountry");
        if (!select) return [];

        return Array.from(select.selectedOptions)
            .map(option => option.value)
            .filter(Boolean);
    }

    function unique(items) {
        return [...new Set(items.map(item => String(item).trim()).filter(Boolean))];
    }

    function makeBuyers(product, category, role, specialist) {
        const roleText = role.toLowerCase();

        const supplierRole =
            /importer|buyer|purchas|procurement|sourcing/.test(roleText);

        const serviceRole =
            /service|freelancer|consultant|agency|provider/.test(roleText);

        let roleBuyers = [];

        if (supplierRole) {
            roleBuyers = [
                "Manufacturers and direct suppliers of " + product,
                "Exporters and wholesale suppliers",
                "Product distributors and sourcing partners",
                "Potential verified commercial suppliers"
            ];
        } else if (serviceRole) {
            roleBuyers = [
                "Companies seeking " + product + " services",
                "Business owners and corporate clients",
                "Procurement and operations departments",
                "Agencies and potential service partners"
            ];
        } else {
            roleBuyers = [
                "Importers and purchasing companies for " + product,
                "Wholesale distributors and resellers",
                "Retailers and specialist stores",
                "Commercial and institutional buyers"
            ];
        }

        const specialistBuyers =
            specialist && Array.isArray(specialist.buyers)
                ? specialist.buyers
                : [];

        let buyers;

        if (supplierRole) {
            buyers = roleBuyers;
        } else if (specialistBuyers.length) {
            buyers = specialistBuyers.concat(roleBuyers);
        } else {
            buyers = roleBuyers;
        }

        if (category && !specialist) {
            buyers.push("Businesses operating in the " + category + " category");
        }

        return unique(buyers).slice(0, 8);
    }

    function makeKeywords(product, selectedCountries, category, specialist) {
        const results = [];

        selectedCountries.forEach(country => {
            const terms = [
                product + " buyer " + country,
                product + " importer " + country,
                product + " distributor " + country,
                product + " wholesale " + country,
                product + " supplier " + country
            ];

            if (category) {
                terms.push(category + " companies " + country);
            }

            if (specialist && Array.isArray(specialist.searchTerms)) {
                specialist.searchTerms.slice(0, 3).forEach(term => {
                    terms.push(term + " " + country);
                });
            }

            results.push(...terms);
        });

        return unique(results);
    }

    function renderList(id, items) {
        const container = document.getElementById(id);
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

    function renderKeywordTags(items) {
        const container = document.getElementById("buyerKeywords");
        if (!container) return;

        container.replaceChildren();
        container.classList.add("keyword-list");

        items.forEach(keyword => {
            const tag = document.createElement("span");
            tag.className = "buyer-keyword";
            tag.textContent = keyword;
            container.appendChild(tag);
        });
    }

    function renderQualityReport() {
        const product = value("productName");
        const categoryInput = value("businessCategory");
        const role = value("businessType");
        const model = value("businessModel");
        const selectedCountries = countries();

        if (!product || !selectedCountries.length) return;

        const registry = window.GBNIndustryRegistry;

        const specialist = registry &&
            typeof registry.resolve === "function"
            ? registry.resolve(categoryInput, product)
            : null;

        const category = categoryInput ||
            (specialist ? specialist.name : "General / custom business");

        // Buyer segments and categories
        const buyers = makeBuyers(product, category, role, specialist);

        renderList("buyerSegments", buyers);
        renderList("buyerCategories", buyers);

        // Buyer search keywords
        const keywords = makeKeywords(
            product,
            selectedCountries,
            category,
            specialist
        );

        renderKeywordTags(keywords);

        // 100-point business profile completeness score
        let score = 0;
        const breakdown = [];

        if (product) {
            score += 25;
            breakdown.push("Product or service: 25/25");
        } else {
            breakdown.push("Product or service: 0/25");
        }

        if (categoryInput || specialist) {
            score += 15;
            breakdown.push("Business category: 15/15");
        } else {
            breakdown.push("Business category: 0/15");
        }

        if (role) {
            score += 15;
            breakdown.push("Business role: 15/15");
        } else {
            breakdown.push("Business role: 0/15");
        }

        if (model) {
            score += 15;
            breakdown.push("Operating model: 15/15");
        } else {
            breakdown.push("Operating model: 0/15");
        }

        if (selectedCountries.length >= 1) {
            score += 20;
            breakdown.push("Target market selected: 20/20");
        } else {
            breakdown.push("Target market selected: 0/20");
        }

        if (selectedCountries.length >= 3) {
            score += 10;
            breakdown.push("Multi-country research scope: 10/10");
        } else {
            breakdown.push("Multi-country research scope: 0/10 (select 3 or more for full points)");
        }

        const scoreElement = document.getElementById("opportunityScore");
        const levelElement = document.getElementById("scoreLevel");
        const barElement = document.getElementById("scoreBar");
        const explanation = document.getElementById("scoreExplanation");

        if (scoreElement) {
            scoreElement.textContent = String(score);
        }

        if (levelElement) {
            levelElement.textContent = score >= 80
                ? "Detailed business profile"
                : score >= 50
                    ? "Developing business profile"
                    : "Initial business profile";
        }

        if (barElement) {
            barElement.style.width = score + "%";
        }

        if (explanation) {
            explanation.textContent =
                "Business Profile Completeness Score: " + score + "/100. " +
                breakdown.join(" | ") +
                ". This measures profile information completeness only. " +
                "It does not measure market demand, profitability or business success. " +
                "No live buyer verification is implied.";
        }

        // Refresh the buyer profile with current inputs
        renderList("buyerProfile", [
            "Product or service: " + product,
            "Business category: " + category,
            "Business role: " + (role || "Not specified"),
            "Business operating model: " + (model || "Not specified"),
            "Target countries (" + selectedCountries.length + "): " +
                selectedCountries.join(", "),
            "Research approach: Universal and category-aware business guidance",
            "Note: Buyer groups and search terms are suggestions, not verified companies."
        ]);
    }

    // This script is loaded after the existing intelligence scripts.
    // Its submit listener therefore refreshes the final displayed report.
    form.addEventListener("submit", renderQualityReport);

    console.log("[GBN] Analyzer quality override ready.");
});
