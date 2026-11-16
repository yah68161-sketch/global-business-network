(async function loadGBNMembersBreakdown() {
    const buyersOutput = document.getElementById("gbnTotalBuyers");
    const suppliersOutput = document.getElementById("gbnTotalSuppliers");

    if (!buyersOutput || !suppliersOutput) return;

    try {
        const response = await fetch("/api/auth/dashboard-members-breakdown", {
            method: "GET",
            credentials: "include",
            headers: { "Accept": "application/json" }
        });

        if (response.status === 401) {
            window.location.href = "login.html";
            return;
        }

        if (!response.ok) {
            throw new Error("Members breakdown API request failed.");
        }

        const data = await response.json();

        if (
            !data.success ||
            !Number.isInteger(data.totalBuyers) ||
            !Number.isInteger(data.totalSuppliers)
        ) {
            throw new Error("Invalid members breakdown response.");
        }

        buyersOutput.textContent = data.totalBuyers.toLocaleString();
        suppliersOutput.textContent = data.totalSuppliers.toLocaleString();

    } catch (error) {
        console.error("GBN buyers and suppliers error:", error);
        buyersOutput.textContent = "Unavailable";
        suppliersOutput.textContent = "Unavailable";
    }
})();