/**
 * Подменю в `.menu__panel-touch`: кнопка `data-menu-drill` + соседний `template` с разметкой подуровня.
 */

const drawer = document.querySelector('[data-menu-drawer]');
const paneRoot = drawer?.querySelector('[data-menu-drawer-pane="root"]');
const paneSub = drawer?.querySelector('[data-menu-drawer-pane="sub"]');
const mount = drawer?.querySelector('[data-menu-drill-mount]');
const titleEl = drawer?.querySelector('[data-menu-drill-title]');

export const resetMenuDrawerDrill = () => {
  if (!drawer || !mount) {
    return;
  }

  drawer.classList.remove('menu-drawer--drill-open');
  mount.innerHTML = '';
  if (titleEl) {
    titleEl.textContent = '';
  }

  drawer.querySelectorAll('[data-menu-drill]').forEach((btn) => {
    btn.setAttribute('aria-expanded', 'false');
  });

  paneRoot?.setAttribute('aria-hidden', 'false');
  paneSub?.setAttribute('aria-hidden', 'true');
};

const openDrill = (btn) => {
  if (!drawer || !mount || !titleEl) {
    return;
  }

  const item = btn.closest('.menu-drawer__item');
  const tpl = item?.querySelector('template');

  if (!tpl?.content) {
    return;
  }

  mount.innerHTML = '';
  mount.appendChild(tpl.content.cloneNode(true));

  titleEl.textContent = btn.textContent?.trim() || '';

  drawer.classList.add('menu-drawer--drill-open');
  paneRoot?.setAttribute('aria-hidden', 'true');
  paneSub?.setAttribute('aria-hidden', 'false');

  drawer.querySelectorAll('[data-menu-drill]').forEach((b) => {
    b.setAttribute('aria-expanded', b === btn ? 'true' : 'false');
  });

  mount.scrollTop = 0;
};

const init = () => {
  if (!drawer || !mount) {
    return;
  }

  drawer.addEventListener('click', (e) => {
    const drillBtn = e.target.closest('[data-menu-drill]');
    if (drillBtn && drawer.contains(drillBtn)) {
      e.preventDefault();
      openDrill(drillBtn);
    }
  });

  drawer.querySelector('[data-menu-drill-back]')?.addEventListener('click', () => {
    resetMenuDrawerDrill();
  });
};

init();
