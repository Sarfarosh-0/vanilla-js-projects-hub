# Contributing to Vanilla JS Projects Hub

Thank you for your interest in contributing to **vanilla-js-projects-hub**! Whether you are making your first open source contribution or adding an advanced vanilla JS project, this guide explains our rules, workflow, and expectations.

By opening a pull request, you agree that your contribution is licensed under the repository's [MIT License](LICENSE).

---

## 🧗 Contribution Ladder

We encourage contributors of all skill levels to participate:

- **Level 1 — Quick Fixes**: Fix typos, add missing alt text / accessibility attributes, improve documentation, or submit screenshots.
- **Level 2 — Improvements**: Fix bugs, optimize code, improve responsive design, or add small enhancements to existing projects.
- **Level 3 — New Project**: Add a brand-new vanilla JS project to the hub.

---

## 📋 Rules for Projects

### 1. Folder Structure (Automated Checks)
- **Folder name**: Lowercase kebab-case only, letters only, no numbers (e.g. `pomodoro-timer`).
- **Required files**: Every project directory must contain:
  - `index.html` (main entry point)
  - `README.md` (project documentation with "What I learned")
  - `project.json` (metadata for directory & index generation)
- **Single project per PR**: All changes in your pull request must be contained within that single project folder.
- **Relative paths only**: Always reference local assets relatively (`style.css` or `./style.css`, **never** `/style.css`).

### 2. Technology Constraints
- **Pure Vanilla**: HTML5, CSS3, vanilla JavaScript (ES6+), and standard browser APIs only.
- **No Build Steps**: No Node.js build pipelines (Vite, Webpack, Babel), no `node_modules`, and no committed minified bundles.
- **CDN Whitelist**:
  - CSS / Utility: Tailwind CSS (standalone / CDN)
  - Charts: Chart.js
  - Icons & Fonts: Google Fonts, Font Awesome, Flaticon / Icons8
  - Need another library? Open an issue requesting it! Once approved by the maintainer, it is a single-line update to `cdn-whitelist.json`.

### 3. Security & Safety
- **No tracking or analytics scripts** (no Google Analytics, Hotjar, tracking pixels, etc.).
- **No `eval()` or `document.write()`**, and no obfuscated JavaScript code.
- **No unsafe `innerHTML`** with unvalidated user input.
- **No committed API keys**:
  - Never commit personal or production API keys.
  - Use placeholder constants: `const API_KEY = "YOUR_API_KEY_HERE";`.
  - Mark `"requiresApiKey": true` in `project.json`.

### 4. Quality & Accessibility
- **Works on load**: Opening `index.html` in a web browser must work with zero console errors.
- **Accessibility**: Use semantic HTML, labelled inputs, descriptive `alt` text on images, and sufficient color contrast.
- **Scoped Storage**: Prefix any `localStorage` keys with your project's folder name (e.g., `pomodoro-timer:settings`). Never call `localStorage.clear()`.
- **Originality**: Submit original work or clearly credit original authors and tutorials in the `Credits` section of your README.
- **Reasonable size**: Keep project folders lightweight (typically under 2 MB, optimizing images/SVG).
- **AI Disclosure**: Disclose AI assistance in your PR template (`none` / `some` / `most` and which parts). There is no penalty for using AI, but transparency is required.

---

## 🛠️ `project.json` Specification

Every project requires a `project.json` file in its folder root:

```json
{
  "name": "Pomodoro Timer",
  "description": "A 25/5 focus timer with start, pause, and reset.",
  "author": "your-github-username",
  "difficulty": "beginner",
  "tags": ["timer", "dom", "setinterval"],
  "requiresApiKey": false,
  "contributors": []
}
```

- **`name`**: 3–40 characters.
- **`description`**: Maximum 120 characters.
- **`author`**: Your GitHub username (must match PR author).
- **`difficulty`**: Must be `"beginner"`, `"intermediate"`, or `"advanced"`.
- **`tags`**: Up to 5 lowercase strings.
- **`requiresApiKey`**: `true` or `false`.
- **`contributors`**: Array of GitHub usernames (maintainer updates this upon merge).

---

## 🔄 Step-by-Step Contribution Flow

If you are new to Git and GitHub, read our comprehensive [First Contribution Guide](docs/first-contribution.md).

1. **Find or create an issue**:
   - Check open issues with labels like `good first issue` or `help wanted`.
   - Leave a comment asking to be assigned.
   - *Note:* Issue claims expire after **7 days** if no PR is opened.
2. **Fork the repository** to your personal GitHub account.
3. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<your-username>/vanilla-js-projects-hub.git
   cd vanilla-js-projects-hub
   ```
4. **Create a descriptive branch**:
   ```bash
   git checkout -b add-pomodoro-timer
   ```
5. **Develop and test your project**:
   - Double check all required files (`index.html`, `README.md`, `project.json`).
   - Run the validation script locally:
     ```bash
     node scripts/validate.js
     ```
6. **Commit your changes**:
   ```bash
   git commit -m "Add pomodoro-timer project"
   ```
7. **Push to your fork**:
   ```bash
   git push origin add-pomodoro-timer
   ```
8. **Open a Pull Request** to the `main` branch of this repository. The PR template will load automatically—please fill out all sections.

---

## ⏱️ Review Expectations & Stale Policy

- **Review Target**: *"I aim to review PRs within 7 days. It's a goal, not a guarantee."*
- **Updating others' projects**: Allowed! Small bug fixes and docs improvements will be merged directly. Significant redesigns or rewrites will notify the original author with a 7-day window for feedback before a decision is made.
- **Stale PRs**: If a PR requires changes from the contributor and remains inactive, a friendly reminder will be posted at day 14. If there is no activity by day 30, it will be automatically closed to keep the project queue manageable. Closed PRs can always be reopened once you're ready to continue!

Thank you for contributing and helping make the web open and beginner-friendly!
