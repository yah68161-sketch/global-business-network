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

  hero.addEventListener("click", function (event) {
    const ripple = document.createElement("span");
    ripple.style.cssText =
      "position:absolute;z-index:5;pointer-events:none;width:18px;height:18px;" +
      "border:2px solid #ffd36b;border-radius:50%;transform:translate(-50%,-50%);" +
      "animation:gbnWelcomeRipple .8s ease-out forwards;";
    const rect = hero.getBoundingClientRect();
    ripple.style.left = (event.clientX - rect.left) + "px";
    ripple.style.top = (event.clientY - rect.top) + "px";
    hero.appendChild(ripple);
    setTimeout(() => ripple.remove(), 850);
  });

  if (!document.getElementById("gbn-welcome-ripple-style")) {
    const style = document.createElement("style");
    style.id = "gbn-welcome-ripple-style";
    style.textContent =
      "@keyframes gbnWelcomeRipple{to{width:150px;height:150px;opacity:0}}";
    document.head.appendChild(style);
  }
});
