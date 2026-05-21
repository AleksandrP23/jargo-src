const header = document.querySelector('.header');
const panel = document.querySelector('[data-header-search]');
const toggles = document.querySelectorAll('[data-header-search-toggle]');
const closeBtns = document.querySelectorAll('[data-header-search-close]');
const input = document.querySelector('[data-header-search-input]');
const form = panel?.querySelector('.header-search__form');

export const closeHeaderSearch = () => {
  if (!panel || !header) {
    return;
  }

  panel.hidden = true;
  panel.setAttribute('aria-hidden', 'true');
  header.classList.remove('header--search-open');
  toggles.forEach((btn) => {
    btn.setAttribute('aria-expanded', 'false');
  });
};

const openHeaderSearch = () => {
  if (!panel || !header) {
    return;
  }

  if (header.classList.contains('header--menu-open')) {
    document.querySelector('[data-menu-overlay]')?.click();
  }

  panel.hidden = false;
  panel.setAttribute('aria-hidden', 'false');
  header.classList.add('header--search-open');
  toggles.forEach((btn) => {
    btn.setAttribute('aria-expanded', 'true');
  });
  input?.focus();
};

const toggleSearch = () => {
  if (panel?.hidden) {
    openHeaderSearch();
  } else {
    closeHeaderSearch();
  }
};

toggles.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleSearch();
  });
});

closeBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    closeHeaderSearch();
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && header?.classList.contains('header--search-open')) {
    closeHeaderSearch();
  }
});

form?.addEventListener('submit', (e) => {
  e.preventDefault();
});
