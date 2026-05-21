import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';

const initChimneysHeroSlider = () => {
  const el = document.querySelector('[data-chimneys-hero-slider]');
  const captionEl = document.querySelector('[data-chimneys-hero-caption]');

  if (!el) {
    return;
  }

  const paginationEl =
    el.closest('.hero__media--chimneys')?.querySelector('[data-chimneys-hero-pagination]') ?? null;

  const swiper = new Swiper(el, {
    modules: [Pagination],
    slidesPerView: 1,
    spaceBetween: 0,
    watchOverflow: true,
    ...(paginationEl
      ? {
          pagination: {
            el: paginationEl,
            clickable: true,
          },
        }
      : {}),
  });

  const syncCaption = () => {
    if (!captionEl) {
      return;
    }

    const slide = swiper.slides[swiper.activeIndex];
    const caption = slide?.dataset?.caption;

    if (caption) {
      captionEl.textContent = caption;
    }
  };

  swiper.on('slideChange', syncCaption);
  syncCaption();
};

initChimneysHeroSlider();
