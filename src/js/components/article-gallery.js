import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

const initArticleGallery = () => {
  const galleryEls = document.querySelectorAll('[data-article-gallery-swiper]');

  galleryEls.forEach((galleryEl) => {
    const root = galleryEl.parentElement;
    if (!root) {
      return;
    }

    const prevEl = root.querySelector('.article-body__gallery-nav--prev');
    const nextEl = root.querySelector('.article-body__gallery-nav--next');
    const currentEl = root.querySelector('[data-gallery-current]');
    const totalEl = root.querySelector('[data-gallery-total]');

    const swiper = new Swiper(galleryEl, {
      modules: [Navigation],
      slidesPerView: 4,
      spaceBetween: 10,
      navigation: {
        prevEl: prevEl ?? undefined,
        nextEl: nextEl ?? undefined,
      },
      breakpoints: {
        0: {
          slidesPerView: 1.1,
        },
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
      },
    });

    const updateCounter = () => {
      if (!currentEl || !totalEl) {
        return;
      }

      const current = (swiper.realIndex ?? 0) + 1;
      const total = swiper.slides.length;
      currentEl.textContent = String(current).padStart(2, '0');
      totalEl.textContent = String(total).padStart(2, '0');
    };

    swiper.on('init', updateCounter);
    swiper.on('slideChange', updateCounter);
    updateCounter();
  });
};

initArticleGallery();
