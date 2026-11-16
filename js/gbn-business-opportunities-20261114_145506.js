(function(){
"use strict";

const API = "/api/auth";
const $ = id => document.getElementById(id);
let activeTab = "browse";
let browseItems = [];
let mineItems = [];
let adminItems = [];
let isAdmin = false;

async function request(path, options = {}) {
    const response = await fetch(API + path, {
        credentials: "include",
        ...options,
        headers: {
            ...(options.body ? {"Content-Type":"application/json"} : {}),
            ...(options.headers || {})
        }
    });

    let data = {};
    try { data = await response.json(); } catch(e) {}

    if (response.status === 401) {
        window.location.href = "login.html";
        throw new Error("Please log in.");
    }

    if (!response.ok || data.success === false) {
        throw new Error(data.message || "Request failed.");
    }

    return data;
}

function message(text, error = false) {
    const box = $("message");
    box.textContent = text;
    box.classList.toggle("error", error);
    box.style.display = "block";
    window.scrollTo({top:0,behavior:"smooth"});
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    })[char]);
}

function dateText(value) {
    if (!value) return "Date unavailable";
    const date = new Date(value.replace(" ", "T") + (value.includes("Z") ? "" : "Z"));
    return Number.isNaN(date.getTime()) ? escapeHTML(value) :
        date.toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"});
}

function emptyBox(text) {
    return '<div class="gbn-op-empty">' + escapeHTML(text) + '</div>';
}

function card(item, mode) {
    const closed = item.status === "closed";
    const owner = mode === "mine";
    const admin = mode === "admin";
    const actions = (owner || admin) ? `
      <div class="gbn-op-card-actions">
       <button class="gbn-op-btn secondary" data-edit="${Number(item.id)}">Edit</button>
       ${closed ? "" : `<button class="gbn-op-btn danger" data-close="${Number(item.id)}">Close</button>`}
      </div>` : "";

    return `
    <article class="gbn-op-card">
      <div class="gbn-op-meta">
       <span class="gbn-op-tag">${escapeHTML(item.category)}</span>
       <span>${escapeHTML(item.country)}</span>
       <span class="gbn-op-status ${closed ? "closed" : ""}">${closed ? "Closed" : "Active"}</span>
      </div>
      <h3>${escapeHTML(item.title)}</h3>
      <p>${escapeHTML(item.description)}</p>
      <div class="gbn-op-meta">
       <span>${escapeHTML(item.business_name || item.creator_name || "GBN Member")}</span>
       <span>${dateText(item.created_at)}</span>
      </div>
      ${actions}
    </article>`;
}

function renderList(target, items, mode, emptyText) {
    if (!items.length) {
        $(target).innerHTML = emptyBox(emptyText);
        return;
    }
    $(target).innerHTML = items.map(item => card(item, mode)).join("");
}

function filterBrowse() {
    const search = $("searchOp").value.trim().toLowerCase();
    const category = $("filterCategory").value.trim().toLowerCase();
    const country = $("filterCountry").value.trim().toLowerCase();

    const filtered = browseItems.filter(item =>
        (!search || [item.title,item.description,item.category,item.country,item.business_name,item.creator_name]
            .some(value => String(value || "").toLowerCase().includes(search))) &&
        (!category || String(item.category).toLowerCase().includes(category)) &&
        (!country || String(item.country).toLowerCase().includes(country))
    );

    renderList("browseList", filtered, "browse", "No matching active opportunities found.");
}

async function loadBrowse() {
    $("browseList").innerHTML = '<div class="gbn-op-loading">Loading opportunities...</div>';
    const data = await request("/opportunities");
    browseItems = data.opportunities || [];
    filterBrowse();
}

async function loadMine() {
    $("mineList").innerHTML = '<div class="gbn-op-loading">Loading your opportunities...</div>';
    const data = await request("/opportunities/mine");
    mineItems = data.opportunities || [];
    renderList("mineList", mineItems, "mine", "You have not published any opportunities yet.");
}

async function loadAdmin() {
    const data = await request("/opportunities/manage");
    adminItems = data.opportunities || [];
    renderList("adminList", adminItems, "admin", "There are no opportunities to manage.");
}

function switchTab(tab) {
    activeTab = tab;
    document.querySelectorAll(".gbn-op-tab").forEach(button =>
        button.classList.toggle("active", button.dataset.tab === tab)
    );
    $("browsePanel").classList.toggle("gbn-op-hidden", tab !== "browse");
    $("minePanel").classList.toggle("gbn-op-hidden", tab !== "mine");
    $("adminPanel").classList.toggle("gbn-op-hidden", tab !== "admin");

    if (tab === "browse") loadBrowse().catch(error => message(error.message,true));
    if (tab === "mine") loadMine().catch(error => message(error.message,true));
    if (tab === "admin") loadAdmin().catch(error => message(error.message,true));
}

function showForm(item) {
    $("publishPanel").classList.remove("gbn-op-hidden");
    $("formHeading").textContent = item ? "Edit Business Opportunity" : "Publish a Business Opportunity";
    $("submitOpportunity").textContent = item ? "Save Changes" : "Publish Opportunity";
    $("editingId").value = item ? item.id : "";
    $("editingStatus").value = item ? item.status : "active";
    $("opTitle").value = item ? item.title : "";
    $("opCategory").value = item ? item.category : "";
    $("opCountry").value = item ? item.country : "";
    $("opDescription").value = item ? item.description : "";
    $("descriptionCount").textContent = $("opDescription").value.length + " / 3000";
    $("publishPanel").scrollIntoView({behavior:"smooth",block:"start"});
}

function hideForm() {
    $("publishPanel").classList.add("gbn-op-hidden");
    $("opportunityForm").reset();
    $("editingId").value = "";
    $("editingStatus").value = "active";
    $("descriptionCount").textContent = "0 / 3000";
}

async function closeOpportunity(id) {
    if (!confirm("Close this opportunity? It will no longer appear in active listings.")) return;
    try {
        const data = await request("/opportunities/" + id, {method:"DELETE"});
        message(data.message || "Opportunity closed.");
        await refreshAll();
    } catch(error) {
        message(error.message,true);
    }
}

function findItem(id) {
    return [...mineItems,...adminItems].find(item => Number(item.id) === Number(id));
}

async function refreshAll() {
    await loadBrowse();
    if (activeTab === "mine") await loadMine();
    if (activeTab === "admin" && isAdmin) await loadAdmin();
}

document.querySelectorAll(".gbn-op-tab").forEach(button => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
});

$("showPublish").addEventListener("click", () => showForm(null));
$("cancelPublish").addEventListener("click", hideForm);

$("opDescription").addEventListener("input", () => {
    $("descriptionCount").textContent = $("opDescription").value.length + " / 3000";
});

["searchOp","filterCategory","filterCountry"].forEach(id =>
    $(id).addEventListener("input", filterBrowse)
);

document.addEventListener("click", event => {
    const closeButton = event.target.closest("[data-close]");
    if (closeButton) {
        closeOpportunity(Number(closeButton.dataset.close));
        return;
    }

    const editButton = event.target.closest("[data-edit]");
    if (editButton) {
        const item = findItem(Number(editButton.dataset.edit));
        if (item) showForm(item);
    }
});

let opportunityFormSubmitting = false;

$("opportunityForm").addEventListener("submit", async event => {
    event.preventDefault();

    if (opportunityFormSubmitting) return;
    opportunityFormSubmitting = true;

    const submit = $("submitOpportunity");
    submit.disabled = true;
    submit.textContent = "Please wait...";

    try {
        const body = {
            title: $("opTitle").value.trim(),
            category: $("opCategory").value.trim(),
            country: $("opCountry").value.trim(),
            description: $("opDescription").value.trim()
        };

        if (body.title.length < 5 || body.category.length < 2 ||
            body.country.length < 2 || body.description.length < 20) {
            message("Please complete all fields using the minimum required lengths.", true);
            return;
        }

        const editingId = $("editingId").value;
        let data;

        if (editingId) {
            body.status = $("editingStatus").value;
            data = await request("/opportunities/" + editingId, {
                method: "PATCH",
                body: JSON.stringify(body)
            });
        } else {
            data = await request("/opportunities", {
                method: "POST",
                body: JSON.stringify(body)
            });
        }

        hideForm();
        message(data.message || "Your opportunity has been saved.");
        await refreshAll();
        switchTab(editingId ? activeTab : "mine");

    } catch (error) {
        message(error.message, true);
    } finally {
        opportunityFormSubmitting = false;
        submit.disabled = false;
        submit.textContent = $("editingId").value ? "Save Changes" : "Publish Opportunity";
    }
});

async function initialize() {
    try {
        await loadBrowse();

        try {
            await request("/opportunities/manage");
            isAdmin = true;
            $("adminTab").classList.remove("gbn-op-hidden");
        } catch(error) {
            if (error.message === "Please log in.") throw error;
            isAdmin = false;
        }
    } catch(error) {
        message(error.message,true);
    }
}

initialize();
})();
