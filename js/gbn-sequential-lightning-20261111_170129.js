(() => {
  const hero = document.getElementById("gbn-welcome-hero");
  if (!hero || hero.dataset.sequentialLightning === "on") return;
  hero.dataset.sequentialLightning = "on";

  const message = "WELCOME TO GLOBAL BUSINESS NETWORK";
  hero.innerHTML = "";

  const title = document.createElement("h1");
  title.className = "gbn-welcome-title";
  title.setAttribute("aria-label", message);

  Array.from(message).forEach((character, index) => {
    const span = document.createElement("span");
    span.className = "gbn-letter";
    span.textContent = character;
    title.appendChild(span);
    window.setTimeout(() => span.classList.add("is-visible"), 180 + index * 115);
  });

  const layer = document.createElement("div");
  layer.className = "gbn-lightning-layer";
  layer.setAttribute("aria-hidden", "true");
  hero.appendChild(layer);
  hero.appendChild(title);

  let pointer = null;
  let lastSpawn = 0;

  const svgNS = "http://www.w3.org/2000/svg";

  function makePath(x1, y1, x2, y2, segments, spread) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy) || 1;
    const px = -dy / length;
    const py = dx / length;
    let d = `M ${x1} ${y1}`;

    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      const offset = (Math.random() - .5) * spread * 2;
      const x = x1 + dx * t + px * offset;
      const y = y1 + dy * t + py * offset;
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    d += ` L ${x2} ${y2}`;
    return d;
  }

  function addStroke(svg, d, className) {
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", d);
    path.setAttribute("class", className);
    svg.appendChild(path);
  }

  function flashBolt() {
    if (!pointer) return;

    const rect = hero.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (!width || !height) return;

    const titleRect = title.getBoundingClientRect();
    const cx = titleRect.left + titleRect.width / 2 - rect.left;
    const cy = titleRect.top + titleRect.height / 2 - rect.top;
    const distance = Math.hypot(pointer.x - cx, pointer.y - cy);
    if (distance > Math.max(width, height) * .72) return;

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.classList.add("gbn-lightning-svg", "gbn-bolt");

    const startX = pointer.x + (Math.random() - .5) * 100;
    const startY = pointer.y + (Math.random() - .5) * 70;
    const endX = Math.max(5, Math.min(width - 5, cx + (Math.random() - .5) * titleRect.width));
    const endY = Math.max(5, Math.min(height - 5, cy + (Math.random() - .5) * titleRect.height));

    const main = makePath(startX, startY, endX, endY, 12, 24);
    addStroke(svg, main, "gbn-bolt-glow");
    addStroke(svg, main, "gbn-bolt-core");

    if (Math.random() > .25) {
      const bx = startX + (endX - startX) * (.35 + Math.random() * .3);
      const by = startY + (endY - startY) * (.35 + Math.random() * .3);
      const branchX = Math.max(0, Math.min(width, bx + (Math.random() - .5) * 150));
      const branchY = Math.max(0, Math.min(height, by + (Math.random() - .5) * 130));
      const branch = makePath(bx, by, branchX, branchY, 6, 13);
      addStroke(svg, branch, "gbn-bolt-glow");
      addStroke(svg, branch, "gbn-bolt-core");
    }

    layer.appendChild(svg);
    window.setTimeout(() => svg.remove(), 260);
  }

  hero.addEventListener("pointermove", event => {
    const rect = hero.getBoundingClientRect();
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  });

  hero.addEventListener("pointerleave", () => {
    pointer = null;
  });

  function lightningLoop() {
    if (pointer) {
      const rect = hero.getBoundingClientRect();
      const titleRect = title.getBoundingClientRect();
      const cx = titleRect.left + titleRect.width / 2 - rect.left;
      const cy = titleRect.top + titleRect.height / 2 - rect.top;
      const distance = Math.hypot(pointer.x - cx, pointer.y - cy);
      const proximity = Math.max(0, 1 - distance / Math.max(rect.width, rect.height));
      const interval = 850 - proximity * 680;
      const now = performance.now();

      if (now - lastSpawn > interval) {
        flashBolt();
        if (proximity > .58 && Math.random() > .35) flashBolt();
        lastSpawn = now;
      }
    }
    window.setTimeout(lightningLoop, 65);
  }

  lightningLoop();
})();
