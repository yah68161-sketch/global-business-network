const globalBusinesses = [
 {name:"BD Fashion House",country:"Bangladesh",industry:"Garments & Textiles",type:"Manufacturer",size:"Medium",description:"Sample garment manufacturing and apparel supplier listing.",products:"T-Shirts, Polo Shirts, Knitwear"},
 {name:"China Tech Group",country:"China",industry:"Electronics",type:"Supplier",size:"Large",description:"Sample electronics and technology supplier listing.",products:"Electronic Components, Smart Devices"},
 {name:"Green Agro Ltd",country:"India",industry:"Agriculture & Food",type:"Exporter",size:"Medium",description:"Sample agricultural products and food export listing.",products:"Agricultural Products, Seeds"},
 {name:"Pacific Trade Hub",country:"Singapore",industry:"Import & Export",type:"Distributor",size:"Large",description:"Sample international trading business listing.",products:"Consumer Goods, Industrial Products"},
 {name:"Tokyo Digital Works",country:"Japan",industry:"Technology & IT",type:"Service Provider",size:"Small",description:"Sample digital technology service listing.",products:"Software, Digital Services"},
 {name:"Seoul Manufacturing Co",country:"South Korea",industry:"Automotive",type:"Manufacturer",size:"Large",description:"Sample automotive manufacturing listing.",products:"Automotive Parts, Components"},
 {name:"Dubai Global Supplies",country:"United Arab Emirates",industry:"Wholesale & Retail",type:"Wholesaler",size:"Medium",description:"Sample wholesale distribution listing.",products:"Consumer Products, General Goods"},
 {name:"Istanbul Trade Network",country:"Turkey",industry:"Construction & Materials",type:"Supplier",size:"Medium",description:"Sample construction materials supplier listing.",products:"Building Materials, Hardware"},
 {name:"Berlin Green Energy",country:"Germany",industry:"Energy & Environment",type:"Manufacturer",size:"Large",description:"Sample renewable energy business listing.",products:"Solar Equipment, Energy Systems"},
 {name:"London Finance Solutions",country:"United Kingdom",industry:"Finance & Business Services",type:"Service Provider",size:"Small",description:"Sample business support service listing.",products:"Business Consulting, Financial Services"},
 {name:"New York Market Link",country:"United States",industry:"Wholesale & Retail",type:"Buyer",size:"Large",description:"Sample international purchasing business listing.",products:"Consumer Goods, Retail Products"},
 {name:"Sao Paulo Agro Trade",country:"Brazil",industry:"Agriculture & Food",type:"Exporter",size:"Large",description:"Sample agricultural export business listing.",products:"Coffee, Food Products"},
 {name:"Nairobi Digital Connect",country:"Kenya",industry:"Technology & IT",type:"Service Provider",size:"Small",description:"Sample technology service listing.",products:"IT Services, Software"},
 {name:"Sydney Ocean Imports",country:"Australia",industry:"Import & Export",type:"Importer",size:"Medium",description:"Sample import business listing.",products:"Food, Consumer Products"},
 {name:"Paris Design Studio",country:"France",industry:"Fashion & Lifestyle",type:"Service Provider",size:"Small",description:"Sample design and lifestyle business listing.",products:"Fashion Design, Creative Services"},
 {name:"Riyadh Industrial Group",country:"Saudi Arabia",industry:"Industrial Machinery",type:"Buyer",size:"Large",description:"Sample industrial purchasing business listing.",products:"Industrial Equipment, Machinery"}
];

const globalCountries = [
"Afghanistan","Algeria","Argentina","Australia","Austria","Bahrain","Bangladesh","Belgium","Brazil","Cambodia","Canada","Chile","China","Colombia","Denmark","Egypt","Finland","France","Germany","Ghana","Greece","Hong Kong","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Japan","Jordan","Kenya","Kuwait","Malaysia","Mexico","Nepal","Netherlands","New Zealand","Nigeria","Norway","Oman","Pakistan","Philippines","Poland","Portugal","Qatar","Russia","Saudi Arabia","Singapore","South Africa","South Korea","Spain","Sri Lanka","Sweden","Switzerland","Taiwan","Thailand","Turkey","Ukraine","United Arab Emirates","United Kingdom","United States","Vietnam"
];

const globalIndustries = [
"Agriculture & Food","Automotive","Chemicals","Construction & Materials",
"Education","Electronics","Energy & Environment","Fashion & Lifestyle",
"Finance & Business Services","Garments & Textiles","Healthcare","Industrial Machinery",
"Import & Export","Logistics & Shipping","Technology & IT","Wholesale & Retail"
];

const globalTypes = [
"Buyer","Distributor","Exporter","Importer","Manufacturer","Retailer",
"Service Provider","Supplier","Wholesaler"
];

const countrySelect = document.getElementById("globalCountry");
const industrySelect = document.getElementById("globalIndustry");
const typeSelect = document.getElementById("globalType");
const searchInput = document.getElementById("globalSearch");
const businessGrid = document.getElementById("globalBusinessGrid");
const countLabel = document.getElementById("globalCount");
const pagination = document.getElementById("globalPagination");

let currentPage = 1;
const perPage = 9;

function fillOptions(select, values) {
    values.forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    });
}

fillOptions(countrySelect, globalCountries);
fillOptions(industrySelect, globalIndustries);
fillOptions(typeSelect, globalTypes);

function renderGlobalDirectory() {
    const keyword = searchInput.value.trim().toLowerCase();
    const country = countrySelect.value;
    const industry = industrySelect.value;
    const type = typeSelect.value;
    const size = document.getElementById("globalSize").value;

    const filtered = globalBusinesses.filter(company => {
        const searchable = [
            company.name, company.country, company.industry,
            company.type, company.description, company.products, company.size
        ].join(" ").toLowerCase();

        return searchable.includes(keyword)
            && (!country || company.country === country)
            && (!industry || company.industry === industry)
            && (!type || company.type === type)
            && (!size || company.size === size);
    });

    const totalPages = Math.ceil(filtered.length / perPage);
    if (totalPages && currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * perPage;
    const visible = filtered.slice(start, start + perPage);

    countLabel.textContent = filtered.length + " sample listings found";

    businessGrid.innerHTML = "";

    if (!visible.length) {
        businessGrid.innerHTML = '<div class="directory-empty">No matching listings found. Try changing your filters.</div>';
    }

    visible.forEach(company => {
        const card = document.createElement("article");
        card.className = "global-company-card";

        card.innerHTML = `
            <div class="company-card-top">
                <span class="company-country">${company.country}</span>
                <span class="sample-label">SAMPLE LISTING</span>
            </div>
            <h3>${company.name}</h3>
            <p class="company-industry">${company.industry}</p>
            <p>${company.description}</p>
            <div class="company-tags">
                <span>${company.type}</span>
                <span>${company.size} Business</span>
            </div>
            <p class="company-products"><strong>Products:</strong> ${company.products}</p>
        `;

        businessGrid.appendChild(card);
    });

    pagination.innerHTML = "";
    for (let page = 1; page <= totalPages; page++) {
        const button = document.createElement("button");
        button.textContent = page;
        button.className = page === currentPage ? "active-page" : "";
        button.addEventListener("click", () => {
            currentPage = page;
            renderGlobalDirectory();
        });
        pagination.appendChild(button);
    }
}

[searchInput, countrySelect, industrySelect, typeSelect,
 document.getElementById("globalSize")].forEach(control => {
    control.addEventListener("input", () => {
        currentPage = 1;
        renderGlobalDirectory();
    });
    control.addEventListener("change", () => {
        currentPage = 1;
        renderGlobalDirectory();
    });
});

document.getElementById("clearFilters").addEventListener("click", () => {
    searchInput.value = "";
    countrySelect.value = "";
    industrySelect.value = "";
    typeSelect.value = "";
    document.getElementById("globalSize").value = "";
    currentPage = 1;
    renderGlobalDirectory();
});

renderGlobalDirectory();
