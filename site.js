/* Progressive enhancements. All research content is present in the HTML. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const root = document.documentElement;
  const themeButton = $('.theme-toggle');
  const menuButton = $('.menu-toggle');
  const mobileNav = $('#mobile-nav');
  let toastTimer;

  function notify(message) {
    const toast = $('#toast');
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('visible');
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3500);
  }

  function setTheme(theme) {
    root.dataset.theme = theme;
    themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
    themeButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    $('meta[name="theme-color"]').content = theme === 'dark' ? '#14251d' : '#f7f7ef';
    try { localStorage.setItem('sr-theme', theme); } catch (_) { /* Storage is optional. */ }
  }
  themeButton.hidden = false;
  setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
  themeButton.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  function closeMenu(returnFocus = false) {
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    $('use', menuButton).setAttribute('href', '#i-menu');
    if (returnFocus) menuButton.focus();
  }
  menuButton.hidden = false;
  menuButton.addEventListener('click', () => {
    const opening = mobileNav.hidden;
    mobileNav.hidden = !opening;
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
    $('use', menuButton).setAttribute('href', opening ? '#i-close' : '#i-menu');
  });
  $$('a', mobileNav).forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileNav.hidden) closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!mobileNav.hidden && !event.target.closest('.site-header')) closeMenu();
  });
  const desktopMedia = window.matchMedia('(min-width: 761px)');
  desktopMedia.addEventListener?.('change', event => { if (event.matches) closeMenu(); });

  const mapCopy = {
    ai: ['01 / 03', 'How can AI agents reason, coordinate, and operate reliably in real systems?'],
    mobility: ['02 / 03', 'How can connected vehicles use behavior and context to make safer decisions together?'],
    trust: ['03 / 03', 'How can trustworthy evidence and well-designed incentives encourage cooperative behavior?']
  };
  $$('.map-node').forEach(button => {
    button.disabled = false;
    button.addEventListener('click', () => {
      const focus = button.dataset.map;
      $$('.map-node').forEach(node => {
        const active = node === button;
        node.classList.toggle('active', active);
        node.setAttribute('aria-pressed', String(active));
      });
      $('.map-canvas').dataset.focus = focus;
      $('#map-number').textContent = mapCopy[focus][0];
      $('#map-description').textContent = mapCopy[focus][1];
    });
  });
  $('.map-hint').hidden = false;

  const papers = JSON.parse($('#publication-data').textContent);
  const records = new Map(papers.map(paper => [paper.id, paper]));
  const publicationRows = $$('.publication');
  const searchInput = $('#publication-search');
  const statusSelect = $('#publication-status');
  let activeTopic = 'all';
  $('.publication-controls').hidden = false;

  const normalize = text => text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  publicationRows.forEach(row => {
    const paper = records.get(row.dataset.id);
    row.dataset.search = normalize([paper.title, paper.authors, paper.venue, paper.status, paper.year, paper.description].join(' '));
  });

  function applyFilters() {
    const terms = normalize(searchInput.value.trim()).split(/\s+/).filter(Boolean);
    let count = 0;
    publicationRows.forEach(row => {
      const matches = (activeTopic === 'all' || row.dataset.topic === activeTopic)
        && (statusSelect.value === 'all' || row.dataset.status === statusSelect.value)
        && terms.every(term => row.dataset.search.includes(term));
      row.hidden = !matches;
      if (matches) count++;
    });
    $$('.filter-buttons .filter-button').forEach(button => {
      const active = button.dataset.filter === activeTopic;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    $('#publication-count').textContent = `${count} ${count === 1 ? 'work' : 'works'}${count === papers.length ? ' · newest first' : ` of ${papers.length}`}`;
    $('#publication-empty').hidden = count !== 0;
  }
  $$('.filter-buttons .filter-button').forEach(button => button.addEventListener('click', () => {
    activeTopic = button.dataset.filter;
    applyFilters();
  }));
  searchInput.addEventListener('input', applyFilters);
  statusSelect.addEventListener('change', applyFilters);
  $('#reset-filters').addEventListener('click', () => {
    activeTopic = 'all'; searchInput.value = ''; statusSelect.value = 'all'; applyFilters(); searchInput.focus();
  });
  $$('[data-topic-link]').forEach(link => link.addEventListener('click', () => {
    activeTopic = link.dataset.topicLink; searchInput.value = ''; statusSelect.value = 'all'; applyFilters();
  }));

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(text); return true; } catch (_) { /* Try local copy fallback. */ }
    }
    const previous = document.activeElement;
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('aria-label', 'Text to copy');
    textarea.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;';
    const host = $('#citation-dialog').open ? $('#citation-dialog') : document.body;
    host.append(textarea);
    textarea.focus(); textarea.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (_) { /* Allow manual selection below. */ }
    textarea.remove();
    previous?.focus();
    return copied;
  }

  const dialog = $('#citation-dialog');
  const citationText = $('#citation-text');
  let activePaper;
  let citationFormat = 'text';
  let citationOpener;
  function updateCitation() {
    citationText.value = citationFormat === 'bibtex' ? activePaper.bibtex : activePaper.citation;
    $$('[data-citation-format]').forEach(button => {
      const active = button.dataset.citationFormat === citationFormat;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    $('#citation-status').textContent = '';
  }
  $$('.cite-button').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      citationOpener = button;
      activePaper = records.get(button.dataset.cite);
      citationFormat = 'text';
      $('#citation-paper-title').textContent = activePaper.title;
      updateCitation();
      dialog.showModal();
      $('#close-citation').focus();
    });
  });
  $$('[data-citation-format]').forEach(button => button.addEventListener('click', () => {
    citationFormat = button.dataset.citationFormat; updateCitation();
  }));
  $('#close-citation').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => citationOpener?.focus());
  $('#copy-citation').addEventListener('click', async () => {
    const copied = await copyText(citationText.value);
    $('#citation-status').textContent = copied ? 'Citation copied.' : 'Select and copy the citation below.';
    if (!copied) { citationText.focus(); citationText.select(); }
  });
  $('#copy-email').hidden = false;
  $('#copy-email').addEventListener('click', async () => {
    const email = $('.contact-email').getAttribute('href').replace(/^mailto:/, '');
    const copied = await copyText(email);
    notify(copied ? 'Email address copied.' : 'Could not copy. Use the Email me link to open your mail app.');
  });

  if ('IntersectionObserver' in window) {
    const navLinks = $$('.desktop-nav a');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const active = link.hash === `#${entry.target.id}`;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-10% 0px -65% 0px', threshold: 0 });
    $$('main > section[id]').forEach(section => observer.observe(section));
  }
  $('#copyright-year').textContent = String(new Date().getFullYear());
  $('#print-profile').hidden = false;
  $('#print-profile').addEventListener('click', () => window.print());
})();
