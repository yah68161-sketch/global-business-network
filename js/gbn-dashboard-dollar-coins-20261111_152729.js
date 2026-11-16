(() => {
    if (window.gbnDollarCoinsStarted) return;
    window.gbnDollarCoinsStarted = true;

    const canvas = document.createElement("canvas");
    canvas.id = "gbn-dollar-coin-canvas";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let width, height, dpr;
    const coins = [];

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    window.addEventListener("resize", resize);
    resize();

    function createCoin(x, y) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.2 + Math.random() * 3;

        coins.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.2,
            size: 10 + Math.random() * 10,
            life: 1,
            rotation: Math.random() * 0.5,
            spin: (Math.random() - 0.5) * 0.12
        });
    }

    let lastMove = 0;

    document.addEventListener("pointermove", (event) => {
        const now = performance.now();
        if (now - lastMove < 35) return;
        lastMove = now;

        const amount = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < amount; i++) {
            createCoin(
                event.clientX + (Math.random() - 0.5) * 18,
                event.clientY + (Math.random() - 0.5) * 18
            );
        }
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = coins.length - 1; i >= 0; i--) {
            const c = coins[i];

            c.x += c.vx;
            c.y += c.vy;
            c.vy += 0.025;
            c.vx *= 0.992;
            c.life -= 0.012;
            c.rotation += c.spin;

            if (c.life <= 0) {
                coins.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = Math.max(0, c.life);
            ctx.translate(c.x, c.y);
            ctx.rotate(c.rotation);

            ctx.shadowColor = "#ffc928";
            ctx.shadowBlur = 16;

            const gradient = ctx.createLinearGradient(
                -c.size, -c.size, c.size, c.size
            );
            gradient.addColorStop(0, "#fff3a6");
            gradient.addColorStop(0.45, "#ffc928");
            gradient.addColorStop(1, "#a96b00");

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, c.size, 0, Math.PI * 2);
            ctx.fill();

            ctx.shadowBlur = 0;
            ctx.strokeStyle = "#fff0a0";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.fillStyle = "#654000";
            ctx.font = `bold ${c.size * 1.15}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("$", 0, 1);

            ctx.restore();
        }

        requestAnimationFrame(animate);
    }

    animate();
})();
