const STEP_PX = 72;

const mod = (a, n) => ((a % n) + n) % n;

const getLayers = (root) => Array.from(root.querySelectorAll('[data-product-rotate-layer]'));

const setFrame = (root, index) => {
  const layers = getLayers(root);
  const n = layers.length;
  if (n === 0) {
    return;
  }

  const i = mod(index, n);

  layers.forEach((layer, idx) => {
    layer.classList.toggle('is-active', idx === i);
    layer.setAttribute('aria-hidden', idx === i ? 'false' : 'true');
  });

  root.dataset.productRotateIndex = String(i);
};

const initProductRotateRoot = (root) => {
  const viewport = root.querySelector('.product-rotate__viewport');
  const hint = root.querySelector('.product-rotate__hint');
  const layers = getLayers(root);

  if (!viewport || layers.length < 2) {
    return;
  }

  const n = layers.length;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    root.classList.add('product-rotate--reduced-motion');
  }

  let index = 0;
  let dragStartX = 0;
  let dragOriginIndex = 0;
  let activePointerId = null;

  const applyIndex = (raw) => {
    index = mod(raw, n);
    setFrame(root, index);
  };

  applyIndex(0);

  hint?.addEventListener('click', () => {
    applyIndex(index + 1);
  });

  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      applyIndex(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      applyIndex(index + 1);
    }
  });

  const onPointerMove = (e) => {
    if (activePointerId !== null && e.pointerId !== activePointerId) {
      return;
    }

    const delta = e.clientX - dragStartX;
    const steps = Math.trunc(delta / STEP_PX);
    const next = mod(dragOriginIndex + steps, n);

    if (next !== index) {
      applyIndex(next);
    }
  };

  const endDrag = (e) => {
    if (activePointerId !== null && e.pointerId !== activePointerId) {
      return;
    }

    root.classList.remove('is-dragging');
    viewport.removeEventListener('pointermove', onPointerMove);
    viewport.removeEventListener('pointerup', endDrag);
    viewport.removeEventListener('pointercancel', endDrag);

    try {
      viewport.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }

    activePointerId = null;
  };

  viewport.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) {
      return;
    }

    e.preventDefault();

    activePointerId = e.pointerId;
    dragStartX = e.clientX;
    dragOriginIndex = index;
    root.classList.add('is-dragging');
    viewport.setPointerCapture(e.pointerId);
    viewport.addEventListener('pointermove', onPointerMove);
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
  });
};

const initProductRotate = () => {
  document.querySelectorAll('[data-product-rotate]').forEach(initProductRotateRoot);
};

initProductRotate();
