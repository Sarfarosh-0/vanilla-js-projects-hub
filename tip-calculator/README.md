# Tip Calculator

A simple tip calculator that works out the tip, the total bill, and what each person pays when the bill is split, updating live as you type.

## What it does
- Takes a bill amount and a tip percentage, using preset buttons (5%, 10%, 15%, 20%) or a custom value.
- Splits the bill among any number of people.
- Displays the tip amount, total bill, tip per person, and total per person, updated as you type.
- Shows a clear error message for invalid input and includes a Reset button.

## How to use
1. Open `index.html` in your browser.
2. Enter the bill amount.
3. Pick a preset tip or type a custom percentage.
4. Enter the number of people splitting the bill.
5. Read the tip and the total per person. Click "Reset" to start over.

## Concepts practiced
- Reading and validating form input with `parseFloat()` and `Number.isInteger()`
- Listening for `input` and `click` events to update the page live
- Toggling classes and `aria-pressed` to show the active preset button
- Formatting money values with `toFixed(2)`
- Guarding against edge cases such as an empty bill or zero people

## What I learned
This project helped solidify turning form input into reliable numbers, handling invalid values gracefully, and keeping the displayed results in sync with the inputs.

## Credits
Built by [mohdhamza-4](https://github.com/mohdhamza-4).