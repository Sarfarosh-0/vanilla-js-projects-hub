# 🚀 JavaScript Vanilla Projects

A collection of 13 frontend projects built with vanilla **HTML5**, **CSS3 / Tailwind CSS v4**, and **ES6+ JavaScript**. Each project targets a specific core concept: DOM manipulation, state management, browser APIs, and async control flow. No frameworks.

> Learning by building.

---

## 🛠️ What This Repo Demonstrates

- **No framework dependency:** plain JavaScript rendering with direct DOM updates.
- **State-driven UI:** *To-Do App v2* and *Expense Tracker* keep data in a single array and re-render from it, synced to `localStorage`.
- **Responsive layouts:** fluid sizing with `clamp()`, Flexbox, Grid, and CSS custom properties.
- **Modular JS:** the Expense Tracker and Weather App split logic across ES modules.

---

## 📂 Projects

| Project | Summary | Key concepts |
|:--|:--|:--|
| [`WEATHER-APP`](./WEATHER-APP/index.html) | Weather dashboard using the OpenWeatherMap API: current conditions, hourly forecast, popular-city lookup, background that changes with the weather. | `fetch` + `async/await`, dynamic rendering, date/time formatting |
| [`EXPENSE-TRACKER`](./EXPENSE-TRACKER) ([Live](https://stellar-basbousa-142e5f.netlify.app/#overview)) | Transaction ledger split into storage, calculation, and template modules. | ES modules, data mapping, reducer-style calculations, form handling |
| [`02-TO-DO-APP`](./02-TO-DO-APP/index.html) | To-do app with one central state array, `localStorage` persistence, All / Active / Completed filters, task counter, and dark/light theme. | `localStorage`, `splice`/`push`, `filter`, theme via HTML attributes |
| [`CALCULATOR`](./CALCULATOR/index.html) | Calculator styled entirely with Tailwind v4 utilities, dual display, glowing active states. | Tailwind v4, expression evaluation, keyboard + mouse input |
| [`BMI-CALCULATOR`](./BMI-CALCULATOR/index.html) | BMI tool with unit conversion, feet/inches string parsing, color-coded categories, and auto-reset after 30s of inactivity. | String parsing, input validation, `setTimeout`/`clearTimeout`, conic-gradient |
| [`ROCK-PAPER-SCISSORS`](./ROCK-PAPER-SCISSORS/index.html) | Game that compares the player's choice against a random computer choice. | Array lookup, `Math.random`, score updates |
| [`NUMBER-GUESSING-GAME`](./NUMBER-GUESSING-GAME/index.html) | Guessing game with range tracking, attempt count, and hints. | Random integers, session state |
| [`DIGITAL CLOCK`](<./DIGITAL CLOCK/index.html>) | Live clock with locale-formatted time. | `Date`, `setInterval`, `padStart` |
| [`LOGIN-SIGNUP-PAGE`](./LOGIN-SIGNUP-PAGE/index.html) | Mock login/signup flow with real-time email, password, and confirm-password validation. | Regex validation, `preventDefault`, multi-page flow |
| [`COLOR-CHANGER-2`](./COLOR-CHANGER-2/index.html) | Random color generator that updates the page background. | Random color generation, event bubbling |
| [`COLOR-CHANGER-1`](./COLOR-CHANGER-1/index.html) | Random hex generator and a button-based background switcher. | Hex string generation, DOM style updates, class toggling |
| [`COUNTER-APP`](./COUNTER-APP/index.html) | Counter that changes style when the value goes below or above zero. | State updates, class toggling by value |
| [`01-TO-DO-APP`](./01-TO-DO-APP/index.html) | To-do list that builds and removes DOM nodes directly (v1, no central state). | `createElement`, click events, `closest("li")`, `trim()` |

---

## ⚡ Tech Stack

- **HTML5:** semantic structure
- **CSS3:** variables, Grid, Flexbox, transitions, conic-gradients
- **Tailwind CSS v4:** used in the Calculator
- **JavaScript (ES6+):** modules, `localStorage`, `fetch`, `async/await`

---

## 🚀 Run Locally

```bash
git clone https://github.com/Sarfarosh-0/JavaScript-Vanilla-Projects.git
cd JavaScript-Vanilla-Projects
```

Each project is self-contained. Open its `index.html` in a browser, or use a local server such as the VS Code Live Server extension.

The Weather App needs your own OpenWeatherMap API key.
