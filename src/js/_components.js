import './functions/burger.js';
import './components/menu-drawer-drill.js';
import GraphModal from 'graph-modal';
import './components/header-scroll.js';
import './components/production-tabs.js';
import './components/quiz.js';
import './components/lazy-video.js';
import './components/article-toc.js';
import './components/article-gallery.js';
import './components/article-showcase.js';
import './components/chimneys-hero-slider.js';
import './components/product-rotate.js';
import './components/article-tooltips.js';
import './components/article-maps.js';
import initCatalogToolbar from './components/catalog-toolbar.js';
import './components/price-page.js';
import './components/materials-videos.js';
import initCheckoutSteppers from './components/checkout-stepper.js';
import initCabinetPasswordToggle from './components/cabinet-password-toggle.js';
import initCabinetOrderCards from './components/cabinet-order-cards.js';
import initBathSeriesCard from './components/bath-series-card.js';
import initConsultModal from './components/consult-modal.js';

initCatalogToolbar();
initCheckoutSteppers();
initCabinetPasswordToggle();
initCabinetOrderCards();
initBathSeriesCard();
initConsultModal();

window.graphModal = new GraphModal({
  isClose(modal) {
    const closedTarget = modal.modalContainer?.getAttribute('data-graph-target');

    // Очищаем iframe только при закрытии видео. При переключении quiz-hint → video сначала close() справки — iframe не затирать.
    if (closedTarget === 'video') {
      const videoContainer = document.querySelector('[data-video-container]');

      if (videoContainer) {
        videoContainer.innerHTML = '';
      }
    }

    const returnTo = window.__graphModalReturnTarget;

    if (closedTarget === 'video' && returnTo) {
      window.__graphModalReturnTarget = null;
      const target = returnTo;

      setTimeout(() => {
        modal.open(target);
      }, modal.speed);
    }
  },
});
