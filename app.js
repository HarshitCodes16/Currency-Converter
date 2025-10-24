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

function populateFromDropdown() {
    for (let code in codes) {
            let option = document.createElement("option");
            option.value = code;
            option.textContent = code;
            selectFrom.appendChild(option);
        }
}

function populateToDropdown() {
    for (let code in codes) {
            let option = document.createElement("option");
            option.value = code;
            option.textContent = code;
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

    const response = await fetch(`https://latest.currency-api.pages.dev/v1/currencies/${selectedFrom.toLowerCase()}.json`);
    const data = await response.json();
    console.log(data);

    let resultText = "";

    let rate = data[selectedFrom.toLowerCase()][selectedTo.toLowerCase()];
        resultText = rate
            ? `${amount} ${selectedFrom} = ${(rate * amount).toFixed(2)} ${selectedTo}`
            : "Conversion rate not found.";

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

    // Set selected
    selectFrom.value = selectedFrom;
    selectTo.value = selectedTo;

    updateFlags();

    // The previous conversion message remains.
});

// --- INITIAL LOAD ---
window.addEventListener("DOMContentLoaded", () => {
    populateFromDropdown(); // From: all currencies
    populateToDropdown();    // To: all currencies
    selectFrom.value = "EUR";
    selectTo.value = selectedTo;
    updateFlags();
});


