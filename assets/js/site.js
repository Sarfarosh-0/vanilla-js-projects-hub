/**
 * Progressive enhancement for the project grid.
 *
 * Without JavaScript everything still works: the markup ships every project
 * card, and the filter bar is hidden (see `html:not(.js)` rules in style.css).
 * This script only narrows the list that is already in the document.
 */
(function () {
  'use strict';

  /* -------------------------------------------------------------------------
     Theme toggle
     The inline <head> script has already picked the palette before first
     paint. Here we keep the button state in sync, persist explicit choices,
     and keep following the operating system until one is made.
     ------------------------------------------------------------------------- */
  var THEME_KEY = 'vanilla-hub:theme';
  var root = document.documentElement;
  var themeToggle = document.getElementById('theme-toggle');
  var themeColorMeta = document.querySelector('meta[name="theme-color"]');
  var darkQuery =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

  function readStoredTheme() {
    try {
      var value = window.localStorage.getItem(THEME_KEY);
      return value === 'dark' || value === 'light' ? value : null;
    } catch (error) {
      return null;
    }
  }

  function applyTheme(theme) {
    var isDark = theme === 'dark';
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');

    if (themeToggle) {
      var label = isDark ? 'Switch to light theme' : 'Switch to dark theme';
      themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      themeToggle.setAttribute('aria-label', label);
      themeToggle.setAttribute('title', label);
    }

    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', isDark ? '#10150f' : '#315b3d');
    }
  }

  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var nextTheme =
        root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
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
        applyTheme(event.matches ? 'dark' : 'light');
      }
    };

    if (darkQuery.addEventListener) {
      darkQuery.addEventListener('change', handleSystemTheme);
    } else if (darkQuery.addListener) {
      darkQuery.addListener(handleSystemTheme);
    }
  }

  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.main-nav .nav-link')
  );

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.forEach(function (item) {
        var isCurrent = item === link;
        item.classList.toggle('is-active', isCurrent);
        if (isCurrent) {
          item.setAttribute('aria-current', 'page');
        } else {
          item.removeAttribute('aria-current');
        }
      });
    });
  });

  var grid = document.querySelector('[data-project-grid]');
  if (!grid) {
    return;
  }

  var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-project-card]'));
  if (cards.length === 0) {
    return;
  }

  var difficultyButtons = Array.prototype.slice.call(
    document.querySelectorAll('[data-filter="difficulty"]')
  );
  var tagButtons = Array.prototype.slice.call(
    document.querySelectorAll('[data-filter="tag"]')
  );
  var searchInput = document.getElementById('project-search');
  var clearFilterButtons = Array.prototype.slice.call(
    document.querySelectorAll('[data-clear-filters]')
  );
  var viewAllButton = document.querySelector('[data-view-all]');
  var status = document.getElementById('filter-status');
  var emptyState = document.querySelector('[data-empty-state]');
  var moreFilter = document.querySelector('.more-filter');
  var moreLabel = document.querySelector('[data-more-label]');

  var featuredCount = cards.filter(function (card) {
    return !card.classList.contains('is-extra');
  }).length;

  var state = {
    difficulty: '',
    tag: '',
    query: '',
    expanded: false
  };

  function matches(card) {
    if (state.difficulty && card.getAttribute('data-difficulty') !== state.difficulty) {
      return false;
    }

    if (state.tag) {
      var tags = (card.getAttribute('data-tags') || '').split(' ');
      if (tags.indexOf(state.tag) === -1) {
        return false;
      }
    }

    if (state.query && (card.getAttribute('data-search') || '').indexOf(state.query) === -1) {
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
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
      button.classList.toggle('is-active', active);
    });
  }

  function updateMoreLabel() {
    if (!moreLabel) {
      return;
    }
    var activeItem = moreFilter && moreFilter.querySelector('.more-item[aria-pressed="true"]');
    moreLabel.textContent = activeItem ? activeItem.firstChild.textContent.trim() : 'More';
    if (moreFilter) {
      moreFilter.classList.toggle('has-active', Boolean(activeItem));
    }
  }

  function render() {
    var filtering = isFiltering();
    var shown = 0;

    grid.classList.toggle('is-filtering', filtering);
    grid.classList.toggle('is-expanded', state.expanded && !filtering);

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
        ? shown + (shown === 1 ? ' project matches your filters.' : ' projects match your filters.')
        : '';
    }

    if (viewAllButton) {
      viewAllButton.hidden = filtering || cards.length <= featuredCount;
      viewAllButton.setAttribute('aria-expanded', grid.classList.contains('is-expanded') ? 'true' : 'false');
    }

    setPressed(difficultyButtons, 'data-value', state.difficulty);
    setPressed(tagButtons, 'data-value', state.tag);
    clearFilterButtons.forEach(function (button) {
      button.hidden = !filtering;
    });
    updateMoreLabel();
  }

  function clearFilters() {
    state.difficulty = '';
    state.tag = '';
    state.query = '';
    state.expanded = true;

    if (searchInput) {
      searchInput.value = '';
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
    button.addEventListener('click', function () {
      state.difficulty = button.getAttribute('data-value') || '';
      render();
    });
  });

  tagButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var value = button.getAttribute('data-value') || '';
      state.tag = state.tag === value ? '' : value;
      if (moreFilter) {
        moreFilter.open = false;
      }
      render();
    });
  });

  clearFilterButtons.forEach(function (button) {
    button.addEventListener('click', clearFilters);
  });

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      state.query = searchInput.value.trim().toLowerCase();
      render();
    });
  }

  if (viewAllButton) {
    viewAllButton.addEventListener('click', function () {
      state.expanded = !state.expanded;
      render();
      if (!state.expanded) {
        var heading = document.getElementById('projects');
        if (heading && heading.getBoundingClientRect().top < 0) {
          heading.scrollIntoView({ block: 'start' });
        }
      }
    });
  }

  // Close the "More" menu on outside click or Escape, like a normal menu.
  document.addEventListener('click', function (event) {
    if (moreFilter && moreFilter.open && !moreFilter.contains(event.target)) {
      moreFilter.open = false;
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && moreFilter && moreFilter.open) {
      moreFilter.open = false;
      var summary = moreFilter.querySelector('summary');
      if (summary) {
        summary.focus();
      }
    }
  });

  render();
})();
