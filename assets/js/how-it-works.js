/**
 * How it works page enhancements.
 *
 * Everything here is progressive: without JavaScript the page keeps its full
 * content, the TOC stays open, and code blocks remain readable and scrollable.
 * This script adds highlighting, copy buttons, and a tidier mobile TOC.
 */
(function () {
  'use strict';

  var HEADER_OFFSET = 120;
  var COPY_FEEDBACK_MS = 2000;

  /* -------------------------------------------------------------------------
     Table of contents
     ------------------------------------------------------------------------- */
  var toc = document.querySelector('.hiw-toc');
  var tocLinks = Array.prototype.slice.call(
    document.querySelectorAll('.hiw-toc-nav a[href^="#"]')
  );
  var mobileQuery =
    window.matchMedia && window.matchMedia('(max-width: 900px)');

  tocLinks.forEach(function (link) {
    var id = link.getAttribute('href').slice(1);

    link.addEventListener('click', function () {
      setActive(id);

      if (mobileQuery && mobileQuery.matches && toc) {
        toc.open = false;
      }
    });
  });

  // Desktop: keep the TOC expanded. Mobile: start collapsed so the summary
  // behaves like a real disclosure.
  function syncTocMode() {
    if (!toc || !mobileQuery) {
      return;
    }
    toc.open = !mobileQuery.matches;
  }

  syncTocMode();

  if (mobileQuery) {
    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener('change', syncTocMode);
    } else if (mobileQuery.addListener) {
      mobileQuery.addListener(syncTocMode);
    }
  }

  function setActive(id) {
    tocLinks.forEach(function (link) {
      var isActive = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', isActive);

      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  /* -------------------------------------------------------------------------
     Scroll-spy
     The sticky header hides the top of a section, so the observer root is
     pulled down and shortened. On every intersection change we pick the last
     section whose top has passed the header.
     ------------------------------------------------------------------------- */
  var sections = Array.prototype.slice.call(
    document.querySelectorAll('.hiw-content section[id]')
  );
  var currentId = '';

  function pickActiveSection() {
    if (sections.length === 0) {
      return;
    }

    var activeId = sections[0].id;

    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= HEADER_OFFSET) {
        activeId = section.id;
      }
    });

    var atPageBottom =
      window.innerHeight + window.pageYOffset >=
      document.documentElement.scrollHeight - 2;

    if (atPageBottom) {
      activeId = sections[sections.length - 1].id;
    }

    if (activeId !== currentId) {
      currentId = activeId;
      setActive(activeId);
    }
  }

  if ('IntersectionObserver' in window && sections.length > 0) {
    var spy = new IntersectionObserver(
      function () {
        pickActiveSection();
      },
      {
        rootMargin: '-100px 0px -45% 0px',
        threshold: [0, 0.15, 0.5, 1]
      }
    );

    sections.forEach(function (section) {
      spy.observe(section);
    });
  } else {
    // Older browsers still get a working TOC, just without live highlighting.
    pickActiveSection();
  }

  /* -------------------------------------------------------------------------
     Copy buttons
     ------------------------------------------------------------------------- */
  var liveRegion = document.getElementById('copy-status');
  var copyButtons = Array.prototype.slice.call(
    document.querySelectorAll('[data-copy-button]')
  );
  var copyTimers = new WeakMap();

  function announce(message) {
    if (!liveRegion) {
      return;
    }

    liveRegion.textContent = '';
    window.setTimeout(function () {
      liveRegion.textContent = message;
    }, 30);
  }

  function fallbackCopy(code) {
    if (!window.getSelection) {
      return false;
    }

    var selection = window.getSelection();
    if (!selection) {
      return false;
    }

    var range = document.createRange();
    range.selectNodeContents(code);
    selection.removeAllRanges();
    selection.addRange(range);

    var copied;
    try {
      copied = document.execCommand('copy');
    } catch (error) {
      copied = false;
    }

    selection.removeAllRanges();
    return copied;
  }

  function flashCopied(button) {
    var label = button.querySelector('[data-copy-label]');

    if (label) {
      label.textContent = 'Copied';
    }
    button.classList.add('is-copied');

    var existingTimer = copyTimers.get(button);
    if (existingTimer) {
      window.clearTimeout(existingTimer);
    }

    var timer = window.setTimeout(function () {
      if (label) {
        label.textContent = 'Copy';
      }
      button.classList.remove('is-copied');
      copyTimers.delete(button);
    }, COPY_FEEDBACK_MS);

    copyTimers.set(button, timer);
  }

  async function copyCode(button) {
    var block = button.closest('.code-block');
    var code = block ? block.querySelector('pre code') : null;

    if (!code) {
      return;
    }

    var copied;

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(code.textContent);
        copied = true;
      } catch (error) {
        copied = fallbackCopy(code);
      }
    } else {
      copied = fallbackCopy(code);
    }

    if (copied) {
      flashCopied(button);
      announce('Code copied to clipboard.');
    } else {
      announce('Copy failed. Select the code and copy it manually.');
    }
  }

  copyButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      copyCode(button);
    });
  });
})();
