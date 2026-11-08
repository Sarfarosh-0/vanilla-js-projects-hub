# Number Guessing Game

A fun number guessing game that challenges players to discover a secret number within a target range.

## What it does
- Generates a random secret number between 1 and 100 on game start.
- Prompts the user to submit guesses and provides immediate "Too High!" or "Too Low!" feedback.
- Tracks and displays total remaining attempts and previous guess history.
- Handles game win and game over states with restart capability.

## How to use
1. Open `index.html` in your web browser.
2. Enter your guess in the numeric input field and click "Submit Guess".
3. Follow the hints provided after each guess.
4. Try to guess the secret number in as few attempts as possible!

## Concepts practiced
- Pseudo-random number generation with `Math.floor(Math.random() * 100) + 1`
- Conditionals and comparison operators
- Session state tracking (attempt counter, previous guesses array)
- Disabling inputs and rendering replay buttons dynamically

## What I learned
I gained a clear understanding of managing interactive game loops in JavaScript, tracking history across user actions, and resetting game state cleanly.

## Credits
Built by [Sarfarosh-0](https://github.com/Sarfarosh-0).
