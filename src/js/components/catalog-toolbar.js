import { disableScroll } from '../functions/disable-scroll.js';
import { enableScroll } from '../functions/enable-scroll.js';

function initCatalogSort(root) {
  const toggle = root.querySelector('[data-catalog-sort-toggle]');
  const dropdown = root.querySelector('[data-catalog-sort-dropdown]');
  const valueEl = root.querySelector('[data-catalog-sort-value]');
  const options = root.querySelectorAll('[data-catalog-sort-option]');

  if (!toggle || !dropdown || !valueEl) {
    return;
  }

  function closeSort() {
    toggle.setAttribute('aria-expanded', 'false');
    dropdown.setAttribute('aria-hidden', 'true');
    root.classList.remove('catalog-sort--open');
  }

  function openSort() {
    toggle.setAttribute('aria-expanded', 'true');
    dropdown.setAttribute('aria-hidden', 'false');
    root.classList.add('catalog-sort--open');
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();

    if (root.classList.contains('catalog-sort--open')) {
      closeSort();
    } else {
      openSort();
    }
  });

  options.forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.textContent.trim();

      valueEl.textContent = text;
      options.forEach((b) => {
        b.classList.toggle('catalog-sort__option--active', b === btn);
      });
      closeSort();
    });
  });

  document.addEventListener('click', (e) => {
    if (!root.contains(e.target)) {
      closeSort();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSort();
    }
  });
}

function initCatalogView(viewRoot, gridRoot) {
  const btnGrid = viewRoot.querySelector('[data-catalog-view="grid"]');
  const btnList = viewRoot.querySelector('[data-catalog-view="list"]');

  if (!btnGrid || !btnList) {
    return;
  }

  function setView(mode) {
    const isList = mode === 'list';

    gridRoot.classList.toggle('catalog-grid--list', isList);
    btnGrid.classList.toggle('catalog-view__btn--active', !isList);
    btnList.classList.toggle('catalog-view__btn--active', isList);
    btnGrid.setAttribute('aria-pressed', String(!isList));
    btnList.setAttribute('aria-pressed', String(isList));
  }

  btnGrid.addEventListener('click', () => setView('grid'));
  btnList.addEventListener('click', () => setView('list'));
}

function initCatalogFilterDrawer() {
  const listing = document.querySelector('[data-catalog-listing]');
  const openBtn = document.querySelector('[data-catalog-filter-open]');
  const panel = document.querySelector('[data-catalog-filter-panel]');
  const closeBtn = document.querySelector('[data-catalog-filter-close]');
  const backdrop = document.querySelector('[data-catalog-filter-backdrop]');

  if (!listing || !openBtn || !panel) {
    return;
  }

  const mqTablet = window.matchMedia('(max-width: 1024px)');

  function isDrawerMode() {
    return mqTablet.matches;
  }

  function setBackdropOpen(open) {
    if (!backdrop) {
      return;
    }

    backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  function closeDrawer() {
    if (!listing.classList.contains('catalog-listing--filter-open')) {
      return;
    }

    listing.classList.remove('catalog-listing--filter-open');
    openBtn.setAttribute('aria-expanded', 'false');
    panel.removeAttribute('aria-modal');
    panel.removeAttribute('role');
    setBackdropOpen(false);
    enableScroll();
  }

  function openDrawer() {
    if (!isDrawerMode()) {
      return;
    }

    listing.classList.add('catalog-listing--filter-open');
    openBtn.setAttribute('aria-expanded', 'true');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    setBackdropOpen(true);
    disableScroll();

    if (closeBtn) {
      closeBtn.focus();
    }
  }

  openBtn.addEventListener('click', () => {
    if (!isDrawerMode()) {
      return;
    }

    if (listing.classList.contains('catalog-listing--filter-open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  closeBtn?.addEventListener('click', () => {
    closeDrawer();
    openBtn.focus();
  });

  backdrop?.addEventListener('click', () => {
    closeDrawer();
    openBtn.focus();
  });

  mqTablet.addEventListener('change', () => {
    if (!isDrawerMode()) {
      closeDrawer();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && listing.classList.contains('catalog-listing--filter-open')) {
      closeDrawer();
      openBtn.focus();
    }
  });
}

export default function initCatalogToolbar() {
  const sortRoot = document.querySelector('[data-catalog-sort]');
  const gridRoot = document.querySelector('[data-catalog-grid]');
  const viewRoot = document.querySelector('[data-catalog-view]');

  if (sortRoot) {
    initCatalogSort(sortRoot);
  }

  if (viewRoot && gridRoot) {
    initCatalogView(viewRoot, gridRoot);
  }

  initCatalogFilterDrawer();
}
