let codes = countryList;

let button = document.querySelector("button");
let BASE_URL = "https://flagsapi.com/";
let selects = document.querySelectorAll(".container select");
let selectFrom = selects[0];
let selectTo = selects[1];
let selectedFrom = "EUR";
let selectedTo = "AED";
let msg = document.querySelector(".msg-container p");
let exchg = document.querySelector(".exchg img");

function populateFromDropdown(isAllOptions) {
    selectFrom.innerHTML = "";
    if (isAllOptions) {
        for (let code in codes) {
            let option = document.createElement("option");
            option.value = code;
            option.textContent = code;
            selectFrom.appendChild(option);
        }
    } else {
        let option = document.createElement("option");
        option.value = "EUR";
        option.textContent = "EUR";
        selectFrom.appendChild(option);
    }
}

function populateToDropdown(isAllOptions) {
    selectTo.innerHTML = "";
    if (isAllOptions) {
        for (let code in codes) {
            let option = document.createElement("option");
            option.value = code;
            option.textContent = code;
            selectTo.appendChild(option);
        }
    } else {
        let option = document.createElement("option");
        option.value = "EUR";
        option.textContent = "EUR";
        selectTo.appendChild(option);
    }
}

function updateFlags() {
    document.querySelector(".from .img img").src = `${BASE_URL}${codes[selectedFrom]}/flat/64.png`;
    document.querySelector(".to .img img").src = `${BASE_URL}${codes[selectedTo]}/flat/64.png`;
}

// --- SELECTION CHANGE HANDLERS: Only change variable/flag, no conversion ---
selectFrom.addEventListener("change", () => {
    selectedFrom = selectFrom.value;
    updateFlags();
});

selectTo.addEventListener("change", () => {
    selectedTo = selectTo.value;
    updateFlags();
});

// --- Amount input change: Only updates stored value, not message ---
document.querySelector(".value #amount").addEventListener("input", () => {
    // No auto conversion, do nothing here
});

// --- AMOUNT CONVERSION ---
async function getAmt(amount) {
    amount = Number(amount);
    if (!amount || amount < 1) amount = 1;

    if (selectedFrom === selectedTo) {
        msg.innerText = "Select two different currencies.";
        return;
    }

    const response = await fetch("https://latest.currency-api.pages.dev/v1/currencies/eur.json");
    const data = await response.json();

    let resultText = "";

    if (selectedFrom === "EUR") {
        let rate = data.eur[selectedTo.toLowerCase()];
        resultText = rate
            ? `${amount} EUR = ${(rate * amount).toFixed(2)} ${selectedTo}`
            : "Conversion rate not found.";
    } else if (selectedTo === "EUR") {
        let rate = data.eur[selectedFrom.toLowerCase()];
        resultText = rate
            ? `${amount} ${selectedFrom} = ${(amount / rate).toFixed(2)} EUR`
            : "Conversion rate not found.";
    } else {
        resultText = "Conversion only possible between EUR and another currency.";
    }

    msg.innerText = resultText;
}

// --- MAIN BUTTON (ONLY ON BUTTON CLICK CONVERT) ---
button.addEventListener("click", (event) => {
    event.preventDefault();
    let amount = document.querySelector(".value #amount").value;
    getAmt(amount);
});

// --- EXCHANGE LOGIC ---
exchg.addEventListener("click", (event) => {
    event.preventDefault();

    // Swap values
    [selectedFrom, selectedTo] = [selectedTo, selectedFrom];

    // Toggle dropdown options
    if (selectedFrom === "EUR") {
        populateFromDropdown(false);
        populateToDropdown(true);
    } else {
        populateFromDropdown(true);
        populateToDropdown(false);
    }

    // Set selected
    selectFrom.value = selectedFrom;
    selectTo.value = selectedTo;

    updateFlags();

    // The previous conversion message remains.
});

// --- INITIAL LOAD ---
window.addEventListener("DOMContentLoaded", () => {
    populateFromDropdown(false); // From: only EUR
    populateToDropdown(true);    // To: all currencies
    selectFrom.value = "EUR";
    selectTo.value = selectedTo;
    updateFlags();
    // Optionally, you can show an initial conversion if you want, or leave blank.
});
