export default function initCabinetPasswordToggle() {
  document.querySelectorAll('[data-password-toggle]').forEach((btn) => {
    const control = btn.closest('.cabinet-field__control');
    const input = control?.querySelector('.cabinet-field__input');

    if (!input) {
      return;
    }

    btn.addEventListener('click', () => {
      const isHidden = input.type === 'password';

      input.type = isHidden ? 'text' : 'password';
      btn.setAttribute('aria-pressed', String(isHidden));
      btn.setAttribute('aria-label', isHidden ? 'Скрыть пароль' : 'Показать пароль');
    });
  });
}
