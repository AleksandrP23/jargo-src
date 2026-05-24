function initPriceFilter(root) {
  const toggle = root.querySelector('[data-price-filter-toggle]');
  const dropdown = root.querySelector('[data-price-filter-dropdown]');
  const labelEl = root.querySelector('.price-filter__label');
  const options = root.querySelectorAll('[data-price-filter-option]');

  if (!toggle || !dropdown || !labelEl) {
    return;
  }

  const filterName = labelEl.textContent.trim();

  function closeFilter() {
    toggle.setAttribute('aria-expanded', 'false');
    dropdown.setAttribute('aria-hidden', 'true');
    root.classList.remove('price-filter--open');
  }

  function openFilter() {
    document.querySelectorAll('[data-price-filter].price-filter--open').forEach((openRoot) => {
      if (openRoot !== root) {
        const openToggle = openRoot.querySelector('[data-price-filter-toggle]');
        const openDropdown = openRoot.querySelector('[data-price-filter-dropdown]');

        openRoot.classList.remove('price-filter--open');
        openToggle?.setAttribute('aria-expanded', 'false');
        openDropdown?.setAttribute('aria-hidden', 'true');
      }
    });

    toggle.setAttribute('aria-expanded', 'true');
    dropdown.setAttribute('aria-hidden', 'false');
    root.classList.add('price-filter--open');
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();

    if (root.classList.contains('price-filter--open')) {
      closeFilter();
    } else {
      openFilter();
    }
  });

  const activeOption = root.querySelector('.price-filter__option--active');
  const initialValue = activeOption?.textContent.trim() || '';

  if (initialValue) {
    toggle.setAttribute('aria-label', `${filterName}, выбрано: ${initialValue}`);
  }

  options.forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.textContent.trim();

      toggle.setAttribute('aria-label', `${filterName}, выбрано: ${text}`);
      options.forEach((option) => {
        option.classList.toggle('price-filter__option--active', option === btn);
      });
      closeFilter();
    });
  });
}

function initPriceFilters() {
  document.querySelectorAll('[data-price-filter]').forEach(initPriceFilter);

  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-price-filter]')) {
      document.querySelectorAll('[data-price-filter].price-filter--open').forEach((root) => {
        const toggle = root.querySelector('[data-price-filter-toggle]');
        const dropdown = root.querySelector('[data-price-filter-dropdown]');

        root.classList.remove('price-filter--open');
        toggle?.setAttribute('aria-expanded', 'false');
        dropdown?.setAttribute('aria-hidden', 'true');
      });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('[data-price-filter].price-filter--open').forEach((root) => {
        const toggle = root.querySelector('[data-price-filter-toggle]');
        const dropdown = root.querySelector('[data-price-filter-dropdown]');

        root.classList.remove('price-filter--open');
        toggle?.setAttribute('aria-expanded', 'false');
        dropdown?.setAttribute('aria-hidden', 'true');
      });
    }
  });
}

function initPriceToolbar() {
  const toolbar = document.querySelector('[data-price-toolbar]');

  if (!toolbar) {
    return;
  }

  const modeSwitch = toolbar.querySelector('[data-price-mode-switch]');
  const markupInput = toolbar.querySelector('[data-price-markup]');
  const markupClear = toolbar.querySelector('.price-toolbar__markup-clear');

  const setDiscountMode = (isDiscount) => {
    document.body.classList.toggle('price-toolbar--discount', isDiscount);

    if (modeSwitch) {
      modeSwitch.setAttribute('aria-checked', String(isDiscount));
    }
  };

  if (modeSwitch) {
    modeSwitch.addEventListener('click', () => {
      const isDiscount = modeSwitch.getAttribute('aria-checked') === 'true';
      setDiscountMode(!isDiscount);
    });
  }

  if (markupClear && markupInput) {
    markupClear.addEventListener('click', () => {
      markupInput.value = '0';
      markupInput.focus();
    });
  }
}

const initPricePage = () => {
  initPriceToolbar();
  initPriceFilters();

  document.querySelectorAll('[data-price-expand]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const group = btn.closest('[data-price-group]');

      if (group) {
        group.classList.add('price-group--expanded');
      }
    });
  });

  document.querySelectorAll('[data-price-series-link]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-price-series-link]').forEach((el) => {
        el.classList.remove('price-series-nav__btn--active');
      });
      btn.classList.add('price-series-nav__btn--active');
    });
  });
};

initPricePage();
