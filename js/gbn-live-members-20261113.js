(async function loadGBNLiveMembers() {
    const output = document.getElementById("gbnTotalMembers");

    if (!output) return;

    try {
        const response = await fetch("/api/auth/dashboard-stats", {
            method: "GET",
            credentials: "include",
            headers: { "Accept": "application/json" }
        });

        if (response.status === 401) {
            window.location.href = "login.html";
            return;
        }

        if (!response.ok) {
            throw new Error("Statistics API request failed.");
        }

        const data = await response.json();

        if (!data.success || !Number.isInteger(data.totalBusinessMembers)) {
            throw new Error("Invalid statistics response.");
        }

        output.textContent = data.totalBusinessMembers.toLocaleString();

    } catch (error) {
        console.error("GBN live members error:", error);
        output.textContent = "Unavailable";
    }
})();