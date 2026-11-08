/* =====================================================================
   Pomodoro Focus Timer — pure vanilla JS
   Uses Date.now() end-timestamps for accuracy (tab-throttle safe).
===================================================================== */

'use strict';

// ── Constants ──────────────────────────────────────────────────────────
const WORK_SECONDS  = 25 * 60;   // 25 minutes
const BREAK_SECONDS =  5 * 60;   //  5 minutes
const CIRCUMFERENCE = 2 * Math.PI * 88; // matches r="88" in SVG

// ── State ──────────────────────────────────────────────────────────────
let mode          = 'work';   // 'work' | 'break'
let running       = false;
let endTime       = null;     // Date.now() ms when current interval ends
let remaining     = WORK_SECONDS;
let tickId        = null;
let pomodorosDone = 0;        // completed work sessions this cycle (0-3)

// ── DOM refs ──────────────────────────────────────────────────────────
const modeLabel     = document.getElementById('mode-label');
const timeDisplay   = document.getElementById('time-display');
const ringCircle    = document.getElementById('ring-progress-circle');
const btnStartPause = document.getElementById('btn-start-pause');
const btnReset      = document.getElementById('btn-reset');
const srStatus      = document.getElementById('sr-status');
const dots          = Array.from(document.querySelectorAll('.dot'));

// ── Ring SVG setup ────────────────────────────────────────────────────
ringCircle.style.strokeDasharray  = CIRCUMFERENCE;
ringCircle.style.strokeDashoffset = 0;

// ── Utility helpers ───────────────────────────────────────────────────

/** Format seconds → "MM:SS" */
function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Update all visual elements to match current state */
function render() {
  const total    = mode === 'work' ? WORK_SECONDS : BREAK_SECONDS;
  const fraction = remaining / total;          // 1 → 0
  const offset   = CIRCUMFERENCE * (1 - fraction);

  // Ring colour + dashoffset
  const ringColor = mode === 'work' ? '#e74c3c' : '#2ecc71';
  ringCircle.style.stroke           = ringColor;
  ringCircle.style.strokeDashoffset = offset;

  // Digital readout
  timeDisplay.textContent = formatTime(remaining);

  // Mode heading
  modeLabel.textContent = mode === 'work' ? 'Work' : 'Break';
  modeLabel.className   = mode; // 'work' | 'break' → CSS colour

  // Start/Pause button label
  btnStartPause.textContent = running ? 'Pause' : 'Start';
  btnStartPause.setAttribute('aria-label', running ? 'Pause timer' : 'Start timer');
  btnStartPause.setAttribute('aria-disabled', 'false');

  // Page title (tab stays informative)
  document.title = `${formatTime(remaining)} — ${mode === 'work' ? 'Focus' : 'Break'} | Pomodoro Timer`;

  // Session dots
  dots.forEach((dot, i) => {
    dot.classList.toggle('filled', i < pomodorosDone);
  });
}

/** Announce a message to screen readers via the live region */
function announce(msg) {
  srStatus.textContent = '';               // reset so repeat messages fire
  requestAnimationFrame(() => {
    srStatus.textContent = msg;
  });
}

// ── Core timer logic ──────────────────────────────────────────────────

function tick() {
  const now      = Date.now();
  const secsLeft = Math.max(0, Math.round((endTime - now) / 1000));

  remaining = secsLeft;
  render();

  if (secsLeft <= 0) {
    onSessionEnd();
  }
}

function startTicking() {
  clearInterval(tickId);
  endTime = Date.now() + remaining * 1000;
  tickId  = setInterval(tick, 250); // poll 4× / sec for responsiveness
  running = true;
  render();
  announce(`${mode === 'work' ? 'Work' : 'Break'} session started. ${formatTime(remaining)} remaining.`);
}

function pauseTicking() {
  clearInterval(tickId);
  tickId  = null;
  running = false;
  render();
  announce(`Timer paused at ${formatTime(remaining)}.`);
}

function onSessionEnd() {
  clearInterval(tickId);
  tickId  = null;
  running = false;

  if (mode === 'work') {
    pomodorosDone = (pomodorosDone + 1) % 4; // cycle 0-3
    mode      = 'break';
    remaining = BREAK_SECONDS;
    announce('Work session complete! Take a 5-minute break. Press Start when you are ready.');
  } else {
    mode      = 'work';
    remaining = WORK_SECONDS;
    announce('Break over. Press Start to begin a new work session.');
  }

  render();
}

// ── Button handlers ───────────────────────────────────────────────────

btnStartPause.addEventListener('click', () => {
  if (btnStartPause.getAttribute('aria-disabled') === 'true') return;
  if (running) {
    pauseTicking();
  } else {
    startTicking();
  }
});

btnReset.addEventListener('click', () => {
  clearInterval(tickId);
  tickId    = null;
  running   = false;
  mode      = 'work';
  remaining = WORK_SECONDS;
  render();
  announce('Timer reset. Ready to start a new work session.');
});

// ── Keyboard: Space / Enter on focused buttons ─────────────────────────
// <button> elements natively handle Enter; Space is also standard for buttons.
// No extra keydown handler needed — browser does it.

// ── Restore last session from localStorage (optional persistence) ──────
(function restoreSession() {
  try {
    const saved = localStorage.getItem('pomodoro-timer:lastSession');
    if (!saved) return;
    const { savedMode, savedRemaining, savedPomodoros } = JSON.parse(saved);
    if (typeof savedMode === 'string' && typeof savedRemaining === 'number') {
      mode          = savedMode;
      remaining     = savedRemaining;
      pomodorosDone = savedPomodoros || 0;
    }
  } catch (_) { /* ignore corrupt data */ }
})();

// Persist state periodically so a page refresh doesn't lose progress
setInterval(() => {
  try {
    localStorage.setItem('pomodoro-timer:lastSession', JSON.stringify({
      savedMode:      mode,
      savedRemaining: remaining,
      savedPomodoros: pomodorosDone
    }));
  } catch (_) { /* storage unavailable — no-op */ }
}, 5000);

// ── Initial render ─────────────────────────────────────────────────────
render();
