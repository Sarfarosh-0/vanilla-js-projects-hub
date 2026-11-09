# First-Time Contributor Guide: Git & Open Source Walkthrough

Welcome! If you have never made a Pull Request (PR) on GitHub before, this guide will walk you through every step, explain key concepts, and show you how to avoid or fix common beginner pitfalls.

---

## 🗺️ The Big Picture

When contributing to an open source project:
1. **Upstream Repository**: The original repository (`Sarfarosh-0/vanilla-js-projects-hub`).
2. **Fork**: Your personal copy of the repository under your own GitHub account.
3. **Local Clone**: The files downloaded onto your computer where you write code.
4. **Branch**: An isolated workspace on your machine for a specific change.
5. **Pull Request (PR)**: A proposal sent from your branch to the upstream repository asking the maintainer to merge your code.

---

## 🛠️ Step-by-Step Instructions

### Step 1: Fork the Repository
1. Navigate to [Sarfarosh-0/vanilla-js-projects-hub](https://github.com/Sarfarosh-0/vanilla-js-projects-hub).
2. Click the **Fork** button near the top-right corner.
3. Keep default settings and click **Create Fork**.

### Step 2: Clone Your Fork Locally
Open your terminal (PowerShell, Command Prompt, or Bash) and clone your fork:
```bash
git clone https://github.com/<YOUR-GITHUB-USERNAME>/vanilla-js-projects-hub.git
cd vanilla-js-projects-hub
```

### Step 3: Configure Remotes
Add the upstream repository so you can easily sync future changes:
```bash
git remote add upstream https://github.com/Sarfarosh-0/vanilla-js-projects-hub.git
git remote -v
```
You should see:
- `origin` pointing to your personal fork.
- `upstream` pointing to the main project repository.

### Step 4: Create a New Branch
**Never make changes directly on `main`.** Always create a feature branch:
```bash
git checkout -b add-my-awesome-project
```
Choose a descriptive branch name in kebab-case (e.g. `fix-calculator-overflow`, `add-memory-game`).

### Step 5: Add or Modify Code
If you are adding a new project:
1. Create a lowercase kebab-case directory at the root (e.g. `memory-game/`).
2. Include the required files:
   - `index.html`
   - `README.md` (with "What I learned" and "Credits")
   - `project.json`
3. Check relative links and verify that everything loads cleanly when opening `index.html`.

### Step 6: Validate Your Changes Locally
We provide a local validation script that mirrors our automated CI checks:
```bash
node scripts/validate.js
```
Fix any errors highlighted in the output before committing.

### Step 7: Commit and Push
Stage only the files for your project:
```bash
git add memory-game/
git commit -m "Add memory-game project"
git push -u origin add-my-awesome-project
```

### Step 8: Open the Pull Request
1. Go to your fork on GitHub in your browser.
2. You will see a banner: **"Compare & pull request"**. Click it.
3. Ensure base repository is `Sarfarosh-0/vanilla-js-projects-hub` (`main`) and head repository is your branch.
4. Fill out the PR template checklist completely.
5. Click **Create pull request**.

---

## ⚠️ Common Mistakes & How to Fix Them

### 1. "Oops, I made commits directly on `main`!"
If you committed changes onto your local `main` instead of a feature branch before pushing:
```bash
# Create a new branch with your current changes
git branch add-my-project

# Reset main back to upstream main
git fetch upstream
git reset --hard upstream/main

# Switch to your new branch
git checkout add-my-project
```

### 2. "My PR says it has merge conflicts!"
Merge conflicts occur when changes in `main` conflict with changes in your branch. To fix:
```bash
# Fetch latest upstream changes
git fetch upstream

# Switch to your branch and rebase
git checkout add-my-project
git rebase upstream/main

# If Git pauses and reports conflicts:
# 1. Open the conflicted files in your editor and resolve the conflict markers
# 2. Stage resolved files:
git add <resolved-file>
# 3. Continue the rebase:
git rebase --continue

# Push updated branch to your fork (requires force-with-lease)
git push origin add-my-project --force-with-lease
```

### 3. "My fork is out of date (How do I sync it?)"
To sync your fork's `main` branch with the latest changes:
```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```
Alternatively, click the **Sync fork** button directly on your GitHub repository page.

### 4. "Git says: permission denied / remote origin not found"
Verify your remote URLs with:
```bash
git remote -v
```
If `origin` is pointing to `Sarfarosh-0/vanilla-js-projects-hub` instead of your username, update it:
```bash
git remote set-url origin https://github.com/<YOUR-GITHUB-USERNAME>/vanilla-js-projects-hub.git
```

---

## 💬 Getting Help
If you ever get stuck, don't worry! Ask in the GitHub Discussions tab or mention your question directly in your pull request. We are here to help you learn!
