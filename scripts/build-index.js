const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const README_PATH = path.join(ROOT_DIR, 'README.md');
const TEMPLATE_PATH = path.join(ROOT_DIR, 'scripts', 'templates', 'index.html');
const INDEX_PATH = path.join(ROOT_DIR, 'index.html');
const PLACEHOLDER_THUMBNAIL = 'assets/images/thumb-placeholder.svg';

const SITE_URL = 'https://sarfarosh-0.github.io/vanilla-js-projects-hub/';
const REPO_URL = 'https://github.com/Sarfarosh-0/vanilla-js-projects-hub';
const SITE_NAME = 'Vanilla JS Projects Hub';

// Cards shown before "View All Projects". Any project not listed here is still
// rendered, but appears after these six and starts hidden. Keep this in sync
// with the featured projects in the design.
const FEATURED_FOLDERS = [
  'calculator',
  'todo-app',
  'color-flipper',
  'digital-clock',
  'number-guessing-game',
  'expense-tracker'
];
const FEATURED_COUNT = FEATURED_FOLDERS.length;

// How many tags get their own chip; the remaining tags go into the "More" menu.
const MAX_TAG_CHIPS = 5;

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

// Tags that need a hand-written label rather than naive title casing.
const TAG_LABELS = {
  dom: 'DOM',
  api: 'APIs',
  apis: 'APIs',
  bmi: 'BMI',
  rgb: 'RGB',
  css: 'CSS',
  html: 'HTML',
  json: 'JSON',
  localstorage: 'localStorage',
  setinterval: 'setInterval',
  'es-modules': 'ES Modules',
  'async-await': 'Async/Await',
  crud: 'CRUD',
  'hex-code': 'Hex Code',
  'math-random': 'Math Random',
  'form-validation': 'Form Validation',
  'event-listener': 'Event Listener',
  'click-events': 'Click Events',
  'keyboard-events': 'Keyboard Events',
  'dark-mode': 'Dark Mode'
};

const START_MARKER = '<!-- PROJECTS-TABLE-START -->';
const END_MARKER = '<!-- PROJECTS-TABLE-END -->';

const CHECK_MODE = process.argv.includes('--check');

const IGNORED_DIRS = new Set([
  '.git',
  '.github',
  'node_modules',
  'scripts',
  'docs',
  'scratch',
  'assets'
]);

const ICON_EXTERNAL = '<svg class="icon icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>';
const ICON_GITHUB = '<svg class="icon icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>';
const ICON_KEY = '<svg class="icon icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>';

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function titleCaseDifficulty(difficulty) {
  const value = String(difficulty || 'beginner').toLowerCase();
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatTag(tag) {
  if (TAG_LABELS[tag]) return TAG_LABELS[tag];
  return String(tag)
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function resolveThumbnail(folder, metadata) {
  const custom = typeof metadata.thumbnail === 'string' ? metadata.thumbnail.trim() : '';

  if (custom) {
    const relative = custom.replace(/^\.?\//, '');
    if (fs.existsSync(path.join(ROOT_DIR, relative))) {
      return relative;
    }
    console.warn(
      `Warning: thumbnail "${custom}" for ${folder} was not found, using the placeholder.`
    );
  }

  const conventional = `assets/images/thumb-${folder}.svg`;
  if (fs.existsSync(path.join(ROOT_DIR, conventional))) {
    return conventional;
  }

  return PLACEHOLDER_THUMBNAIL;
}

function getProjects() {
  const entries = fs.readdirSync(ROOT_DIR, { withFileTypes: true });
  const projects = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || IGNORED_DIRS.has(entry.name)) {
      continue;
    }

    const projectJsonPath = path.join(ROOT_DIR, entry.name, 'project.json');
    const indexPath = path.join(ROOT_DIR, entry.name, 'index.html');
    const readmePath = path.join(ROOT_DIR, entry.name, 'README.md');

    if (fs.existsSync(projectJsonPath) && fs.existsSync(indexPath) && fs.existsSync(readmePath)) {
      try {
        const metadata = JSON.parse(fs.readFileSync(projectJsonPath, 'utf8'));
        projects.push({
          folder: entry.name,
          ...metadata,
          difficulty: String(metadata.difficulty || 'beginner').toLowerCase(),
          tags: Array.isArray(metadata.tags) ? metadata.tags.filter((tag) => typeof tag === 'string') : [],
          thumbnail: resolveThumbnail(entry.name, metadata),
          demoUrl: `./${entry.name}/index.html`,
          codeUrl: `${REPO_URL}/tree/main/${entry.name}`
        });
      } catch (err) {
        console.error(`Error parsing ${projectJsonPath}:`, err.message);
      }
    }
  }

  // Sort alphabetically by project name
  projects.sort((a, b) => a.name.localeCompare(b.name));
  return projects;
}

/**
 * Featured projects keep the order defined in FEATURED_FOLDERS, everything else
 * follows alphabetically. Cards after the featured ones start hidden.
 */
function orderProjects(projects) {
  const byFolder = new Map(projects.map((project) => [project.folder, project]));
  const featured = FEATURED_FOLDERS.map((folder) => byFolder.get(folder)).filter(Boolean);
  const featuredSet = new Set(featured.map((project) => project.folder));
  const rest = projects.filter((project) => !featuredSet.has(project.folder));
  return [...featured, ...rest];
}

function countTags(projects) {
  const counts = new Map();
  for (const project of projects) {
    for (const tag of project.tags) {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function chip(label, attributes, count) {
  const countMarkup = Number.isFinite(count) ? ` <span class="chip-count">${count}</span>` : '';
  return `              <button type="button" class="chip" ${attributes}>${label}${countMarkup}</button>`;
}

function renderDifficultyChips(projects) {
  const counts = new Map(DIFFICULTIES.map((difficulty) => [difficulty, 0]));
  for (const project of projects) {
    if (counts.has(project.difficulty)) {
      counts.set(project.difficulty, counts.get(project.difficulty) + 1);
    }
  }

  const chips = [
    `              <button type="button" class="chip" data-filter="difficulty" data-value="" aria-pressed="true">All <span class="chip-count">${projects.length}</span></button>`
  ];

  for (const difficulty of DIFFICULTIES) {
    const count = counts.get(difficulty);
    const label = titleCaseDifficulty(difficulty);
    if (count === 0) {
      chips.push(
        `              <button type="button" class="chip" data-filter="difficulty" data-value="${difficulty}" aria-pressed="false" disabled title="No ${label.toLowerCase()} projects yet">${label} <span class="chip-count">0</span></button>`
      );
    } else {
      chips.push(chip(label, `data-filter="difficulty" data-value="${difficulty}" aria-pressed="false"`, count));
    }
  }

  return chips.join('\n');
}

function renderTagChips(projects) {
  const tagCounts = countTags(projects);
  if (tagCounts.length === 0) {
    return '';
  }

  const primary = tagCounts.slice(0, MAX_TAG_CHIPS);
  const overflow = tagCounts.slice(MAX_TAG_CHIPS);

  const chips = primary.map(([tag, count]) =>
    chip(formatTag(tag), `data-filter="tag" data-value="${escapeAttr(tag)}" aria-pressed="false"`, count)
  );

  if (overflow.length > 0) {
    const items = overflow.map(([tag, count]) =>
      `                  <button type="button" class="more-item" data-filter="tag" data-value="${escapeAttr(tag)}" aria-pressed="false">${formatTag(tag)} <span class="chip-count">${count}</span></button>`
    ).join('\n');

    chips.push(`              <details class="more-filter">
                <summary class="chip chip-summary">
                  <span data-more-label>More</span>
                  <svg class="icon icon-sm chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
                </summary>
                <div class="more-menu">
${items}
                </div>
              </details>`);
  }

  return chips.join('\n');
}

function renderCard(project, index) {
  const isExtra = index >= FEATURED_COUNT;
  const searchBlob = [
    project.name,
    project.description,
    project.folder,
    project.difficulty,
    ...project.tags
  ]
    .join(' ')
    .toLowerCase();

  const note = project.requiresApiKey
    ? `
              <p class="project-note">${ICON_KEY}<span>API key required</span></p>`
    : '';

  const author = typeof project.author === 'string' ? project.author.trim() : '';
  const byline = author
    ? `
              <p class="project-author">by <a class="project-author-name" href="https://github.com/${escapeAttr(encodeURIComponent(author))}" target="_blank" rel="noopener noreferrer">${escapeHtml(author)}</a></p>`
    : '';

  return `          <article class="project-card${isExtra ? ' is-extra' : ''}" data-project-card data-difficulty="${escapeAttr(project.difficulty)}" data-tags="${escapeAttr(project.tags.join(' '))}" data-search="${escapeAttr(searchBlob)}">
            <div class="project-thumb">
              <img src="${escapeAttr(project.thumbnail)}" alt="" width="115" height="130" loading="lazy" decoding="async" draggable="false">
            </div>
            <div class="project-body">
              <div class="project-title-row">
                <h3 class="project-title"><a href="${escapeAttr(project.demoUrl)}">${escapeHtml(project.name)}</a></h3>
                <span class="badge badge-${escapeAttr(project.difficulty)}">${titleCaseDifficulty(project.difficulty)}</span>
              </div>${byline}
              <p class="project-desc">${escapeHtml(project.description)}</p>${note}
              <span class="project-divider" aria-hidden="true"></span>
              <div class="project-actions">
                <a class="btn-card btn-card-primary" href="${escapeAttr(project.demoUrl)}" target="_blank" rel="noopener">
                  <span>Live Demo</span>
                  ${ICON_EXTERNAL}
                </a>
                <a class="btn-card btn-card-outline" href="${escapeAttr(project.codeUrl)}" target="_blank" rel="noopener">
                  <span>View Code</span>
                  ${ICON_GITHUB}
                </a>
              </div>
            </div>
          </article>`;
}

function renderViewAll(projects) {
  if (projects.length <= FEATURED_COUNT) {
    return '';
  }

  return `          <button type="button" class="btn view-all" data-view-all aria-expanded="false" aria-controls="project-grid">
            <span class="view-all-text view-all-more">View All Projects</span>
            <span class="view-all-text view-all-less">Show Less</span>
            <svg class="icon icon-sm arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>`;
}

function renderSeoMeta(projects) {
  const count = projects.length;
  const description = `Browse ${count} free vanilla JavaScript projects — games, calculators, timers, and API apps. Every project is open source, beginner-friendly, and open to contributions.`;
  const title = `${count} Free Vanilla JavaScript Projects to Learn & Build`;

  return `<meta name="description" content="${escapeAttr(description)}">
  <link rel="canonical" href="${SITE_URL}">
  <meta name="theme-color" content="#315b3d">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${escapeAttr(SITE_NAME)}">
  <meta property="og:title" content="${escapeAttr(title)}">
  <meta property="og:description" content="${escapeAttr(description)}">
  <meta property="og:url" content="${SITE_URL}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeAttr(title)}">
  <meta name="twitter:description" content="${escapeAttr(description)}">`;
}

function renderJsonLd(projects) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: SITE_NAME,
    description: `A collection of ${projects.length} open-source vanilla JavaScript projects for learning and contributing.`,
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: project.name,
      description: project.description,
      url: `${SITE_URL}${project.folder}/index.html`
    }))
  };

  const json = JSON.stringify(data, null, 2)
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n');

  return `  <script type="application/ld+json">\n${json}\n  </script>`;
}

function renderIndex(projects) {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error('Template not found at', TEMPLATE_PATH);
    process.exit(1);
  }

  const ordered = orderProjects(projects);
  const cards = ordered.map((project, index) => renderCard(project, index)).join('\n\n');

  const replacements = {
    '{{SEO_META}}': renderSeoMeta(ordered),
    '{{JSON_LD}}': renderJsonLd(ordered),
    '{{PROJECT_COUNT}}': String(ordered.length),
    '{{DIFFICULTY_CHIPS}}': renderDifficultyChips(ordered),
    '{{TAG_CHIPS}}': renderTagChips(ordered),
    '{{PROJECT_CARDS}}': cards,
    '{{VIEW_ALL}}': renderViewAll(ordered)
  };

  let html = fs.readFileSync(TEMPLATE_PATH, 'utf8').replace(/\r\n/g, '\n');

  for (const [token, value] of Object.entries(replacements)) {
    if (!html.includes(token)) {
      console.error(`Template is missing the ${token} placeholder.`);
      process.exit(1);
    }
    html = html.split(token).join(value);
  }

  const banner = '  <!-- Generated by scripts/build-index.js. Edit scripts/templates/index.html instead. -->';
  html = html.replace('<head>', `<head>\n${banner}`);

  return { html, ordered };
}

function buildIndex(projects) {
  const { html, ordered } = renderIndex(projects);

  if (CHECK_MODE) {
    const current = fs.existsSync(INDEX_PATH)
      ? fs.readFileSync(INDEX_PATH, 'utf8').replace(/\r\n/g, '\n')
      : '';
    if (current !== html) {
      console.error('index.html is out of date.');
      console.error('Run `node scripts/build-index.js` and commit the result.');
      process.exit(1);
    }
    console.log(`index.html is up to date (${ordered.length} projects).`);
    return;
  }

  fs.writeFileSync(INDEX_PATH, html, 'utf8');
  console.log(`index.html generated with ${ordered.length} projects.`);
}

function generateMarkdownTable(projects) {
  let table = '| Project | Description | Difficulty | Tags |\n';
  table += '|:--|:--|:--|:--|\n';

  for (const p of projects) {
    const projectLink = `[${p.name}](./${p.folder}/index.html)`;
    const tagsFormatted = Array.isArray(p.tags) && p.tags.length > 0
      ? p.tags.map(t => `\`${t}\``).join(' ')
      : '-';
    const difficultyFormatted = p.difficulty
      ? p.difficulty.charAt(0).toUpperCase() + p.difficulty.slice(1).toLowerCase()
      : 'Beginner';

    let desc = p.description || '';
    if (p.requiresApiKey) {
      desc += ' *(🔑 API key required)*';
    }

    table += `| ${projectLink} | ${desc} | ${difficultyFormatted} | ${tagsFormatted} |\n`;
  }

  return table.trim();
}

function updateReadme(projects) {
  if (!fs.existsSync(README_PATH)) {
    console.error('README.md not found at', README_PATH);
    process.exit(1);
  }

  const readmeContent = fs.readFileSync(README_PATH, 'utf8').replace(/\r\n/g, '\n');

  if (!readmeContent.includes(START_MARKER) || !readmeContent.includes(END_MARKER)) {
    console.error(`Markers ${START_MARKER} and/or ${END_MARKER} not found in README.md`);
    process.exit(1);
  }

  const tableMarkdown = generateMarkdownTable(projects);

  const startIndex = readmeContent.indexOf(START_MARKER) + START_MARKER.length;
  const endIndex = readmeContent.indexOf(END_MARKER);

  const newReadmeContent =
    readmeContent.substring(0, startIndex) +
    '\n\n' +
    tableMarkdown +
    '\n\n' +
    readmeContent.substring(endIndex);

  if (CHECK_MODE) {
    if (newReadmeContent !== readmeContent) {
      console.error('README.md project table is out of date.');
      console.error('Run `node scripts/build-index.js` and commit the result.');
      process.exit(1);
    }
    console.log('README.md project table is up to date.');
    return;
  }

  fs.writeFileSync(README_PATH, newReadmeContent, 'utf8');
  console.log('README.md index table updated successfully!');
}

function main() {
  const projects = getProjects();
  console.log(`Found ${projects.length} valid projects.`);

  updateReadme(projects);
  buildIndex(projects);
}

main();
