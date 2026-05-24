import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

const GALLERY_BREAKPOINTS = {
  0: {
    slidesPerView: 1.1,
  },
  768: {
    slidesPerView: 3,
  },
  1024: {
    slidesPerView: 4,
  },
};

const bindGalleryDots = (swiper, paginationEl) => {
  const slideCount = swiper.slides.length;

  paginationEl.replaceChildren();

  for (let i = 0; i < slideCount; i += 1) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'article-body__gallery-dot';
    dot.dataset.gallerySlide = String(i);
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Слайд ${i + 1}`);
    dot.addEventListener('click', () => {
      swiper.slideTo(i);
    });
    paginationEl.appendChild(dot);
  }

  const updateDots = () => {
    const activeIndex = swiper.activeIndex ?? 0;

    paginationEl.querySelectorAll('.article-body__gallery-dot').forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  };

  swiper.on('init', updateDots);
  swiper.on('slideChange', updateDots);
  swiper.on('breakpoint', updateDots);
  updateDots();
};

const initArticleGallery = () => {
  const galleryEls = document.querySelectorAll('[data-article-gallery-swiper]');

  galleryEls.forEach((galleryEl) => {
    const root = galleryEl.parentElement;
    if (!root) {
      return;
    }

    const useDots = galleryEl.hasAttribute('data-article-gallery-dots');
    const prevEl = root.querySelector('.article-body__gallery-nav--prev');
    const nextEl = root.querySelector('.article-body__gallery-nav--next');
    const paginationEl = root.querySelector('[data-article-gallery-pagination]');
    const currentEl = root.querySelector('[data-gallery-current]');
    const totalEl = root.querySelector('[data-gallery-total]');

    const swiper = new Swiper(galleryEl, {
      modules: [Navigation],
      slidesPerView: 4,
      spaceBetween: 10,
      breakpoints: GALLERY_BREAKPOINTS,
      ...(!useDots
        ? {
            navigation: {
              prevEl: prevEl ?? undefined,
              nextEl: nextEl ?? undefined,
            },
          }
        : {}),
    });

    if (useDots && paginationEl) {
      bindGalleryDots(swiper, paginationEl);
    }

    if (!useDots && currentEl && totalEl) {
      const updateCounter = () => {
        const current = (swiper.realIndex ?? 0) + 1;
        const total = swiper.slides.length;
        currentEl.textContent = String(current).padStart(2, '0');
        totalEl.textContent = String(total).padStart(2, '0');
      };

      swiper.on('init', updateCounter);
      swiper.on('slideChange', updateCounter);
      updateCounter();
    }
  });
};

initArticleGallery();
