(() => {
    const hero = document.getElementById("gbn-welcome-hero");
    if (!hero) return;

    hero.innerHTML = `
        <div class="gbn-welcome-electric">
            <h1 class="gbn-welcome-title">WELCOME TO GLOBAL BUSINESS NETWORK</h1>
        </div>
    `;

    const title = hero.querySelector(".gbn-welcome-title");
    const originalText = title.textContent;
    title.textContent = "";

    Array.from(originalText).forEach((character, index) => {
        const letter = document.createElement("span");

        if (character === " ") {
            letter.className = "gbn-letter gbn-letter-space";
            letter.innerHTML = "&nbsp;";
        } else {
            letter.className = "gbn-letter";
            letter.textContent = character;
        }

        letter.style.setProperty("--letter-delay", `${index * 0.075}s`);
        title.appendChild(letter);
    });

    const electricArea = hero.querySelector(".gbn-welcome-electric");

    function createLightning() {
        const bolt = document.createElement("span");
        bolt.className = "gbn-lightning";

        const x = 5 + Math.random() * 90;
        const y = 8 + Math.random() * 75;

        bolt.style.left = `${x}%`;
        bolt.style.top = `${y}%`;
        bolt.style.transform = `rotate(${Math.random() * 50 - 25}deg)`;

        electricArea.appendChild(bolt);
        setTimeout(() => bolt.remove(), 750);
    }

    function lightningLoop() {
        createLightning();

        if (Math.random() > 0.45) {
            setTimeout(createLightning, 180);
        }

        setTimeout(lightningLoop, 650 + Math.random() * 1100);
    }

    setTimeout(lightningLoop, 500);
})();
