document.addEventListener("DOMContentLoaded", function () {
    const results = document.getElementById("gbnCompareResults");

    if (!results) return;

    function getReportData() {
        const cards = Array.from(results.querySelectorAll(".gbn-cc-card"));

        return cards.map(function (card) {
            const title = card.querySelector("h3");
            const profile = card.querySelector("p");

            const sections = [];
            let currentHeading = "General Information";

            Array.from(card.children).forEach(function (element) {
                if (element.tagName === "H4") {
                    currentHeading = element.textContent.trim();
                } else if (element.tagName === "UL") {
                    const items = Array.from(element.querySelectorAll("li"))
                        .map(function (item) {
                            return item.textContent.trim();
                        });

                    sections.push({
                        heading: currentHeading,
                        items: items
                    });
                }
            });

            return {
                country: title ? title.textContent.trim() : "Country",
                profile: profile ? profile.textContent.trim() : "",
                sections: sections
            };
        });
    }

    function csvCell(value) {
        return '"' + String(value == null ? "" : value).replace(/"/g, '""') + '"';
    }

    function downloadCSV() {
        const data = getReportData();

        if (!data.length) {
            alert("Please compare countries before exporting the report.");
            return;
        }

        const rows = [
            ["Country", "Product and Business Role", "Research Section", "Details"]
        ];

        data.forEach(function (country) {
            country.sections.forEach(function (section) {
                section.items.forEach(function (item) {
                    rows.push([
                        country.country,
                        country.profile,
                        section.heading,
                        item
                    ]);
                });
            });
        });

        const csv = "\uFEFF" + rows.map(function (row) {
            return row.map(csvCell).join(",");
        }).join("\r\n");

        const blob = new Blob([csv], {
            type: "text/csv;charset=utf-8;"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "GBN-Country-Comparison-Report-" +
            new Date().toISOString().slice(0, 10) + ".csv";

        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(function () {
            URL.revokeObjectURL(url);
        }, 1000);
    }

    function escapeHTML(value) {
        return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[char];
        });
    }

    function printReport() {
        const data = getReportData();

        if (!data.length) {
            alert("Please compare countries before printing.");
            return;
        }

        const reportCards = data.map(function (country) {
            const sections = country.sections.map(function (section) {
                return `
                    <h3>${escapeHTML(section.heading)}</h3>
                    <ul>
                        ${section.items.map(function (item) {
                            return `<li>${escapeHTML(item)}</li>`;
                        }).join("")}
                    </ul>
                `;
            }).join("");

            return `
                <section class="country-card">
                    <h2>${escapeHTML(country.country)}</h2>
                    <p>${escapeHTML(country.profile)}</p>
                    ${sections}
                </section>
            `;
        }).join("");

        const reportWindow = window.open("", "_blank");

        if (!reportWindow) {
            alert("The report window was blocked. Please allow pop-ups for this site.");
            return;
        }

        reportWindow.document.open();
        reportWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>GBN Country Comparison Report</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        color: #172b45;
                        margin: 32px;
                        line-height: 1.6;
                    }
                    h1 { color: #173b63; }
                    .subtitle { color: #64748b; }
                    .country-card {
                        border: 1px solid #dbe3ed;
                        border-radius: 12px;
                        padding: 22px;
                        margin: 22px 0;
                        page-break-inside: avoid;
                    }
                    .country-card h2 { color: #176b55; }
                    .country-card h3 { font-size: 15px; margin-top: 18px; }
                    li { margin: 7px 0; }
                    .notice {
                        margin-top: 28px;
                        padding-top: 14px;
                        border-top: 1px solid #dbe3ed;
                        color: #64748b;
                        font-size: 12px;
                    }
                    @media print {
                        body { margin: 15mm; }
                        .country-card { break-inside: avoid; }
                    }
                </style>
            </head>
            <body>
                <h1>Global Business Network</h1>
                <h2>Country Comparison Report</h2>
                <p class="subtitle">Generated: ${escapeHTML(new Date().toLocaleString())}</p>
                ${reportCards}
                <p class="notice">
                    Research guidance only. This report does not contain verified
                    live market demand, import statistics, prices, rankings or
                    profitability data. Verify requirements through official sources.
                </p>
                <script>
                    window.onload = function () {
                        window.print();
                    };
                <\/script>
            </body>
            </html>
        `);
        reportWindow.document.close();
    }

    function addExportToolbar() {
        let toolbar = document.getElementById("gbnReportExportToolbar");

        if (!results.children.length) {
            if (toolbar) toolbar.remove();
            return;
        }

        if (toolbar) return;

        toolbar = document.createElement("div");
        toolbar.id = "gbnReportExportToolbar";
        toolbar.className = "gbn-report-export-toolbar";

        const heading = document.createElement("strong");
        heading.textContent = "Export Your Comparison Report";

        const csvButton = document.createElement("button");
        csvButton.type = "button";
        csvButton.textContent = "Download CSV";
        csvButton.className = "gbn-report-export-csv";
        csvButton.addEventListener("click", downloadCSV);

        const printButton = document.createElement("button");
        printButton.type = "button";
        printButton.textContent = "Print / Save PDF";
        printButton.className = "gbn-report-export-print";
        printButton.addEventListener("click", printReport);

        toolbar.appendChild(heading);
        toolbar.appendChild(csvButton);
        toolbar.appendChild(printButton);

        results.parentNode.insertBefore(toolbar, results);
    }

    const observer = new MutationObserver(addExportToolbar);
    observer.observe(results, { childList: true });

    addExportToolbar();
});
