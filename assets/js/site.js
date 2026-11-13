/**
 * Progressive enhancement for the project grid.
 *
 * Without JavaScript everything still works: the markup ships every project
 * card, and the filter bar is hidden (see `html:not(.js)` rules in style.css).
 * This script only narrows the list that is already in the document.
 */
(function () {
  "use strict";

  /* -------------------------------------------------------------------------
     Theme toggle
     The inline <head> script has already picked the palette before first
     paint. Here we keep the button state in sync, persist explicit choices,
     and keep following the operating system until one is made.
     ------------------------------------------------------------------------- */
  var THEME_KEY = "vanilla-hub:theme";
  var root = document.documentElement;
  var themeToggle = document.getElementById("theme-toggle");
  var themeColorMeta = document.querySelector('meta[name="theme-color"]');
  var darkQuery =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");

  function readStoredTheme() {
    try {
      var value = window.localStorage.getItem(THEME_KEY);
      return value === "dark" || value === "light" ? value : null;
    } catch (error) {
      return null;
    }
  }

  function applyTheme(theme) {
    var isDark = theme === "dark";
    root.setAttribute("data-theme", isDark ? "dark" : "light");

    if (themeToggle) {
      var label = isDark ? "Switch to light theme" : "Switch to dark theme";
      themeToggle.setAttribute("aria-pressed", isDark ? "true" : "false");
      themeToggle.setAttribute("aria-label", label);
      themeToggle.setAttribute("title", label);
    }

    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", isDark ? "#10150f" : "#315b3d");
    }
  }

  applyTheme(root.getAttribute("data-theme") === "dark" ? "dark" : "light");

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var nextTheme =
        root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(nextTheme);

      try {
        window.localStorage.setItem(THEME_KEY, nextTheme);
      } catch (error) {
        /* The choice still applies to this page view. */
      }
    });
  }

  if (darkQuery) {
    var handleSystemTheme = function (event) {
      if (!readStoredTheme()) {
        applyTheme(event.matches ? "dark" : "light");
      }
    };

    if (darkQuery.addEventListener) {
      darkQuery.addEventListener("change", handleSystemTheme);
    } else if (darkQuery.addListener) {
      darkQuery.addListener(handleSystemTheme);
    }
  }

  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".main-nav .nav-link"),
  );

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.forEach(function (item) {
        var isCurrent = item === link;
        item.classList.toggle("is-active", isCurrent);
        if (isCurrent) {
          item.setAttribute("aria-current", "page");
        } else {
          item.removeAttribute("aria-current");
        }
      });
    });
  });

  var grid = document.querySelector("[data-project-grid]");
  if (!grid) {
    return;
  }

  var cards = Array.prototype.slice.call(
    grid.querySelectorAll("[data-project-card]"),
  );
  if (cards.length === 0) {
    return;
  }

  var difficultyButtons = Array.prototype.slice.call(
    document.querySelectorAll('[data-filter="difficulty"]'),
  );
  var tagButtons = Array.prototype.slice.call(
    document.querySelectorAll('[data-filter="tag"]'),
  );
  var searchInput = document.getElementById("project-search");
  var clearFilterButtons = Array.prototype.slice.call(
    document.querySelectorAll("[data-clear-filters]"),
  );
  var filterBarClearButton = document.querySelector(
    ".filters [data-clear-filters]",
  );
  var viewAllButton = document.querySelector("[data-view-all]");
  var status = document.getElementById("filter-status");
  var emptyState = document.querySelector("[data-empty-state]");
  var moreFilter = document.querySelector(".more-filter");
  var moreLabel = document.querySelector("[data-more-label]");

  var featuredCount = cards.filter(function (card) {
    return !card.classList.contains("is-extra");
  }).length;

  var state = {
    difficulty: "",
    tag: "",
    query: "",
    expanded: false,
  };

  function matches(card) {
    if (
      state.difficulty &&
      card.getAttribute("data-difficulty") !== state.difficulty
    ) {
      return false;
    }

    if (state.tag) {
      var tags = (card.getAttribute("data-tags") || "").split(" ");
      if (tags.indexOf(state.tag) === -1) {
        return false;
      }
    }

    if (
      state.query &&
      (card.getAttribute("data-search") || "").indexOf(state.query) === -1
    ) {
      return false;
    }

    return true;
  }

  function isFiltering() {
    return Boolean(state.difficulty || state.tag || state.query);
  }

  function setPressed(buttons, attribute, activeValue) {
    buttons.forEach(function (button) {
      var active = button.getAttribute(attribute) === activeValue;
      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.classList.toggle("is-active", active);
    });
  }

  function updateMoreLabel() {
    if (!moreLabel) {
      return;
    }
    var activeItem =
      moreFilter && moreFilter.querySelector('.more-item[aria-pressed="true"]');
    moreLabel.textContent = activeItem
      ? activeItem.firstChild.textContent.trim()
      : "More";
    if (moreFilter) {
      moreFilter.classList.toggle("has-active", Boolean(activeItem));
    }
  }

  function render() {
    var filtering = isFiltering();
    var shown = 0;

    grid.classList.toggle("is-filtering", filtering);
    grid.classList.toggle("is-expanded", state.expanded && !filtering);

    cards.forEach(function (card, index) {
      var visible =
        matches(card) && (filtering || state.expanded || index < featuredCount);
      card.hidden = !visible;
      if (visible) {
        shown += 1;
      }
    });

    if (emptyState) {
      emptyState.hidden = shown !== 0;
    }

    if (status) {
      status.textContent = filtering
        ? shown +
          (shown === 1
            ? " project matches your filters."
            : " projects match your filters.")
        : "";
    }

    if (viewAllButton) {
      viewAllButton.hidden = filtering || cards.length <= featuredCount;
      viewAllButton.setAttribute(
        "aria-expanded",
        grid.classList.contains("is-expanded") ? "true" : "false",
      );
    }

    setPressed(difficultyButtons, "data-value", state.difficulty);
    setPressed(tagButtons, "data-value", state.tag);
    if (filterBarClearButton) {
      filterBarClearButton.classList.toggle("is-visible", filtering);
    }
    updateMoreLabel();
  }

  function clearFilters() {
    state.difficulty = "";
    state.tag = "";
    state.query = "";
    state.expanded = true;

    if (searchInput) {
      searchInput.value = "";
    }
    if (moreFilter) {
      moreFilter.open = false;
    }

    render();

    if (searchInput) {
      searchInput.focus();
    }
  }

  difficultyButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      state.difficulty = button.getAttribute("data-value") || "";
      render();
    });
  });

  tagButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var value = button.getAttribute("data-value") || "";
      state.tag = state.tag === value ? "" : value;
      if (moreFilter) {
        moreFilter.open = false;
      }
      render();
    });
  });

  clearFilterButtons.forEach(function (button) {
    button.addEventListener("click", clearFilters);
  });

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      state.query = searchInput.value.trim().toLowerCase();
      render();
    });
  }

  if (viewAllButton) {
    viewAllButton.addEventListener("click", function () {
      state.expanded = !state.expanded;
      render();
      if (!state.expanded) {
        var heading = document.getElementById("projects");
        if (heading && heading.getBoundingClientRect().top < 0) {
          heading.scrollIntoView({ block: "start" });
        }
      }
    });
  }

  // Close the "More" menu on outside click or Escape, like a normal menu.
  document.addEventListener("click", function (event) {
    if (moreFilter && moreFilter.open && !moreFilter.contains(event.target)) {
      moreFilter.open = false;
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && moreFilter && moreFilter.open) {
      moreFilter.open = false;
      var summary = moreFilter.querySelector("summary");
      if (summary) {
        summary.focus();
      }
    }
  });

  /* -------------------------------------------------------------------------
     Live GitHub stats
     The markup ships neutral placeholders; these two public API reads replace
     them with the repository's real star and commit counts. Failures leave the
     placeholders untouched so the page still works offline.
     ------------------------------------------------------------------------- */
  var GITHUB_REPO = "Sarfarosh-0/vanilla-js-projects-hub";
  var STATS_CACHE_KEY = "vanilla-hub:github-stats";
  var STATS_CACHE_MS = 10 * 60 * 1000;

  function readStatsCache() {
    try {
      var raw = sessionStorage.getItem(STATS_CACHE_KEY);
      if (!raw) return null;

      var cached = JSON.parse(raw);
      if (Date.now() - cached.savedAt > STATS_CACHE_MS) return null;

      return cached.data;
    } catch (error) {
      return null;
    }
  }

  function writeStatsCache(data) {
    try {
      sessionStorage.setItem(
        STATS_CACHE_KEY,
        JSON.stringify({ savedAt: Date.now(), data: data }),
      );
    } catch (error) {
      // Storage can be unavailable (for example in private mode).
    }
  }

  function formatStat(value) {
    if (typeof value !== "number" || !Number.isFinite(value)) return null;
    return value.toLocaleString("en");
  }

  function fetchGitHub(url) {
    return fetch(url, {
      headers: { Accept: "application/vnd.github+json" },
    }).then(function (response) {
      if (!response.ok) {
        throw new Error("GitHub request failed (" + response.status + ")");
      }
      return response;
    });
  }

  function countCommits(linkHeader, fallbackCount) {
    if (!linkHeader) return fallbackCount;

    var match = linkHeader.match(/[?&]page=(\d+)>;\s*rel="last"/);
    return match ? Number(match[1]) : fallbackCount;
  }

  function renderStats(stats, starsEl, commitsEl) {
    var stars = formatStat(stats.stars);
    var commits = formatStat(stats.commits);

    if (stars && starsEl) starsEl.textContent = stars;
    if (commits && commitsEl) commitsEl.textContent = commits;
  }

  function loadGitHubStats() {
    var starsEl = document.getElementById("statStars");
    var commitsEl = document.getElementById("statCommits");

    if (!starsEl && !commitsEl) return;

    var cached = readStatsCache();
    if (cached) {
      renderStats(cached, starsEl, commitsEl);
      return;
    }

    Promise.all([
      fetchGitHub("https://api.github.com/repos/" + GITHUB_REPO).then(
        function (response) {
          return response.json();
        },
      ),
      fetchGitHub(
        "https://api.github.com/repos/" + GITHUB_REPO + "/commits?per_page=1",
      ).then(function (response) {
        return response.json().then(function (page) {
          return {
            commits: countCommits(
              response.headers.get("Link"),
              Array.isArray(page) ? page.length : 0,
            ),
          };
        });
      }),
    ])
      .then(function (results) {
        var stats = {
          stars: results[0].stargazers_count,
          commits: results[1].commits,
        };

        writeStatsCache(stats);
        renderStats(stats, starsEl, commitsEl);
      })
      .catch(function (error) {
        if (window.console && console.warn) {
          console.warn("Live GitHub stats unavailable:", error);
        }
      });
  }

  loadGitHubStats();

  render();
})();
