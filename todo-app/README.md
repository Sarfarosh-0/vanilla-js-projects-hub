# Advanced To-Do App

A full-featured to-do application that uses a single central state array and persists your tasks across browser sessions.

## What it does
- Manages tasks with unique identifiers, title, and completion status.
- Persists all task data in `localStorage` so items remain after refreshing the page.
- Offers filter views: All, Active, and Completed.
- Displays an active task counter that updates in real time.
- Supports light and dark mode toggling.

## How to use
1. Open `index.html` in your web browser.
2. Enter your task and press Enter or click the add button.
3. Use the filter tabs at the bottom to view only active or completed tasks.
4. Toggle the theme button in the header to switch between light and dark modes.
5. Check items off or delete them when completed.

## Concepts practiced
- Centralized state management in vanilla JS
- Web Storage API (`localStorage.getItem`, `localStorage.setItem`, `JSON.parse`, `JSON.stringify`)
- Array methods (`filter`, `map`, `findIndex`, `splice`)
- Theme toggling using data attributes and CSS custom properties

## What I learned
I learned the difference between maintaining state in JavaScript data structures versus reading/writing to the DOM directly. Centralizing state in an array and re-rendering the UI makes state synchronization and filtering much cleaner and less error-prone.

## Credits
Built by [Sarfarosh-0](https://github.com/Sarfarosh-0).
