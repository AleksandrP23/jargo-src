import { disableScroll } from '../functions/disable-scroll.js';
import { enableScroll } from '../functions/enable-scroll.js';
import { resetMenuDrawerDrill } from '../components/menu-drawer-drill.js';
import { closeHeaderSearch } from '../components/header-search.js';

(function(){
  const burgers = document?.querySelectorAll('[data-burger]');
  const menu = document?.querySelector('[data-menu]');
  const overlay = document?.querySelector('[data-menu-overlay]');
  const header = document?.querySelector('.header');
  const panel = document?.querySelector('[data-menu-panel]');
  const panelTouch = document?.querySelector('.menu__panel-touch');
  const menuCloses = document?.querySelectorAll('[data-menu-close]');

  function setPanelHidden(hidden) {
    panel?.setAttribute('aria-hidden', hidden ? 'true' : 'false');
    panelTouch?.setAttribute('aria-hidden', hidden ? 'true' : 'false');
  }

  function syncBurgers(isOpen) {
    burgers?.forEach((btn) => {
      btn.classList.toggle('burger--active', isOpen);
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      btn.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    });
  }

  function closeMenu() {
    syncBurgers(false);
    menu?.classList.remove('menu--active');
    header?.classList.remove('header--menu-open');
    setPanelHidden(true);
    resetMenuDrawerDrill();
    enableScroll();
  }

  burgers?.forEach((btn) => {
    btn.addEventListener('click', () => {
      menu?.classList.toggle('menu--active');
      const isOpen = Boolean(menu?.classList?.contains('menu--active'));

      syncBurgers(isOpen);

      if (isOpen) {
        closeHeaderSearch();
        window.graphModal?.close?.();
        header?.classList.add('header--menu-open');
        setPanelHidden(false);
        disableScroll();
      } else {
        header?.classList.remove('header--menu-open');
        setPanelHidden(true);
        resetMenuDrawerDrill();
        enableScroll();
      }
    });
  });

  overlay?.addEventListener('click', () => {
    closeMenu();
  });

  header?.addEventListener('click', (e) => {
    const link = e.target.closest('[data-menu-item]');
    if (!link || !header.contains(link)) {
      return;
    }
    closeMenu();
  });

  menuCloses?.forEach(btn => {
    btn.addEventListener('click', () => {
      closeMenu();
    });
  });
})();
