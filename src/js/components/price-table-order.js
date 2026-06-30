function initPriceOrderStepper(root) {
  const input = root.querySelector('.price-order-stepper__input');
  const minusBtn = root.querySelector('.price-order-stepper__btn--minus');
  const plusBtn = root.querySelector('.price-order-stepper__btn--plus');

  if (!input || !minusBtn || !plusBtn) {
    return;
  }

  const min = Number(input.min) || 1;
  const max = input.max === '' ? Infinity : Number(input.max);
  const step = Number(input.step) || 1;

  const syncButtons = () => {
    const value = Number(input.value);

    minusBtn.disabled = Number.isNaN(value) || value <= min;
    plusBtn.disabled = Number.isNaN(value) || value >= max;
  };

  minusBtn.addEventListener('click', () => {
    const next = Math.max(min, Number(input.value) - step);

    input.value = String(next);
    syncButtons();
  });

  plusBtn.addEventListener('click', () => {
    const next = Math.min(max, Number(input.value) + step);

    input.value = String(next);
    syncButtons();
  });

  input.addEventListener('input', syncButtons);
  input.addEventListener('change', syncButtons);
  syncButtons();
}

function positionPriceOrderPopover(popover, trigger) {
  const triggerRect = trigger.getBoundingClientRect();
  const popoverRect = popover.getBoundingClientRect();
  const gap = 8;
  let top = triggerRect.bottom + gap;
  let left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;

  left = Math.max(8, Math.min(left, window.innerWidth - popoverRect.width - 8));

  if (top + popoverRect.height > window.innerHeight - 8) {
    top = triggerRect.top - popoverRect.height - gap;
  }

  popover.style.top = `${Math.max(8, top)}px`;
  popover.style.left = `${left}px`;
}

function initPriceTableOrder() {
  const cells = document.querySelectorAll('[data-price-cell-order]');

  if (!cells.length) {
    return;
  }

  const popovers = new Map();
  let activeCell = null;
  let activePopover = null;
  let activeTrigger = null;

  const closePopover = () => {
    if (!activePopover) {
      return;
    }

    activePopover.hidden = true;
    activePopover.style.removeProperty('top');
    activePopover.style.removeProperty('left');
    activeTrigger?.setAttribute('aria-expanded', 'false');
    activeCell = null;
    activePopover = null;
    activeTrigger = null;
  };

  const openPopover = (cell, trigger) => {
    closePopover();

    const popover = popovers.get(cell);

    if (!popover || !trigger) {
      return;
    }

    activeCell = cell;
    activePopover = popover;
    activeTrigger = trigger;
    trigger.setAttribute('aria-expanded', 'true');
    popover.hidden = false;

    requestAnimationFrame(() => {
      positionPriceOrderPopover(popover, trigger);
    });
  };

  const togglePopover = (cell, trigger) => {
    if (activeCell === cell && activePopover && !activePopover.hidden) {
      closePopover();
      return;
    }

    openPopover(cell, trigger);
  };

  cells.forEach((cell) => {
    const popover = cell.querySelector('[data-price-order-popover]');
    const trigger = cell.querySelector('[data-price-order-trigger]');
    const stepper = cell.querySelector('[data-price-order-stepper]');

    if (popover) {
      document.body.appendChild(popover);
      popovers.set(cell, popover);
    }

    if (stepper) {
      initPriceOrderStepper(stepper);
    }

    trigger?.addEventListener('click', (event) => {
      event.stopPropagation();
      togglePopover(cell, trigger);
    });

    popover?.querySelector('.price-order-popover__submit')?.addEventListener('click', () => {
      closePopover();
    });
  });

  document.addEventListener('click', (event) => {
    if (
      !event.target.closest('[data-price-order-popover]')
      && !event.target.closest('[data-price-order-trigger]')
    ) {
      closePopover();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closePopover();
    }
  });

  window.addEventListener('resize', () => {
    if (activePopover && activeTrigger && !activePopover.hidden) {
      positionPriceOrderPopover(activePopover, activeTrigger);
    }
  });

  document.addEventListener('scroll', () => {
    if (activePopover) {
      closePopover();
    }
  }, true);
}

initPriceTableOrder();
