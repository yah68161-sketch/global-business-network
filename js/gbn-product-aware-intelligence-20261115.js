document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const form = document.getElementById("analyzerForm");
    if (!form) return;

    const patterns = [
        {
            id: "pet-care",
            test: /pet|groom|veterinar|animal|dog|cat|kennel|boarding/i,
            buyers: [
                "Pet owners and households needing grooming services",
                "Veterinary clinics and animal healthcare providers",
                "Pet shops and pet supply businesses",
                "Pet hotels, boarding centres and animal care facilities",
                "Pet service booking platforms and referral partners"
            ],
            gaps: [
                "Do pet owners need convenient home-visit grooming services?",
                "Are appointment availability and waiting times adequate?",
                "Are mobile grooming providers available in underserved areas?",
                "Do customers need specialised grooming for particular breeds or pets?",
                "Are service quality, hygiene and animal-care standards consistent?",
                "Are transparent packages and repeat-service plans available?"
            ],
            priorities: [
                "Identify pet owners and organisations purchasing grooming services",
                "Research local grooming salons and mobile service competitors",
                "Investigate animal-care, hygiene and service-quality expectations",
                "Check local business, animal welfare and service regulations",
                "Research veterinary, pet shop and pet-care referral partnerships",
                "Compare independently verified grooming packages and service prices",
                "Investigate booking, travel coverage and customer retention"
            ],
            keywords: [
                "mobile pet grooming customers",
                "pet grooming business partners",
                "veterinary clinic referral partners",
                "pet shop partnership opportunities",
                "pet boarding service partnerships"
            ]
        },
        {
            id: "education",
            test: /education|learning|school|university|course|tutor|e-learning|training/i,
            buyers: [
                "Students and individual learners",
                "Schools, colleges and universities",
                "Corporate learning and development departments",
                "Professional training institutions",
                "Education distributors and learning-platform partners"
            ],
            gaps: [
                "Are learners satisfied with available course quality and pricing?",
                "Are flexible learning schedules needed?",
                "Are specialised subjects or skills underserved?",
                "Do institutions need digital learning solutions?",
                "Are language and accessibility needs adequately addressed?"
            ],
            priorities: [
                "Identify learners and institutions purchasing the education service",
                "Research competing courses and learning platforms",
                "Investigate accreditation and education requirements",
                "Compare course pricing, teaching quality and learning outcomes",
                "Research institutional and corporate training partnerships",
                "Check applicable digital education and data rules"
            ],
            keywords: [
                "online education buyers",
                "school education partnerships",
                "corporate training buyers",
                "learning platform partners"
            ]
        },
        {
            id: "healthcare",
            test: /health|medical|clinic|hospital|patient|wellness|diagnostic|dental/i,
            buyers: [
                "Patients and individual healthcare customers",
                "Hospitals and healthcare institutions",
                "Clinics and specialist practices",
                "Healthcare procurement departments",
                "Healthcare service and technology partners"
            ],
            gaps: [
                "Are patients able to access the required service conveniently?",
                "Are appointment and service availability gaps present?",
                "Are specialist services underserved?",
                "Are quality and patient experience expectations being met?",
                "Are privacy, safety and regulatory requirements satisfied?"
            ],
            priorities: [
                "Identify the actual users and purchasers of the healthcare service",
                "Research healthcare providers and competing services",
                "Verify licensing and professional requirements",
                "Investigate patient safety and privacy obligations",
                "Research institutional purchasing and partnership channels",
                "Compare independently verified service quality and pricing"
            ],
            keywords: [
                "healthcare service buyers",
                "clinic procurement",
                "hospital service partnerships",
                "healthcare provider networks"
            ]
        },
        {
            id: "logistics",
            test: /logistic|freight|shipping|courier|delivery|transport|warehouse|cargo/i,
            buyers: [
                "Importers and exporters requiring logistics",
                "Manufacturers and trading companies",
                "Retailers and e-commerce businesses",
                "Warehouses and distribution operators",
                "Freight forwarders and logistics partners"
            ],
            gaps: [
                "Are delivery times meeting customer requirements?",
                "Are underserved routes or locations present?",
                "Are tracking and shipment visibility adequate?",
                "Are storage and handling needs being met?",
                "Are customers satisfied with service reliability?"
            ],
            priorities: [
                "Identify businesses purchasing logistics and transport services",
                "Research competing logistics providers and service coverage",
                "Investigate route, storage and handling requirements",
                "Check transport and operating regulations",
                "Research freight, warehouse and distribution partnerships",
                "Compare verified delivery terms and service offers"
            ],
            keywords: [
                "logistics service buyers",
                "freight forwarding partners",
                "warehouse service customers",
                "distribution company partnerships"
            ]
        },
        {
            id: "construction",
            test: /construction|building|architecture|contractor|renovation|interior/i,
            buyers: [
                "Property owners and developers",
                "Construction contractors",
                "Architecture and engineering firms",
                "Commercial property operators",
                "Construction material and service distributors"
            ],
            gaps: [
                "Are customers experiencing delays in project delivery?",
                "Are specialist construction services underserved?",
                "Are material quality and availability consistent?",
                "Are customers satisfied with project communication?",
                "Are maintenance and renovation needs underserved?"
            ],
            priorities: [
                "Identify project owners and construction service purchasers",
                "Research contractors and competing service providers",
                "Investigate technical and building standards",
                "Check permits, insurance and licensing requirements",
                "Research developer and contractor partnerships",
                "Compare independently verified project offers"
            ],
            keywords: [
                "construction service buyers",
                "property developer partnerships",
                "contractor procurement",
                "building service customers"
            ]
        },
        {
            id: "food-hospitality",
            test: /restaurant|catering|food|beverage|bakery|cafe|hospitality|hotel/i,
            buyers: [
                "Individual food and hospitality customers",
                "Restaurants, cafes and hotels",
                "Food retailers and grocery businesses",
                "Catering and event organisations",
                "Food distributors and hospitality partners"
            ],
            gaps: [
                "Are customers satisfied with available choices and service?",
                "Are convenient delivery or booking options needed?",
                "Are specialised food or hospitality services underserved?",
                "Are quality and consistency expectations being met?",
                "Are customer groups or locations underserved?"
            ],
            priorities: [
                "Identify actual food and hospitality service purchasers",
                "Research local competitors and customer preferences",
                "Investigate food safety and operating requirements",
                "Compare quality, service and independently verified prices",
                "Research retail, hospitality and distribution partnerships",
                "Investigate customer acquisition and repeat business"
            ],
            keywords: [
                "restaurant business buyers",
                "hospitality service partnerships",
                "food distribution buyers",
                "catering service customers"
            ]
        },
        {
            id: "professional-services",
            test: /consult|account|legal|marketing|design|agency|freelanc|recruitment|advertising/i,
            buyers: [
                "Individuals and businesses needing specialist services",
                "Small and medium-sized businesses",
                "Corporate departments purchasing professional services",
                "Agencies and service resellers",
                "Strategic professional service partners"
            ],
            gaps: [
                "Are customers satisfied with existing service quality?",
                "Are specialised or affordable services underserved?",
                "Are response times meeting customer expectations?",
                "Are businesses seeking flexible service packages?",
                "Are there unmet requirements in specific customer groups?"
            ],
            priorities: [
                "Identify organisations purchasing the professional service",
                "Research competing agencies and independent providers",
                "Investigate qualifications and professional requirements",
                "Compare service packages and customer expectations",
                "Research referral and strategic partnership channels",
                "Check contracts, privacy and payment requirements"
            ],
            keywords: [
                "professional service buyers",
                "business consulting clients",
                "agency partnership opportunities",
                "corporate service procurement"
            ]
        }
    ];

    function value(id) {
        const el = document.getElementById(id);
        return el ? el.value.trim() : "";
    }

    function countries() {
        return window.GBNTargetCountries
            ? window.GBNTargetCountries.getSelected()
            : [];
    }

    function addList(container, items) {
        if (!container) return;

        const list = document.createElement("ul");

        items.forEach(function (text) {
            const li = document.createElement("li");
            li.textContent = text;
            list.appendChild(li);
        });

        container.appendChild(list);
    }

    function render(id, items) {
        const container = document.getElementById(id);
        if (!container) return;

        container.replaceChildren();
        addList(container, items);
    }

    function getProfile(product, category, role, model) {
        const combined = product + " " + category;

        const match = patterns.find(function (item) {
            return item.test.test(combined);
        });

        if (match) {
            return {
                name: category || match.id,
                id: match.id,
                buyers: match.buyers.slice(),
                gaps: match.gaps.slice(),
                priorities: match.priorities.slice(),
                keywords: match.keywords.slice()
            };
        }

        const service = /service|consult|agency|freelance|repair|training/i
            .test(product + " " + category);

        const buyers = service
            ? [
                "Individuals and businesses needing " + product,
                "Organisations purchasing " + category + " services",
                "Specialist businesses serving the same customers",
                "Service distributors and referral partners",
                "Complementary businesses and strategic partners"
            ]
            : [
                "End users and businesses purchasing " + product,
                "Importers and purchasing organisations",
                "Wholesale and retail distribution businesses",
                "Commercial resellers and channel partners",
                "Organisations requiring products in " + category
            ];

        return {
            name: category || "Open / Custom Business Category",
            id: "unclassified",
            buyers: buyers,
            gaps: [
                "Which customers have a clear need for " + product + "?",
                "What problems do existing products or services fail to solve?",
                "Are customers underserved by current suppliers or providers?",
                "What quality, price and availability expectations exist?",
                "Which customer groups are not adequately served?",
                "What regulatory or technical requirements apply?"
            ],
            priorities: [
                "Identify actual customers purchasing " + product,
                "Research competing products, services and alternatives",
                "Investigate customer requirements and purchasing behaviour",
                "Check relevant laws, standards and operating requirements",
                "Research suitable sales and partnership channels",
                "Compare independently verified commercial offers",
                "Verify potential buyers through reliable official sources"
            ],
            keywords: [
                product + " buyers",
                product + " purchasing organisations",
                product + " business partners",
                category + " companies",
                category + " service providers"
            ]
        };
    }

    function adaptForRole(profile, role) {
        const r = role.toLowerCase();

        if (/exporter|manufacturer|supplier/.test(r)) {
            profile.buyers.unshift(
                "Importers and commercial purchasing companies",
                "Distributors and wholesale buyers"
            );
        } else if (/importer|buyer|purchas/.test(r)) {
            profile.buyers.unshift(
                "Manufacturers and verified product suppliers",
                "Exporters and wholesale supply partners"
            );
        } else if (/service provider|freelancer|consultant/.test(r)) {
            profile.buyers.unshift(
                "Direct customers purchasing the service",
                "Businesses seeking specialist service providers"
            );
        } else if (/retailer|wholesaler|distributor/.test(r)) {
            profile.buyers.unshift(
                "Retail and wholesale purchasing businesses",
                "Manufacturers and supply partners"
            );
        } else if (/investor/.test(r)) {
            profile.buyers.unshift(
                "Businesses seeking investment partnerships",
                "Founders and companies seeking strategic investors"
            );
        } else if (/partner|agency/.test(r)) {
            profile.buyers.unshift(
                "Businesses seeking strategic cooperation",
                "Complementary service and distribution partners"
            );
        }

        profile.buyers = [...new Set(profile.buyers)].slice(0, 7);
    }

    function renderCountries(selected, profile, product, model) {
        const ids = [
            "buyerSegments",
            "marketResearch",
            "buyerCategories",
            "buyerKeywords"
        ];

        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.replaceChildren();
        });

        selected.forEach(function (country) {
            const segments = document.getElementById("buyerSegments");
            const research = document.getElementById("marketResearch");
            const categories = document.getElementById("buyerCategories");
            const keywords = document.getElementById("buyerKeywords");

            if (segments) {
                const h = document.createElement("h4");
                h.textContent = "Potential buyer groups — " + country;
                segments.appendChild(h);
                addList(segments, profile.buyers.map(x => x + " in " + country));
            }

            if (research) {
                const h = document.createElement("h4");
                h.textContent = "Market research priorities — " + country;
                research.appendChild(h);

                let priorities = profile.priorities.slice();

                if (model === "Online") {
                    priorities.push("Investigate online customer acquisition and digital sales channels");
                } else if (model === "Offline") {
                    priorities.push("Investigate local premises, physical access and regional customer reach");
                } else if (model === "Hybrid") {
                    priorities.push("Compare online and physical service or sales channels");
                }

                addList(research, priorities.map(x => x + " (" + country + ")"));
            }

            if (categories) {
                const h = document.createElement("h4");
                h.textContent = country;
                categories.appendChild(h);
                addList(categories, profile.buyers);
            }

            if (keywords) {
                const h = document.createElement("h4");
                h.textContent = country;
                keywords.appendChild(h);

                profile.keywords.forEach(function (term) {
                    const tag = document.createElement("span");
                    tag.className = "buyer-keyword";
                    tag.textContent = term + " " + country;
                    keywords.appendChild(tag);
                });
            }
        });
    }

    form.addEventListener("submit", function () {
        const product = value("productName");
        const category = value("businessCategory");
        const role = value("businessType");
        const model = value("businessModel");
        const selected = countries();

        if (!product || !role || !selected.length || selected.length > 10) return;

        const profile = getProfile(product, category, role, model);
        adaptForRole(profile, role);

        renderCountries(selected, profile, product, model);

        const gaps = [];

        selected.forEach(function (country) {
            profile.gaps.forEach(function (question) {
                gaps.push(country + ": " + question);
            });
        });

        render("marketGapList", selected.flatMap(country => [
            "Research questions for " + country + ":",
            ...profile.gaps.map(question => country + ": " + question)
        ]));

        render("businessGaps", [
            "Investigate the customer problems identified for " + product,
            "Check whether existing competitors adequately serve each target market",
            "Identify underserved customer groups and service requirements",
            "Compare quality, convenience, availability and customer experience",
            "Validate every potential market gap with independent evidence"
        ]);

        render("nextSteps", [
            "Prepare a detailed profile of " + product,
            "Define the ideal customer and purchasing requirements",
            "Research real companies and customers in each selected country",
            "Verify applicable local regulations and business requirements",
            "Compare independently verified competitors and commercial offers",
            "Validate customer interest before making financial commitments"
        ]);

        const summary = document.getElementById("reportSummary");

        if (summary) {
            summary.textContent =
                "Product-aware research guidance for " + product +
                " across " + selected.length + " selected markets: " +
                selected.join(", ") +
                ". Category: " + (category || profile.name) +
                ". Business role: " + role + ".";
        }

        const profileBox = document.getElementById("buyerProfile");

        if (profileBox) {
            profileBox.replaceChildren();

            addList(profileBox, [
                "Product or service: " + product,
                "Business category: " + (category || "Not specified"),
                "Detected research profile: " + profile.id,
                "Business role: " + role,
                "Operating model: " + (model || "Not specified"),
                "Target markets: " + selected.join(", "),
                "Intelligence mode: Product-aware rule-based research guidance"
            ]);

            const mismatch =
                (/mobile|home visit|on-site|grooming|repair|cleaning/i.test(product) &&
                 model === "Online");

            const roleMismatch =
                (/mobile|home visit|on-site|grooming|repair|cleaning/i.test(product) &&
                 /exporter|importer/i.test(role));

            if (mismatch || roleMismatch) {
                const note = document.createElement("p");
                note.className = "gbn-universal-help";
                note.textContent =
                    "Business model validation: Check whether the selected role and operating model accurately describe how this product or service is delivered.";
                profileBox.appendChild(note);
            }
        }

        const explanation = document.getElementById("scoreExplanation");

        if (explanation) {
            explanation.textContent =
                "This readiness score does not measure market demand, profitability or business success. " +
                "The product-aware report provides rule-based research suggestions, not verified buyers, live statistics or confirmed market gaps.";
        }

        const checklist = document.getElementById("buyerChecklist");

        if (checklist) {
            checklist.replaceChildren();

            addList(checklist, [
                "Confirm the organisation or customer is genuine.",
                "Check its official website and business activity.",
                "Verify that its purchasing needs match your offering.",
                "Check local regulatory and operating requirements.",
                "Confirm contact details through official sources.",
                "Review payment terms and business references before commitments."
            ]);
        }

        if (window.GBNTargetCountries) {
            const checkboxes = document.querySelectorAll(
                'input[name="gbnCompareCountry"]'
            );

            checkboxes.forEach(function (checkbox) {
                checkbox.checked = selected.includes(checkbox.value);
                checkbox.disabled = true;
            });
        }

        const message = document.getElementById("gbnCompareMessage");

        if (message) {
            message.textContent = selected.length >= 2
                ? "Target countries synced. You can compare these markets."
                : "Select at least 2 target countries to use Country Comparison.";
        }
    });

    window.GBNProductIntelligence = {
        version: "1.0.0",
        getProfiles: function () {
            return patterns.map(item => ({
                id: item.id,
                buyers: item.buyers.length
            }));
        }
    };
});
