export default function initBathSeriesCard() {
  document.querySelectorAll('[data-bath-series-more]').forEach((btn) => {
    const block = btn.closest('[data-bath-series-expandable]');

    if (!block) {
      return;
    }

    btn.addEventListener('click', () => {
      block.classList.add('is-expanded');
      btn.setAttribute('aria-expanded', 'true');
    });
  });
}
