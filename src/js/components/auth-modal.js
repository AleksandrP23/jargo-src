export default function initAuthModal() {
  const resetForm = document.querySelector('[data-password-reset-form]');
  const successEmailNode = document.querySelector('[data-password-reset-success-email]');

  if (!resetForm) {
    return;
  }

  resetForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const emailInput = resetForm.querySelector('[name="password-reset-email"]');
    const email = emailInput?.value.trim() || '';

    if (successEmailNode) {
      successEmailNode.textContent = email || 'example@mail.ru';
    }

    const modal = window.graphModal;

    if (!modal) {
      return;
    }

    modal._nextContainer = document.querySelector('[data-graph-target="password-reset-success"]');
    modal.reOpen = true;
    modal.close();
  });
}
