(() => {
    const button = document.querySelector(".gbn-login-submit");
    if (!button || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = document.createElement("canvas");
    canvas.className = "gbn-electricity-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let mouse = { x: -1000, y: -1000, active: false };
    let w = 0, h = 0, dpr = 1;

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = innerWidth;
        h = innerHeight;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    addEventListener("resize", resize);

    addEventListener("pointermove", e => {
        if (e.pointerType === "mouse" || e.pointerType === "pen") {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.active = true;
        }
    });

    document.addEventListener("mouseleave", () => mouse.active = false);

    function bolt(x1, y1, x2, y2, spread, alpha) {
        const points = [{x:x1, y:y1}];
        const segments = 8;

        for (let i = 1; i < segments; i++) {
            const t = i / segments;
            points.push({
                x: x1 + (x2 - x1) * t + (Math.random() - .5) * spread,
                y: y1 + (y2 - y1) * t + (Math.random() - .5) * spread
            });
        }
        points.push({x:x2, y:y2});

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = "#168bff";
        ctx.lineWidth = 5;
        ctx.shadowColor = "#168bff";
        ctx.shadowBlur = 20;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = "#e6faff";
        ctx.lineWidth = 1.5;
        ctx.shadowColor = "#b7eaff";
        ctx.shadowBlur = 14;
        ctx.stroke();

        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);

        if (mouse.active) {
            const r = button.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            const distance = Math.hypot(mouse.x - cx, mouse.y - cy);

            if (distance < 560) {
                const power = 1 - distance / 560;
                const alpha = .35 + power * .65;

                // Lightning flashes outward from the button edges
                for (let i = 0; i < 3; i++) {
                    const side = Math.floor(Math.random() * 4);
                    let sx, sy;

                    if (side === 0) {
                        sx = r.left + Math.random() * r.width;
                        sy = r.top;
                    } else if (side === 1) {
                        sx = r.right;
                        sy = r.top + Math.random() * r.height;
                    } else if (side === 2) {
                        sx = r.left + Math.random() * r.width;
                        sy = r.bottom;
                    } else {
                        sx = r.left;
                        sy = r.top + Math.random() * r.height;
                    }

                    const angle = Math.atan2(sy - mouse.y, sx - mouse.x);
                    const length = 24 + Math.random() * 65 * power;

                    bolt(
                        sx, sy,
                        sx + Math.cos(angle) * length,
                        sy + Math.sin(angle) * length,
                        13, alpha
                    );
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
})();
