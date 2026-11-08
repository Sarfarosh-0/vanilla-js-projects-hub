# 🎯 Starter Issues (Ready to Create on GitHub)

Copy and paste these directly into GitHub Issues to kick off the repository's open-source activity.

---

### Issue 1: [Accessibility] Add aria-label and keyboard focus indicators to Counter App
- **Labels:** `good first issue`, `accessibility`, `beginner-friendly`
- **Body:**
  ```markdown
  ### Description
  The buttons in `counter-app/index.html` (Increase, Decrease, Reset) need explicit `aria-label` attributes and visible keyboard focus outlines (`:focus-visible`) so keyboard and screen reader users can navigate them easily.

  ### Tasks
  - [ ] Add `aria-label` attributes to the three buttons in `counter-app/index.html`.
  - [ ] Ensure visible focus styling exists in `counter-app/style.css` (or inline styles) when navigating via the `Tab` key.
  - [ ] Test in your browser by tabbing through the controls.
  ```

---

### Issue 2: [Feature] Add keyboard shortcuts (`Enter` / `Esc`) to Basic To-Do App
- **Labels:** `good first issue`, `help wanted`
- **Body:**
  ```markdown
  ### Description
  In `basic-todo-app`, pressing the `Enter` key when typing in the input should add the task, and pressing `Escape` while focused on the input should clear the field.

  ### Tasks
  - [ ] Add a `keydown` event listener on the input element in `basic-todo-app/script.js`.
  - [ ] Trigger task creation on `Enter` key.
  - [ ] Clear input text when `Escape` key is pressed.
  - [ ] Verify there are no console errors when opening `index.html`.
  ```

---

### Issue 3: [Enhancement] Add Copy-to-Clipboard button to Color Flipper
- **Labels:** `good first issue`, `help wanted`
- **Body:**
  ```markdown
  ### Description
  When a color is generated in `color-flipper`, users should be able to click a "Copy Hex Code" button to copy the value to their clipboard using `navigator.clipboard.writeText()`, with temporary tooltip feedback ("Copied!").

  ### Tasks
  - [ ] Add a small copy button next to the hex code in `color-flipper/index.html`.
  - [ ] Implement clipboard copy logic in `color-flipper/script.js`.
  - [ ] Show a brief "Copied!" confirmation message.
  ```

---

### Issue 4: [Feature] Add 12-hour / 24-hour toggle button to Digital Clock
- **Labels:** `good first issue`, `help wanted`
- **Body:**
  ```markdown
  ### Description
  Currently, `digital-clock` renders time in a fixed format. Let's add a button that allows users to toggle between 12-hour (with AM/PM) and 24-hour formats.

  ### Tasks
  - [ ] Add a toggle button in `digital-clock/index.html`.
  - [ ] Update time rendering logic in `digital-clock/script.js` to respect the active format flag.
  - [ ] Keep the toggle state persistent during the session.
  ```

---

### Issue 5: [Accessibility] Add `alt` text to weather icons in Weather App
- **Labels:** `good first issue`, `accessibility`
- **Body:**
  ```markdown
  ### Description
  In `weather-app`, some weather icon images lack dynamic descriptive `alt` attributes (such as "Sunny", "Rain shower"), which screen readers require.

  ### Tasks
  - [ ] In `weather-app/JS/script.js` and `weather-app/JS/popular-cities.js`, set the `alt` property of weather `<img>` tags to the weather condition name (e.g. `data.weather[0].description`).
  - [ ] Verify all popular city icons have descriptive alt text.
  ```

---

### Issue 6: [Game Enhancement] Add best score / streak counter to Number Guessing Game
- **Labels:** `good first issue`, `help wanted`
- **Body:**
  ```markdown
  ### Description
  In `number-guessing-game`, track the user's best score (fewest guesses to find the number) using `localStorage` (scoped key: `number-guessing-game:best-score`) and display it on screen.

  ### Tasks
  - [ ] Display "Best Score: X guesses" on the game UI.
  - [ ] Update and save the best score whenever the player wins in fewer attempts.
  - [ ] Ensure key is prefixed with `number-guessing-game:`.
  ```

---

### Issue 7: [Documentation / Screenshots] Add screenshot previews to READMEs
- **Labels:** `good first issue`, `docs`
- **Body:**
  ```markdown
  ### Description
  Several projects would look great with a clean screenshot or animated GIF preview in their `README.md`.

  ### Tasks
  - [ ] Take a clean screenshot of one of the projects (e.g. `calculator`, `todo-app`, or `expense-tracker`).
  - [ ] Save an optimized image (PNG or WebP under 200KB) in an `assets/` subfolder.
  - [ ] Embed the screenshot in the project's `README.md`.
  ```

---

### Issue 8: [New Project] Pomodoro Timer
- **Labels:** `new-project`, `help wanted`
- **Body:**
  ```markdown
  ### Description
  Build a Pomodoro Focus Timer project following the repository rules!

  ### Requirements
  - Folder: `pomodoro-timer/`
  - Required files: `index.html`, `README.md` (with "What I learned"), `project.json`
  - 25-minute work interval, 5-minute break interval
  - Start, Pause, and Reset controls
  - Pure vanilla JS, no frameworks
  ```

---

### Issue 9: [New Project] Memory Match Card Game
- **Labels:** `new-project`, `help wanted`
- **Body:**
  ```markdown
  ### Description
  Build a Memory Match card game in vanilla JavaScript!

  ### Requirements
  - Folder: `memory-card-game/`
  - Required files: `index.html`, `README.md`, `project.json`
  - 4x4 card grid that flips when clicked
  - Matches stay face-up, non-matches flip back over
  - Move counter and timer
  ```

---

### Issue 10: [New Project] Typing Speed Test (WPM)
- **Labels:** `new-project`, `help wanted`
- **Body:**
  ```markdown
  ### Description
  Build a Typing Speed Test application where users type a paragraph and receive their live WPM and accuracy metrics.

  ### Requirements
  - Folder: `typing-speed-test/`
  - Required files: `index.html`, `README.md`, `project.json`
  - Sample paragraph display with visual highlighting for correct/incorrect characters
  - Real-time Words-Per-Minute and Accuracy % calculation
  ```
