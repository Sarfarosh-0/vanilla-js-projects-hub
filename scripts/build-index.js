const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const README_PATH = path.join(ROOT_DIR, 'README.md');

const START_MARKER = '<!-- PROJECTS-TABLE-START -->';
const END_MARKER = '<!-- PROJECTS-TABLE-END -->';

const IGNORED_DIRS = new Set([
  '.git',
  '.github',
  'node_modules',
  'scripts',
  'docs',
  'scratch'
]);

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
          ...metadata
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

function updateReadme() {
  if (!fs.existsSync(README_PATH)) {
    console.error('README.md not found at', README_PATH);
    process.exit(1);
  }

  const readmeContent = fs.readFileSync(README_PATH, 'utf8');

  if (!readmeContent.includes(START_MARKER) || !readmeContent.includes(END_MARKER)) {
    console.error(`Markers ${START_MARKER} and/or ${END_MARKER} not found in README.md`);
    process.exit(1);
  }

  const projects = getProjects();
  console.log(`Found ${projects.length} valid projects.`);

  const tableMarkdown = generateMarkdownTable(projects);

  const startIndex = readmeContent.indexOf(START_MARKER) + START_MARKER.length;
  const endIndex = readmeContent.indexOf(END_MARKER);

  const newReadmeContent =
    readmeContent.substring(0, startIndex) +
    '\n\n' +
    tableMarkdown +
    '\n\n' +
    readmeContent.substring(endIndex);

  fs.writeFileSync(README_PATH, newReadmeContent, 'utf8');
  console.log('README.md index table updated successfully!');
}

updateReadme();
