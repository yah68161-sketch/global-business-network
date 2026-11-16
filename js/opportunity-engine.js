const opportunityData = [
    {
        product: "Ready-Made Garments",
        country: "Germany",
        industry: "Garments",
        type: "Import Market",
        description: "Illustrative opportunity for apparel exporters exploring European buyers.",
        tag: "Export Opportunity"
    },
    {
        product: "Fresh Agricultural Products",
        country: "UAE",
        industry: "Agriculture",
        type: "Import Market",
        description: "Illustrative opportunity to explore fresh produce supply partnerships.",
        tag: "Agriculture"
    },
    {
        product: "Business Software Solutions",
        country: "USA",
        industry: "Technology",
        type: "Service Market",
        description: "Illustrative opportunity for software businesses seeking international clients.",
        tag: "Technology"
    },
    {
        product: "Processed Food Products",
        country: "Japan",
        industry: "Food",
        type: "Import Market",
        description: "Illustrative opportunity to investigate food distribution partnerships.",
        tag: "Food Business"
    }
];

function renderOpportunities() {
    const search = document.getElementById("opportunitySearch").value.toLowerCase().trim();
    const country = document.getElementById("opportunityCountry").value;
    const industry = document.getElementById("opportunityIndustry").value;

    const filtered = opportunityData.filter(item => {
        const searchable = (
            item.product + " " + item.country + " " +
            item.industry + " " + item.description
        ).toLowerCase();

        return searchable.includes(search) &&
            (!country || item.country === country) &&
            (!industry || item.industry === industry);
    });

    const grid = document.getElementById("opportunityGrid");
    const count = document.getElementById("opportunityCount");

    count.textContent = filtered.length + " Demo Opportunities";

    if (filtered.length === 0) {
        grid.innerHTML = '<p class="no-opportunities">No matching demo opportunities found.</p>';
        return;
    }

    grid.innerHTML = filtered.map(item => `
        <article class="opportunity-card">
            <span class="opportunity-tag">${item.tag}</span>
            <h3>${item.product}</h3>
            <p class="opportunity-country">${item.country} · ${item.type}</p>
            <p>${item.description}</p>
            <span class="industry-label">${item.industry}</span>
        </article>
    `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("opportunitySearchBtn");

    if (!searchButton) return;

    searchButton.addEventListener("click", renderOpportunities);

    document.getElementById("opportunitySearch")
        .addEventListener("input", renderOpportunities);

    document.getElementById("opportunityCountry")
        .addEventListener("change", renderOpportunities);

    document.getElementById("opportunityIndustry")
        .addEventListener("change", renderOpportunities);

    renderOpportunities();
});