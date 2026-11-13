// Function to Change the Date
function UpdateDate() {
  const date = new Date();
  document.getElementById("Month").textContent = date.toLocaleDateString(
    "en-us",
    { month: "long" },
  );
  document.getElementById("Date").textContent = date.getDate() + ",";
  document.getElementById("Year").textContent = date.getFullYear();
  document.getElementById("WeekDay").textContent = date.toLocaleDateString(
    "en-us",
    { weekday: "long" },
  );
}
UpdateDate();
setInterval(UpdateDate, 60000);

let Hour12;
let Hour24;

function padTime(value) {
  return String(value).padStart(2, "0");
}

function renderClock(hours, minutes, seconds) {
  document.getElementById("Hour").textContent = padTime(hours);
  document.getElementById("Minutes").textContent = padTime(minutes);
  document.getElementById("Seconds").textContent = padTime(seconds);
}

// Function to Update AM and PM
function UpdateMeridiem() {
  const date = new Date();
  const meridiem = document.getElementById("Am_Pm");

  if (meridiem) {
    meridiem.textContent = date.getHours() >= 12 ? "PM" : "AM";
  }
}

//Function For 24 Hour Clock
function UpdateClock24() {
  const date = new Date();

  document.getElementById("AM_PM").style.display = "none";
  renderClock(date.getHours(), date.getMinutes(), date.getSeconds());
}

//Function For 12 Hour Clock
function UpdateClock12() {
  const date = new Date();
  const hours = date.getHours() % 12 || 12;

  document.getElementById("AM_PM").style.display = "block";
  renderClock(hours, date.getMinutes(), date.getSeconds());
  UpdateMeridiem();
}

function startClock(format) {
  clearInterval(Hour12);
  clearInterval(Hour24);
  Hour12 = null;
  Hour24 = null;

  if (format === "12") {
    UpdateClock12();
    Hour12 = setInterval(UpdateClock12, 1000);
  } else {
    UpdateClock24();
    Hour24 = setInterval(UpdateClock24, 1000);
  }
}

// Changing the Theme
const lightBtn = document.querySelector(".light");
const darkBtn = document.querySelector(".dark");

lightBtn.addEventListener("click", () => {
  document.documentElement.setAttribute("data-theme", "light");
});

darkBtn.addEventListener("click", () => {
  document.documentElement.setAttribute("data-theme", "dark");
});

// Calling the 12 Hour Clock on Click
const format12 = document.getElementById("Format_12");
const format24 = document.getElementById("Format_24");

function handleFormatKeydown(event, format) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    startClock(format);
  }
}

format12.addEventListener("click", () => {
  startClock("12");
});

format12.addEventListener("keydown", (event) => {
  handleFormatKeydown(event, "12");
});

// Calling the 24 Hour Clock on Click
format24.addEventListener("click", () => {
  startClock("24");
});

format24.addEventListener("keydown", (event) => {
  handleFormatKeydown(event, "24");
});

// Show the clock immediately instead of waiting for a format click.
startClock("12");
