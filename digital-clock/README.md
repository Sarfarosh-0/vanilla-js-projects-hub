# Digital Clock

A lightweight, real-time digital clock built with vanilla JavaScript.

## What it does
- Fetches the user's local system time.
- Formats hours, minutes, and seconds with zero-padding (e.g. `08:05:09`).
- Displays 12-hour or 24-hour time formatting with an AM/PM indicator.
- Automatically refreshes the display every 1,000 milliseconds.

## How to use
1. Open `index.html` in your browser.
2. The clock automatically starts ticking and reflects your system's current time.

## Concepts practiced
- The JavaScript `Date` object (`getHours`, `getMinutes`, `getSeconds`)
- String formatting using `padStart(2, '0')`
- Asynchronous intervals with `setInterval`
- Updating text nodes without layout shifting

## What I learned
I learned how timer intervals work in the browser, how to format time components accurately with zero padding, and how to avoid visual layout jumping as digits change.

## Credits
Built by [Sarfarosh-0](https://github.com/Sarfarosh-0).
