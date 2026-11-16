(() => {
    const button = document.querySelector(".gbn-login-submit");
    if (!button || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = document.createElement("canvas");
    canvas.className = "gbn-electricity-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let mouse = { x: -1000, y: -1000, active: false };
    let width = 0, height = 0, dpr = 1;

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    window.addEventListener("resize", resize);
    resize();

    window.addEventListener("pointermove", (event) => {
        if (event.pointerType === "mouse" || event.pointerType === "pen") {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
            mouse.active = true;
        }
    });

    document.addEventListener("mouseleave", () => {
        mouse.active = false;
    });

    function random(min, max) {
        return min + Math.random() * (max - min);
    }

    function drawBolt(x1, y1, x2, y2, segments, spread, alpha, lineWidth) {
        const points = [{ x: x1, y: y1 }];

        for (let i = 1; i < segments; i++) {
            const t = i / segments;
            points.push({
                x: x1 + (x2 - x1) * t + random(-spread, spread),
                y: y1 + (y2 - y1) * t + random(-spread, spread)
            });
        }

        points.push({ x: x2, y: y2 });

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = "#168bff";
        ctx.lineWidth = lineWidth * 4;
        ctx.shadowColor = "#168bff";
        ctx.shadowBlur = 25;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = "#d9f5ff";
        ctx.lineWidth = lineWidth;
        ctx.shadowColor = "#8bdcff";
        ctx.shadowBlur = 15;
        ctx.stroke();

        ctx.restore();

        return points;
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        if (mouse.active) {
            const rect = button.getBoundingClientRect();

            const targetX = Math.max(rect.left, Math.min(mouse.x, rect.right));
            const targetY = Math.max(rect.top, Math.min(mouse.y, rect.bottom));

            const dx = targetX - mouse.x;
            const dy = targetY - mouse.y;
            const distance = Math.hypot(dx, dy);

            if (distance > 12 && distance < 560) {
                const strength = 1 - distance / 560;
                const flicker = random(0.55, 1);
                const alpha = Math.min(1, strength * 1.5) * flicker;

                const points = drawBolt(
                    mouse.x, mouse.y, targetX, targetY,
                    16, 13 * strength + 2, alpha, 1.5 + strength
                );

                // Small electric branches
                if (Math.random() > 0.25) {
                    const index = Math.floor(random(3, points.length - 3));
                    const p = points[index];

                    drawBolt(
                        p.x, p.y,
                        p.x + random(-35, 35) * strength,
                        p.y + random(-35, 35) * strength,
                        5, 8, alpha * 0.75, 1
                    );
                }

                // Electric sparks around the connection
                for (let i = 0; i < 4; i++) {
                    const p = points[Math.floor(random(0, points.length))];
                    ctx.beginPath();
                    ctx.arc(
                        p.x + random(-8, 8),
                        p.y + random(-8, 8),
                        random(1, 2.5),
                        0, Math.PI * 2
                    );
                    ctx.fillStyle = "#d9f5ff";
                    ctx.shadowColor = "#168bff";
                    ctx.shadowBlur = 14;
                    ctx.fill();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
})();
