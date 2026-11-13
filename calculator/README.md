# Neon Calculator

A stylish calculator styled with Tailwind CSS featuring a retro dual-line display and glowing button effects.

## What it does
- Performs fundamental arithmetic operations (addition, subtraction, multiplication, division).
- Supports grouping with parentheses and treats `%` as "divide by 100" (for example, `50%` becomes `0.5`).
- Shows real-time operation history on the top sub-display and active input on the primary display.
- Supports both mouse/touch clicks and physical keyboard entry.
- Handles decimal input, backspace, and clearing gracefully without invalid syntax crashes.

## How to use
1. Open `index.html` in your browser.
2. Click on the buttons or use number and operator keys on your keyboard.
3. Use the `(` and `)` buttons (or keys) to group parts of an expression.
4. Press `Enter` or `=` to calculate the result.
5. Press `Escape` or `C` to clear the calculation.

## Concepts practiced
- Event listeners for both click and `keydown` events
- State management for multi-step arithmetic expressions
- String manipulation and operator precedence handling
- Tailwind CSS styling for responsive layouts and glow effects

## What I learned
I learned how to manage edge cases in calculation inputs (e.g. repeated decimal points, consecutive operator presses) and how to map keyboard shortcuts to corresponding UI buttons.

## Credits
Built by [Sarfarosh-0](https://github.com/Sarfarosh-0).
