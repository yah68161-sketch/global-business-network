(async function loadGBNLiveOpportunities() {
    const output = document.getElementById("gbnTotalOpportunities");

    if (!output) return;

    try {
        const response = await fetch("/api/auth/dashboard-opportunities", {
            method: "GET",
            credentials: "include",
            headers: { "Accept": "application/json" }
        });

        if (response.status === 401) {
            window.location.href = "login.html";
            return;
        }

        if (!response.ok) {
            throw new Error("Opportunity API request failed.");
        }

        const data = await response.json();

        if (
            !data.success ||
            !Number.isInteger(data.totalActiveOpportunities)
        ) {
            throw new Error("Invalid opportunity response.");
        }

        output.textContent =
            data.totalActiveOpportunities.toLocaleString();

    } catch (error) {
        console.error("GBN opportunities error:", error);
        output.textContent = "Unavailable";
    }
})();
