import GraphTabs from 'graph-tabs';

const initProductionTabs = () => {
  const tabsEl = document.querySelector('[data-tabs="production-tabs"]');

  if (!tabsEl) {
    return;
  }

  new GraphTabs('production-tabs');
};

initProductionTabs();
