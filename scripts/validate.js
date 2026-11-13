const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const WHITELIST_PATH = path.join(ROOT_DIR, "cdn-whitelist.json");

const IGNORED_DIRS = new Set([
  ".git",
  ".github",
  "node_modules",
  "scripts",
  "docs",
  "scratch",
  // Shared assets for the root landing page, not a project folder.
  "assets",
]);

let errors = [];

function addError(folder, msg) {
  errors.push(`[${folder}] ${msg}`);
}

function loadWhitelist() {
  if (!fs.existsSync(WHITELIST_PATH)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(WHITELIST_PATH, "utf8"));
}

function validateFolderName(folder) {
  // Lowercase kebab-case, letters only (no numbers)
  const regex = /^[a-z]+(-[a-z]+)*$/;
  if (!regex.test(folder)) {
    addError(
      folder,
      `Folder name '${folder}' must be lowercase kebab-case without numbers.`,
    );
  }
}

function validateRequiredFiles(folder, dirPath) {
  const required = ["index.html", "README.md", "project.json"];
  for (const file of required) {
    if (!fs.existsSync(path.join(dirPath, file))) {
      addError(folder, `Missing required file: '${file}'`);
    }
  }
}

function validateProjectJson(folder, dirPath) {
  const jsonPath = path.join(dirPath, "project.json");
  if (!fs.existsSync(jsonPath)) return;

  let data;
  try {
    data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  } catch (err) {
    addError(folder, `Invalid JSON in project.json: ${err.message}`);
    return;
  }

  // Name: 3-40 chars
  if (
    typeof data.name !== "string" ||
    data.name.length < 3 ||
    data.name.length > 40
  ) {
    addError(
      folder,
      `project.json 'name' must be a string between 3 and 40 characters.`,
    );
  }

  // Description: max 120 chars
  if (
    typeof data.description !== "string" ||
    data.description.length === 0 ||
    data.description.length > 120
  ) {
    addError(
      folder,
      `project.json 'description' must be a string up to 120 characters.`,
    );
  }

  // Author: non-empty string
  if (typeof data.author !== "string" || data.author.trim() === "") {
    addError(folder, `project.json 'author' must be a non-empty string.`);
  }

  // Difficulty: beginner / intermediate / advanced
  const validDifficulties = ["beginner", "intermediate", "advanced"];
  if (!validDifficulties.includes(data.difficulty)) {
    addError(
      folder,
      `project.json 'difficulty' must be one of: ${validDifficulties.join(", ")}.`,
    );
  }

  // Tags: max 5 lowercase tags
  if (!Array.isArray(data.tags) || data.tags.length > 5) {
    addError(
      folder,
      `project.json 'tags' must be an array of at most 5 items.`,
    );
  } else {
    for (const tag of data.tags) {
      if (
        typeof tag !== "string" ||
        tag !== tag.toLowerCase() ||
        tag.trim() === ""
      ) {
        addError(folder, `Tag '${tag}' must be non-empty and lowercase.`);
      }
    }
  }

  // requiresApiKey: boolean
  if (typeof data.requiresApiKey !== "boolean") {
    addError(folder, `project.json 'requiresApiKey' must be a boolean.`);
  }

  // contributors: array
  if (data.contributors && !Array.isArray(data.contributors)) {
    addError(folder, `project.json 'contributors' must be an array.`);
  }
}

function scanFiles(folder, dirPath, whitelist) {
  function walk(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if ([".html", ".js", ".css"].includes(ext)) {
          checkFileContent(folder, fullPath, ext, whitelist);
        }
      }
    }
  }
  walk(dirPath);
}

function checkFileContent(folder, filePath, ext, whitelist) {
  const content = fs.readFileSync(filePath, "utf8");
  const relativeFilePath = path.relative(ROOT_DIR, filePath);

  // Check for absolute local paths e.g. href="/style.css" or src="/script.js"
  const absolutePathRegex = /(?:href|src)\s*=\s*["']\/(?!\/)[^"']*["']/gi;
  if (absolutePathRegex.test(content)) {
    addError(
      folder,
      `${relativeFilePath} contains absolute paths starting with '/'. Use relative paths instead.`,
    );
  }

  // Check for eval() or document.write()
  if (/\beval\s*\(/.test(content)) {
    addError(
      folder,
      `${relativeFilePath} contains eval(), which is prohibited.`,
    );
  }
  if (/document\.write\s*\(/.test(content)) {
    addError(
      folder,
      `${relativeFilePath} contains document.write(), which is prohibited.`,
    );
  }

  // Check for analytics/tracking scripts
  if (
    /google-analytics\.com|googletagmanager\.com|hotjar|mixpanel/i.test(content)
  ) {
    addError(
      folder,
      `${relativeFilePath} contains tracking or analytics scripts.`,
    );
  }

  // Check for potential raw API keys (e.g. 32-char hex string)
  const apiKeyRegex = /["'][a-f0-9]{32}["']/i;
  if (apiKeyRegex.test(content)) {
    addError(
      folder,
      `${relativeFilePath} may contain a committed API key or secret token.`,
    );
  }

  // Check CDN links against whitelist in HTML
  if (ext === ".html") {
    const srcHrefRegex = /(?:src|href)\s*=\s*["'](https?:\/\/[^"']+)["']/gi;
    let match;
    while ((match = srcHrefRegex.exec(content)) !== null) {
      const url = match[1];
      const isWhitelisted = whitelist.some((prefix) => url.startsWith(prefix));
      if (!isWhitelisted) {
        addError(
          folder,
          `${relativeFilePath} uses non-whitelisted CDN URL: ${url}`,
        );
      }
    }
  }
}

function runValidation() {
  const whitelist = loadWhitelist();
  const entries = fs.readdirSync(ROOT_DIR, { withFileTypes: true });

  let projectCount = 0;

  for (const entry of entries) {
    if (!entry.isDirectory() || IGNORED_DIRS.has(entry.name)) {
      continue;
    }

    projectCount++;
    const folder = entry.name;
    const dirPath = path.join(ROOT_DIR, folder);

    validateFolderName(folder);
    validateRequiredFiles(folder, dirPath);
    validateProjectJson(folder, dirPath);
    scanFiles(folder, dirPath, whitelist);
  }

  console.log(`Validated ${projectCount} project directories.`);

  if (errors.length > 0) {
    console.error(`\nValidation failed with ${errors.length} error(s):`);
    for (const err of errors) {
      console.error(` - ${err}`);
    }
    process.exit(1);
  } else {
    console.log("All projects passed validation successfully!");
  }
}

runValidation();
