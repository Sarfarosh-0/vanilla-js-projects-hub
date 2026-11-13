const Decrement = document.getElementById("Decrement");
const Increment = document.getElementById("Increment");
const Reset = document.getElementById("Reset");
const Count = document.getElementById("Count");

let count = 0;

Decrement.addEventListener("click", () => {
  if (0 === count) {
    alert("Sorry this is not allowed");
  } else {
    count--;
    Count.textContent = count;
  }
});

Increment.addEventListener("click", () => {
  count++;
  Count.textContent = count;
});

Reset.addEventListener("click", () => {
  count = 0;
  Count.textContent = count;
});

function activateWithKeyboard(e) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    e.currentTarget.click();
  }
}

[Decrement, Increment, Reset].forEach((control) => {
  control.addEventListener("keydown", activateWithKeyboard);
});
