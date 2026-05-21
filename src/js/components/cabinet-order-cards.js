export default function initCabinetOrderCards() {
  document.querySelectorAll('[data-order-details-toggle]').forEach((btn) => {
    const card = btn.closest('.cabinet-order-card');

    if (!card) {
      return;
    }

    const setOpen = (isOpen) => {
      card.classList.toggle('cabinet-order-card--open', isOpen);
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    btn.addEventListener('click', () => {
      setOpen(!card.classList.contains('cabinet-order-card--open'));
    });
  });
}
