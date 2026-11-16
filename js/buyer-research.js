document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("buyerSearchForm");
    const searchResults = document.getElementById("searchResults");
    const searchLinks = document.getElementById("searchLinks");
    const saveForm = document.getElementById("buyerSaveForm");
    const tableBody = document.getElementById("buyerTableBody");
    const buyerCount = document.getElementById("buyerCount");
    const exportButton = document.getElementById("exportBuyers");
    const storageKey = "gbn_buyer_research_records";

    let buyers = [];
    try {
        buyers = JSON.parse(localStorage.getItem(storageKey) || "[]");
        if (!Array.isArray(buyers)) buyers = [];
    } catch {
        buyers = [];
    }

    function saveStorage() {
        localStorage.setItem(storageKey, JSON.stringify(buyers));
    }

    function makeLink(label, url) {
        const link = document.createElement("a");
        link.textContent = label;
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        return link;
    }

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const product = document.getElementById("searchProduct").value.trim();
        const country = document.getElementById("searchCountry").value.trim();
        const category = document.getElementById("buyerType").value;

        if (!product || !country) return;

        const query = `${product} ${category} ${country} company`;
        const encoded = encodeURIComponent(query);

        searchLinks.replaceChildren(
            makeLink("Google Search", `https://www.google.com/search?q=${encoded}`),
            makeLink("Bing Search", `https://www.bing.com/search?q=${encoded}`),
            makeLink("Alibaba", `https://www.google.com/search?q=${encodeURIComponent("site:alibaba.com " + query)}`),
            makeLink("Europages", `https://www.google.com/search?q=${encodeURIComponent("site:europages.com " + query)}`),
            makeLink("Kompass", `https://www.google.com/search?q=${encodeURIComponent("site:kompass.com " + query)}`)
        );

        searchResults.hidden = false;
    });

    function renderBuyers() {
        tableBody.replaceChildren();
        buyerCount.textContent = `${buyers.length} companies saved`;

        if (buyers.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.colSpan = 5;
            cell.textContent = "No companies saved yet.";
            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }

        buyers.forEach((buyer, index) => {
            const row = document.createElement("tr");
            const values = [
                buyer.name,
                buyer.country,
                buyer.website,
                buyer.status
            ];

            values.forEach((value, position) => {
                const cell = document.createElement("td");
                if (position === 2) {
                    const link = document.createElement("a");
                    link.href = buyer.website;
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                    link.textContent = buyer.website;
                    cell.appendChild(link);
                } else {
                    cell.textContent = value;
                }
                row.appendChild(cell);
            });

            const actionCell = document.createElement("td");
            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "delete-buyer";
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => {
                buyers.splice(index, 1);
                saveStorage();
                renderBuyers();
            });
            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);
            tableBody.appendChild(row);
        });
    }

    saveForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const websiteInput = document.getElementById("companyWebsite");
        let website;

        try {
            website = new URL(websiteInput.value.trim());
            if (!["http:", "https:"].includes(website.protocol)) {
                throw new Error("Invalid protocol");
            }
        } catch {
            alert("Please enter a valid website starting with https://");
            return;
        }

        buyers.push({
            name: document.getElementById("companyName").value.trim(),
            country: document.getElementById("companyCountry").value.trim(),
            website: website.href,
            source: document.getElementById("companySource").value.trim(),
            status: document.getElementById("companyStatus").value
        });

        saveStorage();
        renderBuyers();
        saveForm.reset();
    });

    exportButton.addEventListener("click", () => {
        if (buyers.length === 0) {
            alert("There are no saved companies to export.");
            return;
        }

        const columns = ["Company", "Country", "Website", "Source", "Research Status"];
        const rows = buyers.map(b => [b.name, b.country, b.website, b.source, b.status]);
        const csvCell = value => `"${String(value ?? "").replace(/"/g, '""')}"`;
        const csv = [columns, ...rows].map(row => row.map(csvCell).join(",")).join("\r\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "gbn-buyer-research.csv";
        link.click();
        URL.revokeObjectURL(url);
    });

    renderBuyers();
});
