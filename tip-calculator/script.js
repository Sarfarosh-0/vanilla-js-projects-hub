(() => {
  "use strict";

  const CURRENCY = "$";
  const DEFAULT_TIP = 15;

  const billInput = document.getElementById("bill");
  const customInput = document.getElementById("custom-tip");
  const peopleInput = document.getElementById("people");
  const presetButtons = document.querySelectorAll(".preset");
  const resetButton = document.getElementById("reset");
  const form = document.getElementById("calc-form");

  const errors = {
    bill: document.getElementById("bill-error"),
    tip: document.getElementById("tip-error"),
    people: document.getElementById("people-error"),
  };

  const output = {
    tipAmount: document.getElementById("tip-amount"),
    totalBill: document.getElementById("total-bill"),
    tipPerPerson: document.getElementById("tip-per-person"),
    totalPerPerson: document.getElementById("total-per-person"),
  };

  let selectedPreset = DEFAULT_TIP; // null when a custom tip is in use

  const formatMoney = (value) => `${CURRENCY}${value.toFixed(2)}`;

  function setError(input, messageEl, message) {
    messageEl.textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function highlightPreset(value) {
    presetButtons.forEach((button) => {
      const isActive = value !== null && Number(button.dataset.tip) === value;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function readBill() {
    if (billInput.value === "") {
      setError(billInput, errors.bill, "");
      return 0;
    }
    const bill = parseFloat(billInput.value);
    if (!Number.isFinite(bill) || bill < 0) {
      setError(billInput, errors.bill, "Enter a bill amount of 0 or more.");
      return 0;
    }
    setError(billInput, errors.bill, "");
    return bill;
  }

  function readTipPercent() {
    if (selectedPreset !== null) {
      setError(customInput, errors.tip, "");
      return selectedPreset;
    }
    const tip = parseFloat(customInput.value);
    if (!Number.isFinite(tip) || tip < 0 || tip > 100) {
      setError(customInput, errors.tip, "Enter a tip between 0 and 100.");
      return 0;
    }
    setError(customInput, errors.tip, "");
    return tip;
  }

  function readPeople() {
    if (peopleInput.value === "") {
      setError(peopleInput, errors.people, "");
      return 1;
    }
    const people = parseFloat(peopleInput.value);
    if (!Number.isInteger(people) || people < 1) {
      setError(
        peopleInput,
        errors.people,
        "Enter a whole number of 1 or more.",
      );
      return 1;
    }
    setError(peopleInput, errors.people, "");
    return people;
  }

  function calculate() {
    const bill = readBill();
    const tipPercent = readTipPercent();
    const people = readPeople();

    const tipAmount = bill * (tipPercent / 100);
    const totalBill = bill + tipAmount;

    output.tipAmount.textContent = formatMoney(tipAmount);
    output.totalBill.textContent = formatMoney(totalBill);
    output.tipPerPerson.textContent = formatMoney(tipAmount / people);
    output.totalPerPerson.textContent = formatMoney(totalBill / people);
  }

  presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedPreset = Number(button.dataset.tip);
      customInput.value = "";
      highlightPreset(selectedPreset);
      calculate();
    });
  });

  customInput.addEventListener("input", () => {
    if (customInput.value === "") {
      // Custom field cleared: go back to the default preset.
      selectedPreset = DEFAULT_TIP;
    } else {
      selectedPreset = null;
    }
    highlightPreset(selectedPreset);
    calculate();
  });

  billInput.addEventListener("input", calculate);
  peopleInput.addEventListener("input", calculate);

  form.addEventListener("submit", (event) => event.preventDefault());

  resetButton.addEventListener("click", () => {
    billInput.value = "";
    customInput.value = "";
    peopleInput.value = "1";
    selectedPreset = DEFAULT_TIP;
    highlightPreset(selectedPreset);
    calculate();
    billInput.focus();
  });

  highlightPreset(selectedPreset);
  calculate();
})();
