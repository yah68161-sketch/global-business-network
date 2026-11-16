document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const form = document.getElementById("analyzerForm");
    if (!form) return;

    const countryData = {
        "Germany": {
            focus: [
                "Identify German-language buyer directories, trade associations and relevant industry events.",
                "Check applicable EU-wide and German national requirements for this specific product or service.",
                "Map regional distributors, commercial buyers and procurement organisations.",
                "Investigate German-language sales material, customer support and after-sales expectations."
            ],
            channel: "German business directories, industry associations, trade events and verified distributor networks"
        },
        "United States": {
            focus: [
                "Separate buyer research by state and major commercial region rather than treating the country as one market.",
                "Check relevant federal, state and local requirements for the product or service.",
                "Identify specialist distributors, corporate procurement teams and suitable online channels.",
                "Compare regional competitors, delivery coverage and customer purchasing requirements."
            ],
            channel: "State-level business directories, industry associations, procurement portals and verified distributors"
        },
        "United Kingdom": {
            focus: [
                "Identify UK-based importers, service buyers, distributors and relevant procurement organisations.",
                "Verify current UK-specific product, service, customs and business requirements.",
                "Investigate local distribution, online sales and business partnership channels.",
                "Compare regional customer needs, competitor offers and commercial payment terms."
            ],
            channel: "UK company directories, trade associations, procurement portals and distributor networks"
        },
        "United Arab Emirates": {
            focus: [
                "Compare potential buyers and business channels across relevant emirates.",
                "Check the applicable licensing and operating requirements for the chosen business activity.",
                "Investigate whether mainland, free-zone or local distribution arrangements are relevant.",
                "Assess Arabic and English communication needs and suitable local business partners."
            ],
            channel: "Emirate-level business directories, chambers, trade events and verified local partners"
        },
        "Saudi Arabia": {
            focus: [
                "Identify relevant Saudi buyers, distributors, service purchasers and institutional customers.",
                "Verify current activity-specific licensing, product and market-entry requirements.",
                "Investigate Arabic-language business communication and local customer expectations.",
                "Research suitable local distributors, procurement channels and partnership arrangements."
            ],
            channel: "Saudi business directories, chambers, procurement channels and verified local partners"
        },
        "France": {
            focus: [
                "Identify French buyers, distributors and relevant professional purchasing organisations.",
                "Check applicable EU-wide and French national requirements for the business category.",
                "Investigate French-language product information, service communication and support.",
                "Compare regional distribution options, competitors and commercial terms."
            ],
            channel: "French business directories, trade associations, industry events and verified distributors"
        },
        "Italy": {
            focus: [
                "Research buyers and distributors by relevant Italian business region.",
                "Identify specialist wholesalers, retailers and professional purchasing organisations.",
                "Check applicable EU-wide and Italian national requirements.",
                "Investigate Italian-language sales material and local after-sales or service expectations."
            ],
            channel: "Regional business directories, trade fairs, industry associations and distributors"
        },
        "Japan": {
            focus: [
                "Identify Japanese buyers, specialist distributors and relevant purchasing organisations.",
                "Verify product-specific standards, service requirements and applicable regulations.",
                "Investigate Japanese-language documentation and customer support expectations.",
                "Research local partnership, distribution and after-sales arrangements."
            ],
            channel: "Japanese business directories, trade associations, industry events and verified local partners"
        },
        "China": {
            focus: [
                "Identify relevant Chinese buyers, manufacturers, distributors or service purchasers.",
                "Verify applicable registration, product, service and market-access requirements.",
                "Investigate local-language business communication and suitable local partners.",
                "Check relevant digital sales, payment, data and distribution requirements."
            ],
            channel: "Chinese business directories, industry platforms, trade events and verified local partners"
        },
        "India": {
            focus: [
                "Divide buyer research by relevant state, city and customer segment.",
                "Verify applicable national and state-level requirements for the business activity.",
                "Identify suitable importers, distributors, corporate buyers and service partners.",
                "Investigate language, regional pricing, logistics and payment expectations."
            ],
            channel: "State and city business directories, industry associations and verified distributors"
        },
        "Malaysia": {
            focus: [
                "Identify relevant Malaysian buyers, distributors and commercial purchasing organisations.",
                "Verify product-specific registration, standards and business operating requirements.",
                "Investigate Bahasa Malaysia and English communication requirements where relevant.",
                "Check whether any category-specific certification or market requirements apply."
            ],
            channel: "Malaysian business directories, chambers, trade events and distributor networks"
        },
        "Singapore": {
            focus: [
                "Identify Singapore-based buyers, service purchasers and regional business partners.",
                "Verify activity-specific licensing, import and operating requirements.",
                "Research B2B procurement, digital sales and suitable distribution channels.",
                "Compare local customer requirements, commercial terms and regional partnership options."
            ],
            channel: "Singapore business directories, trade associations, procurement channels and verified partners"
        },
        "Australia": {
            focus: [
                "Separate buyer research by relevant state, territory and commercial region.",
                "Verify applicable national and state requirements for the product or service.",
                "Identify local distributors, business purchasers and service partnership channels.",
                "Investigate delivery coverage, customer support and any category-specific entry requirements."
            ],
            channel: "Australian business directories, industry associations and verified regional distributors"
        },
        "Canada": {
            focus: [
                "Separate buyer research by province, territory and relevant customer segment.",
                "Verify applicable federal, provincial and local requirements.",
                "Investigate language, labeling and customer communication requirements where applicable.",
                "Identify regional distributors, institutional buyers and commercial partners."
            ],
            channel: "Canadian business directories, provincial business networks and verified distributors"
        },
        "South Korea": {
            focus: [
                "Identify Korean buyers, distributors and relevant corporate purchasing organisations.",
                "Verify applicable product standards, service rules and business requirements.",
                "Investigate Korean-language sales information and customer support needs.",
                "Research local distribution, digital channels and suitable business partnerships."
            ],
            channel: "Korean business directories, industry associations, trade events and verified partners"
        }
    };

    function getValue(id) {
        const el = document.getElementById(id);
        return el ? el.value.trim() : "";
    }

    function getCountries() {
        if (window.GBNTargetCountries) {
            return window.GBNTargetCountries.getSelected();
        }

        const select = document.getElementById("targetCountry");
        return select
            ? Array.from(select.selectedOptions).map(x => x.value)
            : [];
    }

    function makeBuyers(product, role) {
        const r = role.toLowerCase();
        let buyers = [
            "End customers and organisations that need " + product,
            "Commercial purchasing and procurement teams",
            "Specialist distributors and resellers",
            "Retailers, wholesalers or service partners where relevant",
            "Strategic businesses and complementary partners"
        ];

        if (/exporter|manufacturer|supplier/.test(r)) {
            buyers.unshift("Importers and verified commercial purchasing companies");
            buyers.unshift("Distributors and wholesale buyers");
        } else if (/importer|buyer|purchas/.test(r)) {
            buyers.unshift("Manufacturers and verified suppliers");
            buyers.unshift("Exporters and wholesale supply partners");
        } else if (/service provider|freelancer|consultant/.test(r)) {
            buyers.unshift("Individuals and organisations purchasing the service");
            buyers.unshift("Businesses seeking specialist service providers");
        } else if (/retailer|wholesaler|distributor/.test(r)) {
            buyers.unshift("Manufacturers and product supply partners");
            buyers.unshift("Retail and wholesale purchasing businesses");
        } else if (/investor/.test(r)) {
            buyers.unshift("Businesses seeking investment or strategic capital");
            buyers.unshift("Founders and companies seeking investment partners");
        } else if (/partner|agency/.test(r)) {
            buyers.unshift("Businesses seeking strategic cooperation");
            buyers.unshift("Complementary service and distribution partners");
        }

        return [...new Set(buyers)].slice(0, 7);
    }

    function getCountryInfo(country) {
        return countryData[country] || {
            focus: [
                "Identify local customers and organisations purchasing this specific product or service.",
                "Verify the country's current business, licensing and category-specific requirements.",
                "Research local competitors, distribution channels and commercial purchasing practices.",
                "Investigate language, payment, logistics and customer support requirements."
            ],
            channel: "Official business directories, local chambers, industry associations and verified partners"
        };
    }

    function addHeading(parent, value) {
        const h = document.createElement("h4");
        h.textContent = value;
        parent.appendChild(h);
    }

    function addList(parent, values) {
        const ul = document.createElement("ul");
        values.forEach(value => {
            const li = document.createElement("li");
            li.textContent = value;
            ul.appendChild(li);
        });
        parent.appendChild(ul);
    }

    function addTag(parent, value) {
        const tag = document.createElement("span");
        tag.className = "buyer-keyword";
        tag.textContent = value;
        parent.appendChild(tag);
    }

    function renderAnalyzerReports(product, category, role, model, countries) {
        const buyers = makeBuyers(product, role);
        const segments = document.getElementById("buyerSegments");
        const research = document.getElementById("marketResearch");
        const categories = document.getElementById("buyerCategories");
        const keywords = document.getElementById("buyerKeywords");
        const gaps = document.getElementById("marketGapList");
        const profile = document.getElementById("buyerProfile");

        [segments, research, categories, keywords, gaps, profile]
            .forEach(el => { if (el) el.replaceChildren(); });

        countries.forEach(country => {
            const info = getCountryInfo(country);

            if (segments) {
                addHeading(segments, "Potential buyer groups — " + country);
                addList(segments, buyers.map(x => x + " in " + country));
            }

            if (research) {
                addHeading(research, "Country research focus — " + country);
                const priorities = [...info.focus,
                    "Research relevant sales and partnership channels: " + info.channel + ".",
                    "Verify all findings through official and independently reliable sources."
                ];

                if (model === "Online") {
                    priorities.push("Assess online customer acquisition, digital platforms and local payment options.");
                } else if (model === "Offline") {
                    priorities.push("Assess physical customer access, premises and local distribution coverage.");
                } else if (model === "Hybrid") {
                    priorities.push("Compare digital acquisition with physical sales or service delivery.");
                }

                addList(research, priorities);
            }

            if (categories) {
                addHeading(categories, country);
                addList(categories, buyers);
            }

            if (keywords) {
                addHeading(keywords, "Buyer search ideas — " + country);
                [
                    product + " buyers " + country,
                    product + " distributors " + country,
                    product + " purchasing companies " + country,
                    product + " business partners " + country,
                    category + " companies " + country
                ].forEach(term => addTag(keywords, term));
            }

            if (gaps) {
                addHeading(gaps, country + " — questions to validate");
                addList(gaps, [
                    "Which local customer groups actively purchase " + product + "?",
                    "What unmet customer requirements can be supported by independent evidence?",
                    "Which local competitors and alternatives already serve these customers?"
                ]);
            }
        });

        if (profile) {
            addList(profile, [
                "Product or service: " + product,
                "Business category: " + (category || "Open / custom category"),
                "Business role: " + role,
                "Operating model: " + (model || "Not specified"),
                "Target countries: " + countries.join(", "),
                "Research framework: Universal and country-adapted",
                "Evidence status: Research guidance; buyer records and live market data are not verified"
            ]);
        }

        const summary = document.getElementById("reportSummary");
        if (summary) {
            summary.textContent =
                "Universal business research guidance for " + product +
                " across " + countries.length + " selected markets. " +
                "Category: " + (category || "Open / custom") +
                ". Role: " + role + ".";
        }
    }

    form.addEventListener("submit", function () {
        const product = getValue("productName");
        const category = getValue("businessCategory");
        const role = getValue("businessType");
        const model = getValue("businessModel");
        const countries = getCountries();

        if (!product || !role || countries.length < 2 || countries.length > 10) return;

        renderAnalyzerReports(product, category, role, model, countries);
    });

    const compareButton = document.getElementById("gbnCompareButton");
    if (compareButton) {
        compareButton.addEventListener("click", function () {
            const selected = Array.from(
                document.querySelectorAll('input[name="gbnCompareCountry"]:checked')
            ).map(el => el.value);

            const results = document.getElementById("gbnCompareResults");
            const message = document.getElementById("gbnCompareMessage");
            if (!results || !message) return;

            if (selected.length < 2 || selected.length > 10) return;

            const product = getValue("productName");
            const category = getValue("businessCategory");
            const role = getValue("businessType");
            const model = getValue("businessModel");

            if (!product || !role) return;

            const buyers = makeBuyers(product, role);
            const fragment = document.createDocumentFragment();

            selected.forEach(country => {
                const info = getCountryInfo(country);
                const card = document.createElement("article");
                card.className = "gbn-cc-card gbn-ci-card";

                const title = document.createElement("h3");
                title.textContent = country;
                card.appendChild(title);

                const profile = document.createElement("p");
                profile.textContent =
                    "Product / service: " + product +
                    " | Category: " + (category || "Open") +
                    " | Role: " + role +
                    " | Model: " + (model || "Not specified");
                card.appendChild(profile);

                addHeading(card, "Potential buyer groups");
                addList(card, buyers);

                addHeading(card, "Country-specific research focus");
                addList(card, info.focus);

                addHeading(card, "Suggested buyer search phrases");
                addList(card, [
                    product + " buyers " + country,
                    product + " distributors " + country,
                    product + " procurement " + country,
                    product + " business partnerships " + country
                ]);

                addHeading(card, "Research channels to investigate");
                addList(card, [info.channel]);

                addHeading(card, "Validation before business decisions");
                addList(card, [
                    "Verify company identity and purchasing activity.",
                    "Check current official rules for this exact product, service and business model.",
                    "Confirm buyer requirements, commercial terms and payment arrangements.",
                    "Treat unverified demand, prices and competitor claims as unknown."
                ]);

                fragment.appendChild(card);
            });

            results.replaceChildren(fragment);
            message.textContent =
                "Country-specific research plans prepared for " +
                selected.length + " countries. These are research prompts, not verified live market data.";
        });
    }

    window.GBNCountryIntelligence = {
        version: "1.0.0",
        getCountryResearch: function (country) {
            return getCountryInfo(country);
        }
    };
});