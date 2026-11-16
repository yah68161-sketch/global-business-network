(async function () {
    "use strict";

    const loginPage = "/pages/login.html";

    try {
        const response = await fetch("/api/auth/me", {
            method: "GET",
            credentials: "include",
            headers: { "Accept": "application/json" }
        });

        if (!response.ok) {
            window.location.replace(loginPage);
            return;
        }

        const data = await response.json();

        if (!data.success || !data.user) {
            window.location.replace(loginPage);
            return;
        }

        const user = data.user;
        const business = user.business || {};

        const nameElement = document.getElementById("gbnUserName");
        const businessElement = document.getElementById("gbnUserBusiness");
        const avatarElement = document.getElementById("gbnUserAvatar");

        if (nameElement) {
            nameElement.textContent = user.fullName || "GBN Member";
        }

        if (businessElement) {
            const businessName = business.businessName || "Business profile";
            const country = business.country || "";
            businessElement.textContent = country
                ? businessName + " · " + country
                : businessName;
        }

        if (avatarElement) {
            const initials = (user.fullName || "GB")
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map(part => part.charAt(0).toUpperCase())
                .join("");

            avatarElement.textContent = initials || "GB";
        }

        const logoutButton = document.getElementById("gbnLogoutButton");

        if (logoutButton) {
            logoutButton.addEventListener("click", async function () {
                logoutButton.disabled = true;

                try {
                    const logoutResponse = await fetch("/api/auth/logout", {
                        method: "POST",
                        credentials: "include"
                    });

                    if (!logoutResponse.ok) {
                        throw new Error("Logout request failed.");
                    }

                    window.location.replace(loginPage);
                } catch (error) {
                    logoutButton.disabled = false;
                    alert("Logout failed. Please try again.");
                }
            });
        }

    } catch (error) {
        console.error("GBN Dashboard authentication error:", error);
        window.location.replace(loginPage);
    }
})();
