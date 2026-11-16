(function (window) {
    "use strict";

    const definitions = [];

    function register(definition) {
        if (!definition || typeof definition !== "object") {
            throw new Error("A valid industry definition is required.");
        }

        if (!definition.id || !definition.name) {
            throw new Error("Industry id and name are required.");
        }

        const id = String(definition.id).trim().toLowerCase();

        const existingIndex = definitions.findIndex(item => item.id === id);

        const normalized = {
            id: id,
            name: String(definition.name),
            keywords: Array.isArray(definition.keywords)
                ? definition.keywords.map(String)
                : [],
            buyers: Array.isArray(definition.buyers)
                ? definition.buyers.map(String)
                : [],
            priorities: Array.isArray(definition.priorities)
                ? definition.priorities.map(String)
                : [],
            searchTerms: Array.isArray(definition.searchTerms)
                ? definition.searchTerms.map(String)
                : []
        };

        if (existingIndex >= 0) {
            definitions[existingIndex] = normalized;
        } else {
            definitions.push(normalized);
        }

        return normalized;
    }

    function resolve(category, product) {
        const text = (String(category || "") + " " +
            String(product || "")).toLowerCase();

        return definitions.find(definition =>
            definition.keywords.some(keyword =>
                text.includes(keyword.toLowerCase())
            )
        ) || null;
    }

    function getAll() {
        return definitions.map(item => ({
            id: item.id,
            name: item.name
        }));
    }

    const api = {
        register: register,
        resolve: resolve,
        getAll: getAll
    };

    // Optional specialist templates. These do not restrict the platform.
    register({
        id: "garments-textiles",
        name: "Garments and Textiles",
        keywords: ["garment", "garments", "apparel", "textile", "clothing", "fashion", "fabric"],
        buyers: [
            "Apparel purchasing companies",
            "Fashion brands and private-label buyers",
            "Textile wholesalers",
            "Retail sourcing teams"
        ],
        priorities: [
            "Investigate buyer specifications and product quality requirements",
            "Check applicable labeling and product standards",
            "Research sourcing and distribution channels",
            "Compare competitor products and independently verified prices"
        ],
        searchTerms: [
            "garment importer",
            "apparel sourcing company",
            "textile wholesaler",
            "private label buyer"
        ]
    });

    register({
        id: "agriculture-food",
        name: "Agriculture and Food",
        keywords: ["agriculture", "agricultural", "farming", "farm", "crop", "food", "rice", "fruit", "vegetable"],
        buyers: [
            "Agricultural product buyers",
            "Food wholesalers",
            "Food processing companies",
            "Grocery purchasing teams"
        ],
        priorities: [
            "Investigate product quality and storage requirements",
            "Check applicable food safety and inspection rules",
            "Research seasonal purchasing patterns",
            "Verify transport and distribution requirements"
        ],
        searchTerms: [
            "agricultural importer",
            "food wholesale buyer",
            "food processing company",
            "produce distributor"
        ]
    });

    register({
        id: "technology",
        name: "Technology and Digital",
        keywords: ["software", "technology", "digital", "computer", "app", "it service", "cybersecurity"],
        buyers: [
            "Technology purchasing teams",
            "Software resellers",
            "Corporate IT departments",
            "Digital service businesses"
        ],
        priorities: [
            "Research competing products and services",
            "Check relevant technology and data regulations",
            "Investigate integration and support requirements",
            "Research reseller and partnership channels"
        ],
        searchTerms: [
            "technology reseller",
            "software buyer",
            "IT procurement",
            "digital service partner"
        ]
    });

    register({
        id: "industrial-equipment",
        name: "Industrial Equipment",
        keywords: ["machine", "machinery", "equipment", "industrial"],
        buyers: [
            "Industrial equipment buyers",
            "Factory procurement departments",
            "Engineering companies",
            "Maintenance and service businesses"
        ],
        priorities: [
            "Research technical specifications",
            "Check applicable product standards",
            "Investigate installation and maintenance expectations",
            "Research spare-parts and after-sales requirements"
        ],
        searchTerms: [
            "industrial equipment buyer",
            "factory procurement",
            "machinery distributor",
            "engineering purchasing"
        ]
    });

    window.GBNIndustryRegistry = api;

})(window);
