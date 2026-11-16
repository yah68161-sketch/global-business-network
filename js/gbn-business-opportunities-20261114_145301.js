(() => {
 "use strict";

 const API = "/api/auth";
 const $ = (id) => document.getElementById(id);
 const state = { all: [], mine: [], admin: [], isAdmin: false, tab: "browse" };

 async function request(path, options = {}) {
   const response = await fetch(API + path, {
     credentials: "include",
     ...options,
     headers: {
       ...(options.body ? { "Content-Type": "application/json" } : {}),
       ...(options.headers || {})
     }
   });

   let data = {};
   try { data = await response.json(); } catch {}

   if (response.status === 401) {
     window.location.href = "/pages/login.html";
     throw new Error("Please log in.");
   }
   if (!response.ok || data.success === false) {
     throw new Error(data.message || "Request could not be completed.");
   }
   return data;
 }

 function showMessage(message, type = "success") {
   const box = $("pageMessage");
   box.textContent = message;
   box.className = "message show " + type;
   window.scrollTo({ top: 0, behavior: "smooth" });
   setTimeout(() => box.classList.remove("show"), 5000);
 }

 function escapeHtml(value) {
   return String(value ?? "").replace(/[&<>"']/g, char => ({
     "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
   })[char]);
 }

 function dateText(value) {
   if (!value) return "Date unavailable";
   const date = new Date(String(value).replace(" ", "T") + (String(value).includes("Z") ? "" : "Z"));
   return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
 }

 function renderCards(items, mode) {
   const target = $("opportunityList");
   if (!items.length) {
     target.innerHTML = '<div class="empty">No opportunities found. Publish an opportunity or change your filters.</div>';
     return;
   }

   target.innerHTML = items.map(item => {
     const owner = Number(item.created_by) === Number(window.gbnCurrentUserId);
     const canManage = owner || state.isAdmin;
     const status = item.status === "closed"
       ? '<span class="pill status-closed">Closed</span>'
       : '<span class="pill">Active</span>';

     return `
       <article class="op-card">
         <div class="meta"><span class="pill">${escapeHtml(item.category)}</span>${status}</div>
         <h3>${escapeHtml(item.title)}</h3>
         <div class="meta">
           <span>${escapeHtml(item.country)}</span>
           <span>·</span>
           <span>${escapeHtml(item.business_name || item.creator_name || "GBN Member")}</span>
           <span>·</span>
           <span>${escapeHtml(dateText(item.created_at))}</span>
         </div>
         <p>${escapeHtml(item.description)}</p>
         ${mode !== "browse" && canManage ? `
           <div class="card-actions">
             <button class="secondary" data-action="edit" data-id="${Number(item.id)}">Edit</button>
             ${item.status === "active" ? `<button class="secondary" data-action="close" data-id="${Number(item.id)}">Close Opportunity</button>` : ""}
           </div>` : ""}
       </article>`;
   }).join("");
 }

 function applyFilters() {
   const term = $("searchOpportunities").value.trim().toLowerCase();
   const category = $("filterCategory").value.trim().toLowerCase();
   const country = $("filterCountry").value.trim().toLowerCase();

   const filtered = state.all.filter(item =>
     (!term || [item.title,item.description,item.business_name,item.creator_name].some(v => String(v || "").toLowerCase().includes(term))) &&
     (!category || String(item.category).toLowerCase().includes(category)) &&
     (!country || String(item.country).toLowerCase().includes(country))
   );
   renderCards(filtered, "browse");
 }

 async function loadBrowse() {
   const data = await request("/opportunities");
   state.all = data.opportunities || [];
   $("browseCount").textContent = state.all.length;
   applyFilters();
 }

 async function loadMine() {
   const data = await request("/opportunities/mine");
   state.mine = data.opportunities || [];
   $("mineCount").textContent = state.mine.length;
   renderCards(state.mine, "mine");
 }

 async function loadAdmin() {
   try {
     const data = await request("/opportunities/manage");
     state.isAdmin = true;
     state.admin = data.opportunities || [];
     $("adminTab").classList.remove("hidden");
     $("adminCount").textContent = state.admin.length;
   } catch (error) {
     state.isAdmin = false;
     $("adminTab").classList.add("hidden");
   }
 }

 async function switchTab(tab) {
   state.tab = tab;
   document.querySelectorAll(".tab").forEach(button =>
     button.classList.toggle("active", button.dataset.tab === tab)
   );
   $("publishPanel").classList.toggle("hidden", tab !== "publish");
   $("filterPanel").classList.toggle("hidden", tab !== "browse");
   $("listPanel").classList.toggle("hidden", tab === "publish");

   if (tab === "browse") await loadBrowse();
   if (tab === "mine") await loadMine();
   if (tab === "admin" && state.isAdmin) {
     const data = await request("/opportunities/manage");
     state.admin = data.opportunities || [];
     $("adminCount").textContent = state.admin.length;
     renderCards(state.admin, "admin");
   }
 }

 async function editOpportunity(id) {
   const item = [...state.mine, ...state.admin].find(x => Number(x.id) === id);
   if (!item) {
     showMessage("Could not find this opportunity. Refresh and try again.", "error");
     return;
   }

   const title = prompt("Opportunity title:", item.title);
   if (title === null) return;
   const category = prompt("Category:", item.category);
   if (category === null) return;
   const country = prompt("Country:", item.country);
   if (country === null) return;
   const description = prompt("Description:", item.description);
   if (description === null) return;
   const status = prompt("Status: type active or closed", item.status);
   if (status === null) return;

   const payload = { title, category, country, description, status: status.trim().toLowerCase() };
   try {
     const result = await request("/opportunities/" + id, {
       method: "PATCH", body: JSON.stringify(payload)
     });
     showMessage(result.message || "Opportunity updated.");
     await refreshCurrent();
   } catch (error) { showMessage(error.message, "error"); }
 }

 async function closeOpportunity(id) {
   if (!confirm("Close this opportunity? It will no longer appear in the active public list.")) return;
   try {
     const result = await request("/opportunities/" + id, { method: "DELETE" });
     showMessage(result.message || "Opportunity closed.");
     await refreshCurrent();
   } catch (error) { showMessage(error.message, "error"); }
 }

 async function refreshCurrent() {
   await loadBrowse();
   if (state.tab === "mine") await loadMine();
   if (state.tab === "admin" && state.isAdmin) {
     const data = await request("/opportunities/manage");
     state.admin = data.opportunities || [];
     $("adminCount").textContent = state.admin.length;
     renderCards(state.admin, "admin");
   }
 }

 async function initialize() {
   try {
     const me = await request("/me");
     const user = me.user || me;
     window.gbnCurrentUserId = user.id || user.userId;
     $("userName").textContent = user.full_name || user.fullName || "GBN Member";
     $("userAvatar").textContent = ($("userName").textContent.trim()[0] || "G").toUpperCase();
     await loadAdmin();
     await loadBrowse();
   } catch (error) {
     if (!String(error.message).includes("Please log in")) {
       showMessage(error.message, "error");
     }
   }
 }

 document.querySelectorAll(".tab").forEach(button => {
   button.addEventListener("click", () => switchTab(button.dataset.tab));
 });

 ["searchOpportunities","filterCategory","filterCountry"].forEach(id =>
   $(id).addEventListener("input", applyFilters)
 );

 $("opportunityForm").addEventListener("submit", async event => {
   event.preventDefault();
   const payload = {
     title: $("title").value.trim(),
     category: $("category").value.trim(),
     country: $("country").value.trim(),
     description: $("description").value.trim()
   };

   if (payload.title.length < 5 || payload.title.length > 160 ||
       payload.category.length < 2 || payload.category.length > 80 ||
       payload.country.length < 2 || payload.country.length > 100 ||
       payload.description.length < 20 || payload.description.length > 3000) {
     showMessage("Please check the required field lengths and try again.", "error");
     return;
   }

   try {
     const result = await request("/opportunities", {
       method: "POST", body: JSON.stringify(payload)
     });
     $("opportunityForm").reset();
     showMessage(result.message || "Opportunity published.");
     await loadBrowse();
     await loadMine();
     await switchTab("browse");
   } catch (error) { showMessage(error.message, "error"); }
 });

 $("opportunityList").addEventListener("click", event => {
   const button = event.target.closest("button[data-action]");
   if (!button) return;
   const id = Number(button.dataset.id);
   if (button.dataset.action === "edit") editOpportunity(id);
   if (button.dataset.action === "close") closeOpportunity(id);
 });

 $("logoutButton").addEventListener("click", async () => {
   try { await request("/logout", { method: "POST" }); } catch {}
   window.location.href = "/pages/login.html";
 });

 initialize();
})();
