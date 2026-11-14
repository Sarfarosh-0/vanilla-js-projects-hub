/**
 * Live open-issue list for issues.html.
 *
 * Reads the public GitHub REST API in the browser (no token, no server) and
 * renders the issues that are open right now. Results are cached per session
 * for ten minutes to stay well inside the unauthenticated rate limit.
 *
 * The markup ships a fallback link, so the page still makes sense without
 * JavaScript or when the request fails.
 */
(function () {
  "use strict";

  var GITHUB_REPO = "Sarfarosh-0/vanilla-js-projects-hub";
  var API_URL =
    "https://api.github.com/repos/" +
    GITHUB_REPO +
    "/issues?state=open&per_page=100&sort=updated&direction=desc";
  var ISSUES_URL = "https://github.com/" + GITHUB_REPO + "/issues";
  var CACHE_KEY = "vanilla-hub:open-issues:v2";
  var CACHE_MS = 10 * 60 * 1000;
  var DESCRIPTION_MAX = 240;
  var SVG_NS = "http://www.w3.org/2000/svg";

  // Labels that get promoted to the front of the filter bar, in this order.
  var LABEL_PRIORITY = [
    "good first issue",
    "help wanted",
    "bug",
    "enhancement",
    "documentation",
    "question",
  ];

  var list = document.getElementById("issues-list");
  var filters = document.getElementById("issues-filters");
  var status = document.getElementById("issues-status");
  var state = document.getElementById("issues-state");

  if (!list || !filters || !status || !state) {
    return;
  }

  var allIssues = [];
  var activeLabel = "";
  var cachedFallback = false;

  var relativeTimeFormat =
    typeof Intl !== "undefined" && Intl.RelativeTimeFormat
      ? new Intl.RelativeTimeFormat("en", { numeric: "auto" })
      : null;

  /* -------------------------------------------------------------------------
     Cache
     Only the fields used by the UI are stored, and descriptions are reduced to
     a short plain-text preview, so a busy repository does not fill
     sessionStorage with full issue bodies.
     ------------------------------------------------------------------------- */
  function readCache(allowExpired) {
    try {
      var raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;

      var cached = JSON.parse(raw);
      if (!cached || !Array.isArray(cached.data)) return null;
      if (!allowExpired && Date.now() - cached.savedAt > CACHE_MS) return null;

      return cached.data;
    } catch (error) {
      return null;
    }
  }

  function writeCache(issues) {
    try {
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ savedAt: Date.now(), data: issues }),
      );
    } catch (error) {
      // Storage can be unavailable (for example in private mode).
    }
  }

  /* -------------------------------------------------------------------------
     Data
     ------------------------------------------------------------------------- */
  function normalize(items) {
    var issues = [];

    items.forEach(function (item) {
      // The issues endpoint also returns pull requests.
      if (!item || item.pull_request) return;

      issues.push({
        number: item.number,
        title: item.title,
        description: summarize(item.body, DESCRIPTION_MAX),
        url: item.html_url,
        comments: item.comments,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        author: item.user && item.user.login ? item.user.login : "someone",
        labels: Array.isArray(item.labels)
          ? item.labels
              .filter(function (label) {
                return label && typeof label.name === "string";
              })
              .map(function (label) {
                return { name: label.name, color: label.color };
              })
          : [],
      });
    });

    return issues;
  }

  function fetchIssues() {
    return fetch(API_URL, {
      headers: { Accept: "application/vnd.github+json" },
    }).then(function (response) {
      if (!response.ok) {
        var error = new Error("GitHub request failed (" + response.status + ")");
        error.status = response.status;
        throw error;
      }
      return response.json();
    });
  }

  /* -------------------------------------------------------------------------
     Formatting helpers
     ------------------------------------------------------------------------- */
  function summarize(text, max) {
    if (typeof text !== "string") return "";

    // Reduce Markdown to a readable plain-text preview. This is display-only
    // text, so it is rendered with textContent and never as HTML.
    var clean = text
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<\/?[a-z][^>]*\s[^>]*>/gi, " ")
      .replace(/^#{1,6}[^\n]*$/gm, " ")
      .replace(/^\s*>\s?/gm, "")
      .replace(/^\s*[-*+]\s+\[[ xX]\]\s*/gm, "")
      .replace(/^\s*[-*+]\s+/gm, "")
      .replace(/(\*\*|__)(.+?)\1/g, "$2")
      .replace(/`([^`]*)`/g, "$1")
      .replace(/\s+/g, " ")
      .trim();

    if (!clean) return "";

    if (clean.length > max) {
      clean = clean.slice(0, max);
      var cut = clean.lastIndexOf(" ");
      if (cut > max * 0.6) clean = clean.slice(0, cut);
      clean += "\u2026";
    }

    return clean;
  }

  function makeIcon(paths) {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "icon icon-sm");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");

    paths.forEach(function (d) {
      var path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", d);
      svg.appendChild(path);
    });

    return svg;
  }

  function relativeTime(value) {
    var date = new Date(value);
    if (isNaN(date.getTime())) return "recently";
    if (!relativeTimeFormat) return "on " + date.toLocaleDateString();

    var seconds = Math.round((date.getTime() - Date.now()) / 1000);
    var units = [
      ["year", 31536000],
      ["month", 2592000],
      ["week", 604800],
      ["day", 86400],
      ["hour", 3600],
      ["minute", 60],
    ];

    for (var i = 0; i < units.length; i += 1) {
      if (Math.abs(seconds) >= units[i][1]) {
        return relativeTimeFormat.format(
          Math.round(seconds / units[i][1]),
          units[i][0],
        );
      }
    }

    return "just now";
  }

  function safeColor(value) {
    return typeof value === "string" && /^[0-9a-fA-F]{6}$/.test(value)
      ? "#" + value
      : "var(--color-secondary)";
  }

  /* -------------------------------------------------------------------------
     State messages
     ------------------------------------------------------------------------- */
  function hideState() {
    state.textContent = "";
    state.hidden = true;
  }

  function showState(kind, message, actionLabel, actionHref, actionHandler) {
    state.textContent = "";
    state.hidden = false;

    if (kind === "loading") {
      var spinner = document.createElement("span");
      spinner.className = "issues-spinner";
      spinner.setAttribute("aria-hidden", "true");
      state.appendChild(spinner);
    }

    var text = document.createElement("p");
    text.className = "issues-state-text";
    text.textContent = message;
    state.appendChild(text);

    if (actionLabel) {
      if (actionHref) {
        var link = document.createElement("a");
        link.href = actionHref;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = actionLabel;
        state.appendChild(link);
      } else if (actionHandler) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "btn btn-outline";
        button.textContent = actionLabel;
        button.addEventListener("click", actionHandler);
        state.appendChild(button);
      }
    }
  }

  function updateStatus(count, latest) {
    if (!allIssues.length) {
      status.textContent = "No open issues right now.";
      return;
    }

    var text = activeLabel
      ? count +
        " of " +
        allIssues.length +
        " open " +
        (allIssues.length === 1 ? "issue" : "issues") +
        " labelled \u201C" +
        activeLabel +
        "\u201D"
      : allIssues.length +
        " open " +
        (allIssues.length === 1 ? "issue" : "issues");

    if (latest && latest.updatedAt) {
      text += " \u00B7 latest update " + relativeTime(latest.updatedAt);
    }

    if (cachedFallback) {
      text += " (cached)";
    }

    status.textContent = text;
  }

  /* -------------------------------------------------------------------------
     Filters
     ------------------------------------------------------------------------- */
  function collectLabels(issues) {
    var counts = {};
    var colors = {};

    issues.forEach(function (issue) {
      issue.labels.forEach(function (label) {
        counts[label.name] = (counts[label.name] || 0) + 1;
        if (!(label.name in colors)) colors[label.name] = label.color;
      });
    });

    return Object.keys(counts).sort(function (a, b) {
      var aIndex = LABEL_PRIORITY.indexOf(a.toLowerCase());
      var bIndex = LABEL_PRIORITY.indexOf(b.toLowerCase());

      if (aIndex !== -1 || bIndex !== -1) {
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      }

      return a.localeCompare(b);
    }).map(function (name) {
      return { name: name, count: counts[name], color: colors[name] };
    });
  }

  function makeChip(label, value, count, color) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "issues-chip";
    button.setAttribute("data-label", value);
    button.setAttribute("aria-pressed", value === activeLabel ? "true" : "false");

    if (color) {
      var dot = document.createElement("span");
      dot.className = "issues-chip-dot";
      dot.style.backgroundColor = safeColor(color);
      dot.setAttribute("aria-hidden", "true");
      button.appendChild(dot);
    }

    var name = document.createElement("span");
    name.textContent = label;
    button.appendChild(name);

    var badge = document.createElement("span");
    badge.className = "issues-chip-count";
    badge.textContent = String(count);
    button.appendChild(badge);

    button.addEventListener("click", function () {
      if (activeLabel === value) return;
      activeLabel = value;
      updateChipState();
      renderList();
    });

    return button;
  }

  function updateChipState() {
    Array.prototype.forEach.call(filters.children, function (chip) {
      var value = chip.getAttribute("data-label") || "";
      chip.setAttribute("aria-pressed", value === activeLabel ? "true" : "false");
    });
  }

  function renderFilters() {
    filters.textContent = "";

    if (!allIssues.length) {
      filters.hidden = true;
      return;
    }

    filters.appendChild(makeChip("All", "", allIssues.length, null));

    collectLabels(allIssues).forEach(function (label) {
      filters.appendChild(
        makeChip(label.name, label.name, label.count, label.color),
      );
    });

    updateChipState();
    filters.hidden = false;
  }

  /* -------------------------------------------------------------------------
     Rendering
     ------------------------------------------------------------------------- */
  function makeCard(issue) {
    var item = document.createElement("li");
    item.className = "issue-card";

    var card = document.createElement("article");
    card.className = "issue-card-body";

    var top = document.createElement("div");
    top.className = "issue-card-top";

    var title = document.createElement("h3");
    title.className = "issue-card-title";
    title.textContent = issue.title;
    top.appendChild(title);

    if (issue.labels.length) {
      var labels = document.createElement("div");
      labels.className = "issue-card-labels";

      issue.labels.forEach(function (label) {
        var chip = document.createElement("span");
        chip.className = "issue-label";

        var dot = document.createElement("span");
        dot.className = "issue-label-dot";
        dot.style.backgroundColor = safeColor(label.color);
        dot.setAttribute("aria-hidden", "true");
        chip.appendChild(dot);

        var name = document.createElement("span");
        name.textContent = label.name;
        chip.appendChild(name);

        labels.appendChild(chip);
      });

      top.appendChild(labels);
    }

    card.appendChild(top);

    var description = document.createElement("p");
    description.className = "issue-card-desc";
    description.textContent =
      issue.description || "No description was provided for this issue.";
    card.appendChild(description);

    var footer = document.createElement("div");
    footer.className = "issue-card-footer";

    var meta = document.createElement("p");
    meta.className = "issue-card-meta";

    var parts = [
      "#" + issue.number,
      "opened " + relativeTime(issue.createdAt) + " by " + issue.author,
      issue.comments + (issue.comments === 1 ? " comment" : " comments"),
    ];

    parts.forEach(function (part) {
      var piece = document.createElement("span");
      piece.textContent = part;
      meta.appendChild(piece);
    });

    footer.appendChild(meta);

    var action = document.createElement("a");
    action.className = "btn btn-outline issue-card-action";
    action.href = issue.url;
    action.target = "_blank";
    action.rel = "noopener noreferrer";
    action.setAttribute(
      "aria-label",
      "View issue #" + issue.number + " on GitHub (opens in a new tab)",
    );

    var actionText = document.createElement("span");
    actionText.textContent = "View issue";
    action.appendChild(actionText);
    action.appendChild(
      makeIcon([
        "M15 3h6v6",
        "M10 14 21 3",
        "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
      ]),
    );

    footer.appendChild(action);
    card.appendChild(footer);

    item.appendChild(card);
    return item;
  }

  function renderList() {
    var visible = activeLabel
      ? allIssues.filter(function (issue) {
          return issue.labels.some(function (label) {
            return label.name === activeLabel;
          });
        })
      : allIssues;

    list.textContent = "";
    list.setAttribute("aria-busy", "false");

    if (!visible.length) {
      list.hidden = true;

      if (!allIssues.length) {
        showState(
          "empty",
          "There are no open issues right now. Check back soon.",
          "View the repository",
          "https://github.com/" + GITHUB_REPO,
        );
      } else {
        showState(
          "empty",
          "No open issues use the \u201C" + activeLabel + "\u201D label.",
          "Show all issues",
          null,
          function () {
            activeLabel = "";
            updateChipState();
            renderList();
          },
        );
      }

      updateStatus(0, null);
      return;
    }

    hideState();
    list.hidden = false;

    var fragment = document.createDocumentFragment();
    visible.forEach(function (issue) {
      fragment.appendChild(makeCard(issue));
    });
    list.appendChild(fragment);

    updateStatus(visible.length, visible[0]);
  }

  function applyIssues(issues) {
    allIssues = issues;
    renderFilters();
    renderList();
  }

  /* -------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------- */
  function start() {
    list.setAttribute("aria-busy", "true");
    filters.hidden = true;
    showState("loading", "Loading open issues\u2026");

    var cached = readCache(false);

    if (cached) {
      cachedFallback = false;
      applyIssues(cached);
      return;
    }

    fetchIssues()
      .then(function (items) {
        var issues = normalize(items);
        writeCache(issues);
        cachedFallback = false;
        applyIssues(issues);
      })
      .catch(function (error) {
        var stale = readCache(true);

        if (stale) {
          cachedFallback = true;
          applyIssues(stale);
          return;
        }

        list.hidden = true;
        filters.hidden = true;
        status.textContent = "Open issues could not be loaded.";

        var rateLimited = error && (error.status === 403 || error.status === 429);
        showState(
          "error",
          rateLimited
            ? "GitHub is limiting requests right now. You can still browse the issues directly on GitHub."
            : "The issue list could not be loaded. Check your connection or browse the issues on GitHub.",
          "View issues on GitHub",
          ISSUES_URL,
        );
      });
  }

  start();
})();
