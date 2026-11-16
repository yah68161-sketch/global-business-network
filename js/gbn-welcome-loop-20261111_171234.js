(() => {
  function startWelcomeLoop() {
    const hero = document.getElementById("gbn-welcome-hero");
    const title = hero?.querySelector(".gbn-welcome-title");

    if (!title) {
      window.setTimeout(startWelcomeLoop, 250);
      return;
    }

    const letters = Array.from(title.querySelectorAll(".gbn-letter"));

    if (!letters.length) {
      window.setTimeout(startWelcomeLoop, 250);
      return;
    }

    if (hero.dataset.welcomeLoop === "on") return;
    hero.dataset.welcomeLoop = "on";

    letters.forEach(letter => {
      if (!letter.textContent.trim()) {
        letter.classList.add("gbn-space");
      }
    });

    function runCycle() {
      // All letters disappear together
      letters.forEach(letter => {
        letter.classList.remove("is-visible");
      });

      // Then appear again one by one
      window.setTimeout(() => {
        letters.forEach((letter, index) => {
          window.setTimeout(() => {
            letter.classList.add("is-visible");
          }, index * 145);
        });

        // Hold the complete message, then repeat
        const revealTime = letters.length * 145;
        window.setTimeout(runCycle, revealTime + 3000);
      }, 950);
    }

    // Let the first original reveal finish before starting the loop
    window.setTimeout(runCycle, 5200);
  }

  startWelcomeLoop();
})();
