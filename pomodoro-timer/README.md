# Pomodoro Focus Timer

A clean, accessible Pomodoro Focus Timer built with pure vanilla HTML, CSS, and JavaScript. Work in focused 25-minute sprints, then recharge with a 5-minute break — all without frameworks or build tools.

## Features

- ⏱️ **25-minute work** and **5-minute break** intervals
- ▶️ **Start**, ⏸️ **Pause**, and 🔄 **Reset** controls
- 🔄 **Auto-switches** from Work → Break (and Break → Work) when the timer reaches zero; waits for you to press Start before counting
- 🎯 **Timestamp-based accuracy** — uses `Date.now()` end-timestamps instead of naive "subtract 1 second" ticks, so the display stays accurate even when the tab is backgrounded
- ♿ **Accessible** — `role="status"` live region for announcements, `:focus-visible` outlines, `aria-disabled` on Start/Pause buttons, semantic `<button>` elements, and sufficient colour contrast
- 🎨 **Respects `prefers-reduced-motion`** — animations are disabled when the user has requested reduced motion
- 💾 **Scoped localStorage** — settings prefixed with `pomodoro-timer:` as required by the repo rules

## How to Run

1. Clone or download this repository.
2. Open `pomodoro-timer/index.html` directly in any modern browser — no server needed.

## How to Use

| Action | Result |
|--------|--------|
| **Start** | Begins (or resumes) the current countdown |
| **Pause** | Freezes the timer mid-session |
| **Reset** | Restores the full Work duration and stops the timer |

When time runs out the timer automatically switches to the next session (Work → Break → Work) and waits for you to press **Start**.

## What I Learned

- **`Date.now()` end-timestamps beat `setInterval` drift** — storing when the timer *should* end and subtracting from the current time on every tick gives a display that is immune to tab-throttling and garbage-collection pauses that skew naive "subtract 1 second" timers.
- **`aria-disabled` vs `disabled`** — using `aria-disabled="true"` keeps buttons keyboard-focusable (important for screen-reader users), whereas the HTML `disabled` attribute silently removes them from the tab order.
- **`role="status"` live regions** — a visually-hidden `<div role="status">` lets screen readers announce session changes without interrupting the user; it is the right tool when you need non-intrusive updates (versus `role="alert"` which interrupts immediately).
- **`prefers-reduced-motion` in CSS** — wrapping animations in `@media (prefers-reduced-motion: no-preference)` lets the browser opt-in to motion rather than opt-out, the safest default for users with vestibular disorders.
- **Scoped localStorage keys** — prefixing every key with the project folder name (e.g. `pomodoro-timer:lastSession`) prevents collisions when multiple projects share the same origin.

## Credits

Built by [YOUR_GITHUB_USERNAME](https://github.com/the-fahyan).
