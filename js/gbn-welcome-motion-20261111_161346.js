document.addEventListener("DOMContentLoaded", function () {
  const hero = document.getElementById("gbn-welcome-hero");
  if (!hero) return;

  const glow = hero.querySelector(".gbn-welcome-glow");
  if (!glow) return;

  hero.addEventListener("pointermove", function (event) {
    const rect = hero.getBoundingClientRect();
    glow.style.left = (event.clientX - rect.left) + "px";
    glow.style.top = (event.clientY - rect.top) + "px";
    hero.classList.add("gbn-pointer-active");
  });

  hero.addEventListener("pointerleave", function () {
    hero.classList.remove("gbn-pointer-active");
  });
});
