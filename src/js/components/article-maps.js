/**
 * Яндекс.Карты JS API 2.1 — см. https://yandex.ru/maps-api/docs/
 * Ключ: <meta name="yandex-maps-api-key" content="..."> в head-article.html
 */

const YMAPS_SRC_WITH_KEY = (key) =>
  `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(key)}&lang=ru_RU`;

const YMAPS_SRC_NO_KEY = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';

let ymapsLoaderPromise;

function getMapsApiKey() {
  const meta = document.querySelector('meta[name="yandex-maps-api-key"]');
  return meta?.getAttribute('content')?.trim() || '';
}

function loadYmapsScript(apiKey) {
  if (window.ymaps) return Promise.resolve();

  if (!ymapsLoaderPromise) {
    ymapsLoaderPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.async = true;
      script.src = apiKey ? YMAPS_SRC_WITH_KEY(apiKey) : YMAPS_SRC_NO_KEY;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Не удалось загрузить API Яндекс.Карт'));
      document.head.appendChild(script);
    });
  }

  return ymapsLoaderPromise;
}

function stripMapControls(map) {
  map.controls.remove('geolocationControl');
  map.controls.remove('searchControl');
  map.controls.remove('trafficControl');
  map.controls.remove('typeSelector');
  map.controls.remove('fullscreenControl');
  map.controls.remove('zoomControl');
  map.controls.remove('rulerControl');
  map.behaviors.disable(['scrollZoom']);
}

function initContactsMap(el) {
  const lat = parseFloat(el.dataset.ymapsLat ?? '', 10);
  const lon = parseFloat(el.dataset.ymapsLon ?? '', 10);
  const zoom = Number(el.dataset.ymapsZoom) || 17;

  if (Number.isNaN(lat) || Number.isNaN(lon)) return;

  const balloon =
    el.dataset.ymapsBalloon?.trim() ||
    'Нижний Новгород, Сормовское шоссе, 1 Б, корпус 2';

  const center = [lat, lon];

  const map = new window.ymaps.Map(el, {
    center,
    zoom,
  });

  stripMapControls(map);

  map.geoObjects.add(
    new window.ymaps.Placemark(
      center,
      { balloonContent: balloon },
      {
        preset: 'islands#orangeDotIcon',
      },
    ),
  );

  el.classList.add('is-yandex-map-ready');
}

function branchRowBalloon(row) {
  const city = row.querySelector('.article-branches__city')?.textContent?.trim() ?? '';
  const addrEl = row.querySelector('.article-branches__info--address');
  const addr =
    addrEl?.textContent?.replace(/\s+/g, ' ').trim().replace(/^Адрес:\s*/i, '') ?? '';
  const lines = [city, addr ? `Адрес: ${addr}` : ''].filter(Boolean);
  return lines.join('<br>');
}

function focusBranchPlacemark(map, placemarks, index, mapContainer) {
  const pm = placemarks[index];
  if (!pm) return;

  map.setCenter(pm.geometry.getCoordinates(), 15);
  pm.balloon.open();

  mapContainer.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });
}

function initBranchesMap(mapEl) {
  const section = mapEl.closest('.article-branches');
  if (!section) return;

  const rows = section.querySelectorAll('.article-branches__row');
  const placemarks = [];
  const coordsList = [];

  rows.forEach((row) => {
    const lat = parseFloat(row.dataset.ymapsLat ?? '', 10);
    const lon = parseFloat(row.dataset.ymapsLon ?? '', 10);

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      placemarks.push(null);
      coordsList.push(null);
      return;
    }

    const coords = [lat, lon];
    coordsList.push(coords);

    placemarks.push(
      new window.ymaps.Placemark(
        coords,
        { balloonContent: branchRowBalloon(row) },
        { preset: 'islands#orangeDotIcon' },
      ),
    );
  });

  const validCoords = coordsList.filter(Boolean);
  const startCenter = validCoords[0] ?? [56.331423, 43.900887];

  const map = new window.ymaps.Map(mapEl, {
    center: startCenter,
    zoom: 4,
  });

  stripMapControls(map);

  placemarks.forEach((pm) => {
    if (pm) map.geoObjects.add(pm);
  });

  const bounds = map.geoObjects.getBounds();
  if (bounds && validCoords.length > 1) {
    map.setBounds(bounds, { checkZoomRange: true, zoomMargin: 48 });
  } else if (validCoords.length === 1) {
    map.setZoom(15);
  }

  mapEl.classList.add('is-yandex-map-ready');

  section.querySelectorAll('.js-article-branches-map-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const row = link.closest('.article-branches__row');
      if (!row) return;
      const idx = [...rows].indexOf(row);
      focusBranchPlacemark(map, placemarks, idx, mapEl);
    });
  });
}

function bootMaps() {
  const contactsEl = document.querySelector('[data-ymaps-role="contacts"]');
  const branchesEl = document.querySelector('[data-ymaps-role="branches"]');

  if (!contactsEl && !branchesEl) return;

  loadYmapsScript(getMapsApiKey())
    .then(() => {
      window.ymaps.ready(() => {
        if (contactsEl) initContactsMap(contactsEl);
        if (branchesEl) initBranchesMap(branchesEl);
      });
    })
    .catch(() => {});
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootMaps);
} else {
  bootMaps();
}
