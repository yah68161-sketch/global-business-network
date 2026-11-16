document.addEventListener("DOMContentLoaded", function () {
  const hero = document.getElementById("gbn-welcome-hero");
  if (!hero) return;

  const glow = hero.querySelector(".gbn-welcome-glow");

  hero.addEventListener("pointermove", function (event) {
    if (!glow) return;
    const rect = hero.getBoundingClientRect();
    glow.style.left = (event.clientX - rect.left) + "px";
    glow.style.top = (event.clientY - rect.top) + "px";
    hero.classList.add("gbn-pointer-active");
  });

  hero.addEventListener("pointerleave", function () {
    hero.classList.remove("gbn-pointer-active");
  });

  function coinCanvas() {
    return Array.from(document.querySelectorAll("canvas")).filter(function (canvas) {
      const style = getComputedStyle(canvas);
      return style.position === "fixed" && style.pointerEvents === "none";
    });
  }

  hero.addEventListener("pointerenter", function () {
    coinCanvas().forEach(function (canvas) {
      canvas.dataset.gbnOldOpacity = canvas.style.opacity || "";
      canvas.style.opacity = "0";
    });
  });

  hero.addEventListener("pointerleave", function () {
    coinCanvas().forEach(function (canvas) {
      canvas.style.opacity = canvas.dataset.gbnOldOpacity || "";
      delete canvas.dataset.gbnOldOpacity;
    });
  });
});
