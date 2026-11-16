document.addEventListener("DOMContentLoaded", function () {
    const select = document.getElementById("targetCountry");
    if (!select) return;

    select.multiple = true;
    select.required = false;
    select.hidden = true;

    const countries = Array.from(select.options)
        .filter(option => option.value)
        .map(option => option.value);

    const wrapper = document.createElement("div");
    wrapper.className = "gbn-target-picker";

    const search = document.createElement("input");
    search.type = "search";
    search.className = "gbn-target-search";
    search.placeholder = "Search and select target countries...";
    search.autocomplete = "off";
    search.setAttribute("aria-label", "Search target countries");

    const count = document.createElement("div");
    count.className = "gbn-target-count";

    const chips = document.createElement("div");
    chips.className = "gbn-target-chips";

    const list = document.createElement("div");
    list.className = "gbn-target-list";
    list.hidden = true;

    wrapper.append(search, count, chips, list);
    select.insertAdjacentElement("afterend", wrapper);

    function selectedCountries() {
        return Array.from(select.selectedOptions).map(option => option.value);
    }

    function update() {
        const selected = selectedCountries();

        count.textContent = selected.length + " / 10 countries selected";

        chips.replaceChildren();

        selected.forEach(country => {
            const chip = document.createElement("span");
            chip.className = "gbn-target-chip";

            const name = document.createElement("span");
            name.textContent = country;

            const remove = document.createElement("button");
            remove.type = "button";
            remove.textContent = "×";
            remove.setAttribute("aria-label", "Remove " + country);
            remove.addEventListener("click", function () {
                const option = Array.from(select.options)
                    .find(item => item.value === country);
                if (option) option.selected = false;
                update();
                renderList();
            });

            chip.append(name, remove);
            chips.appendChild(chip);
        });

        select.dispatchEvent(new Event("change", { bubbles: true }));
    }

    function renderList() {
        const query = search.value.trim().toLowerCase();
        const selected = selectedCountries();

        list.replaceChildren();

        const filtered = countries.filter(country =>
            country.toLowerCase().includes(query)
        );

        filtered.forEach(country => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "gbn-target-option";

            const isSelected = selected.includes(country);
            button.textContent = (isSelected ? "✓  " : "+  ") + country;

            if (isSelected) button.classList.add("selected");

            button.addEventListener("click", function () {
                const option = Array.from(select.options)
                    .find(item => item.value === country);

                if (!option) return;

                if (option.selected) {
                    option.selected = false;
                } else {
                    if (selectedCountries().length >= 10) {
                        count.textContent = "Maximum 10 countries allowed.";
                        return;
                    }
                    option.selected = true;
                }

                update();
                renderList();
                search.focus();
            });

            list.appendChild(button);
        });

        if (filtered.length === 0) {
            const empty = document.createElement("p");
            empty.textContent = "No matching country found.";
            list.appendChild(empty);
        }
    }

    search.addEventListener("focus", function () {
        list.hidden = false;
        renderList();
    });

    search.addEventListener("input", function () {
        list.hidden = false;
        renderList();
    });

    document.addEventListener("click", function (event) {
        if (!wrapper.contains(event.target)) {
            list.hidden = true;
        }
    });

    window.GBNTargetCountries = {
        getSelected: selectedCountries
    };

    update();
});
