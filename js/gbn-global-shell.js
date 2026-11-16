(function(){
    if (location.pathname.endsWith("global-dashboard.html")) return;
    if (document.body.dataset.gbnShell === "ready") return;

    document.body.dataset.gbnShell = "ready";
    document.body.classList.add("gbn-shell-active");

    const inPages = location.pathname.toLowerCase().includes("/pages/");
    const base = inPages ? "" : "pages/";
    const home = "/";

    const links = [
        ["Dashboard", home, "grid"],
        ["Global Directory", base+"directory.html", "globe"],
        ["Suppliers", base+"suppliers.html", "box"],
        ["Buyers", base+"buyers.html", "users"],
        ["Smart RFQ", base+"rfq.html", "message"],
        ["Opportunity Engine", base+"opportunity-analyzer.html", "chart"],
        ["Country Comparison", base+"opportunity-analyzer.html#gbnCountryComparison", "globe"],
        ["Buyer Research", base+"buyer-research.html", "search"],
        ["Business Opportunities", base+"business-opportunities.html", "briefcase"]
    ];

    const icons = {
        grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
        globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
        box:'<path d="m3 7 9-4 9 4-9 4zM3 7v10l9 4 9-4V7M12 11v10"/>',
        users:'<circle cx="9" cy="8" r="4"/><path d="M2 21v-2a7 7 0 0 1 14 0v2M17 5a4 4 0 0 1 0 7M19 15a5 5 0 0 1 3 5"/>',
        message:'<path d="M4 4h16v13H8l-4 4zM8 9h8M8 13h5"/>',
        chart:'<path d="M3 3v18h18M7 14l4-4 4 3 6-8"/>',
        briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/>',
        search:'<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>'
    };

    const sidebar = document.createElement("aside");
    sidebar.className = "gbn-shell-sidebar";
    sidebar.innerHTML = `
      <div class="gbn-shell-brand">
        <div class="gbn-shell-logo">◎</div>
        <div>GLOBAL<span>BN</span></div>
      </div>
      <div class="gbn-shell-label">MAIN MENU</div>
      <nav class="gbn-shell-nav">
        ${links.map(([name,url,icon]) => `
          <a href="${url}" class="${(location.hash ? url.includes(location.hash) : (!url.includes("#") && location.pathname.toLowerCase().endsWith(url.split("/").pop().toLowerCase()))) ? "active" : ""}">
            <svg viewBox="0 0 24 24">${icons[icon]}</svg>${name}
          </a>`).join("")}
      </nav>
      <div class="gbn-shell-label">ACCOUNT</div>
      <nav class="gbn-shell-nav">
        <a href="${base}login.html"><svg viewBox="0 0 24 24"><path d="M10 17l5-5-5-5M15 12H3M21 3v18"/></svg>Sign In</a>
        <a href="${base}signup.html"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>Create Account</a>
      </nav>
      <div class="gbn-shell-bottom">
        <strong>Global Business Network</strong>
        <p>Connect globally. Discover opportunities. Grow together.</p>
        <a href="${home}">Explore GBN →</a>
      </div>`;

    const topbar = document.createElement("header");
    topbar.className = "gbn-shell-topbar";
    topbar.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px">
        <button class="gbn-shell-toggle" type="button" aria-label="Open menu">☰</button>
        <div><strong>Global Business Network</strong><small>GLOBAL BUSINESS INTELLIGENCE</small></div>
      </div>
      <div class="gbn-shell-tools">
        <input class="gbn-shell-search" type="search" placeholder="Search pages..." aria-label="Search pages">
        <div class="gbn-shell-profile">GB</div>
      </div>`;

    document.body.insertBefore(sidebar, document.body.firstChild);
    document.body.insertBefore(topbar, sidebar.nextSibling);

    topbar.querySelector(".gbn-shell-toggle").addEventListener("click",()=>{
        sidebar.classList.toggle("open");
    });

    topbar.querySelector("input").addEventListener("keydown",event=>{
        if(event.key==="Enter"){
            const term=event.target.value.trim().toLowerCase();
            const found=links.find(item=>item[0].toLowerCase().includes(term));
            if(found) location.href=found[1];
        }
    });
})();
