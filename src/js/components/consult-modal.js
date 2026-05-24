export default function initConsultModal() {
  document.querySelectorAll('[data-consult-messenger]').forEach((group) => {
    const buttons = group.querySelectorAll('[data-messenger]');
    const hiddenInput = group.querySelector('input[type="hidden"][name="consult-messenger"]');

    if (!buttons.length) {
      return;
    }

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        buttons.forEach((item) => {
          item.classList.remove('consult-modal__messenger-btn--active');
          item.setAttribute('aria-pressed', 'false');
        });

        button.classList.add('consult-modal__messenger-btn--active');
        button.setAttribute('aria-pressed', 'true');

        if (hiddenInput) {
          hiddenInput.value = button.dataset.messenger || '';
        }
      });
    });
  });
}
