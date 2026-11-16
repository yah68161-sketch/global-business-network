(() => {
    if (window.gbnDollarCoinsV2Started) return;
    window.gbnDollarCoinsV2Started = true;

    const oldCanvas = document.getElementById("gbn-dollar-coin-canvas");
    if (oldCanvas) oldCanvas.remove();

    const canvas = document.createElement("canvas");
    canvas.id = "gbn-dollar-coins-canvas-fix";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let w, h, dpr;
    const coins = [];
    let lastSpawn = 0;

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    function spawn(x, y) {
        for (let i = 0; i < 3; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.5 + Math.random() * 4;

            coins.push({
                x: x + (Math.random() - .5) * 15,
                y: y + (Math.random() - .5) * 15,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.5,
                size: 10 + Math.random() * 9,
                life: 1,
                spin: (Math.random() - .5) * .12,
                rotation: Math.random() * 6
            });
        }
    }

    document.addEventListener("mousemove", e => {
        const now = performance.now();
        if (now - lastSpawn < 28) return;
        lastSpawn = now;
        spawn(e.clientX, e.clientY);
    });

    function animate() {
        ctx.clearRect(0, 0, w, h);

        for (let i = coins.length - 1; i >= 0; i--) {
            const c = coins[i];
            c.x += c.vx;
            c.y += c.vy;
            c.vy += .035;
            c.life -= .009;
            c.rotation += c.spin;

            if (c.life <= 0) {
                coins.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = c.life;
            ctx.translate(c.x, c.y);
            ctx.rotate(c.rotation);

            ctx.shadowColor = "#ffd43b";
            ctx.shadowBlur = 20;

            const gold = ctx.createLinearGradient(-c.size, -c.size, c.size, c.size);
            gold.addColorStop(0, "#fff6b0");
            gold.addColorStop(.5, "#ffc928");
            gold.addColorStop(1, "#a96700");

            ctx.fillStyle = gold;
            ctx.beginPath();
            ctx.arc(0, 0, c.size, 0, Math.PI * 2);
            ctx.fill();

            ctx.shadowBlur = 0;
            ctx.strokeStyle = "#fff2a0";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = "#704600";
            ctx.font = `bold ${c.size * 1.2}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("$", 0, 1);
            ctx.restore();
        }

        requestAnimationFrame(animate);
    }

    animate();
})();
