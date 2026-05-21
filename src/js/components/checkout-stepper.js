function initCheckoutStepper(root) {
  const input = root.querySelector('.checkout-stepper__input');
  const minusBtn = root.querySelector('.checkout-stepper__btn--minus');
  const plusBtn = root.querySelector('.checkout-stepper__btn--plus');

  if (!input || !minusBtn || !plusBtn) {
    return;
  }

  if (root.hasAttribute('data-disabled') || input.disabled) {
    return;
  }

  const min = Number(input.min) || 0;
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
    input.dispatchEvent(new Event('change', { bubbles: true }));
    syncButtons();
  });

  plusBtn.addEventListener('click', () => {
    const next = Math.min(max, Number(input.value) + step);

    input.value = String(next);
    input.dispatchEvent(new Event('change', { bubbles: true }));
    syncButtons();
  });

  input.addEventListener('input', syncButtons);
  input.addEventListener('change', syncButtons);
  syncButtons();
}

export default function initCheckoutSteppers() {
  document.querySelectorAll('[data-checkout-stepper]').forEach(initCheckoutStepper);
}
