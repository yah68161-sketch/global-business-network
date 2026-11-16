(function () {
    function initializeCountrySelection() {
        const selector = 'input[name="gbnCompareCountry"]';
        const originalBoxes = Array.from(document.querySelectorAll(selector));

        const message = document.getElementById("gbnCompareMessage");
        const compareButton = document.getElementById("gbnCompareButton");

        if (originalBoxes.length === 0 || !message || !compareButton) {
            console.error("GBN Country Selection: required elements missing.");
            return;
        }

        // Replace old checkbox elements to remove previous event listeners.
        originalBoxes.forEach(function (oldBox) {
            const freshBox = oldBox.cloneNode(true);
            oldBox.parentNode.replaceChild(freshBox, oldBox);
        });

        const boxes = Array.from(document.querySelectorAll(selector));

        function selectedCount() {
            return boxes.filter(function (box) {
                return box.checked;
            }).length;
        }

        function showCount() {
            message.textContent =
                selectedCount() + " of 10 countries selected. Select at least 2.";
        }

        boxes.forEach(function (box) {
            box.addEventListener("change", function () {
                const count = selectedCount();

                if (count > 10) {
                    box.checked = false;
                    message.textContent =
                        "Maximum 10 countries allowed. Your extra selection was cancelled.";
                    return;
                }

                showCount();
            });
        });

        // Validate before the existing comparison button handler runs.
        compareButton.addEventListener("click", function (event) {
            const count = selectedCount();

            if (count < 2 || count > 10) {
                event.stopImmediatePropagation();
                message.textContent =
                    "Please select between 2 and 10 countries.";
            }
        }, true);

        showCount();

        console.log(
            "GBN Country Selection ready:",
            boxes.length,
            "countries available; maximum 10 selectable."
        );
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeCountrySelection,
            { once: true }
        );
    } else {
        initializeCountrySelection();
    }
})();
