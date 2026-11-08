# Expense Tracker

A modular personal finance ledger application built with ES modules and localStorage persistence.

## What it does
- Records income and expense entries with descriptions, dates, and amounts.
- Calculates total balance, total income, and total expenses dynamically.
- Categorizes transactions and allows sorting and filtering.
- Persists all financial records in browser `localStorage`.
- Provides quick clearing and entry deletion options.

## How to use
1. Open `index.html` in your web browser (or via a local dev server for ES module support).
2. Click "Add Income" or "Add Expense" to open the transaction modal.
3. Fill out the date, amount, category, and description, then confirm.
4. Review your ledger summary and individual transaction cards in real time.

## Concepts practiced
- Modular JavaScript architecture with ES modules
- Form validation and date processing
- Array aggregation and calculation patterns (`reduce`, `filter`)
- Scoped Web Storage persistence (`localStorage`)
- Modal management and keyboard listeners (`Enter`, `Escape`)

## What I learned
Structuring the project across separate modules (storage, calculations, template rendering) made the codebase much easier to reason about and maintain compared to a single monolithic script.

## Credits
Built by [Sarfarosh-0](https://github.com/Sarfarosh-0). Live demo available at [Netlify](https://stellar-basbousa-142e5f.netlify.app/#overview).
