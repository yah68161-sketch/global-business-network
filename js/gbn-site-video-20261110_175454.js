(function () {
    function installGBNBackground() {
        if (document.getElementById("gbn-site-background-video")) return;

        const video = document.createElement("video");
        video.id = "gbn-site-background-video";
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "auto";

        const source = document.createElement("source");
        source.src = "http://127.0.0.1:5517/intro.mp4";
        source.type = "video/mp4";
        video.appendChild(source);

        const overlay = document.createElement("div");
        overlay.id = "gbn-site-background-overlay";

        document.body.prepend(overlay);
        document.body.prepend(video);

        video.play().catch(function () {});
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", installGBNBackground);
    } else {
        installGBNBackground();
    }
})();
