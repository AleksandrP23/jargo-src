import Swiper from 'swiper';

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

const getActiveSlideIndex = (swiper) => swiper.activeIndex ?? 0;

const goToSlide = (swiper, index, slideCount) => {
  const targetIndex = ((index % slideCount) + slideCount) % slideCount;
  swiper.slideTo(targetIndex);
};

const bindCyclicNavigation = (swiper, prevEl, nextEl, slideCount) => {
  if (slideCount < 2) {
    return;
  }

  nextEl?.addEventListener('click', (event) => {
    event.preventDefault();
    goToSlide(swiper, getActiveSlideIndex(swiper) + 1, slideCount);
  });

  prevEl?.addEventListener('click', (event) => {
    event.preventDefault();
    goToSlide(swiper, getActiveSlideIndex(swiper) - 1, slideCount);
  });
};

const bindGalleryDots = (swiper, paginationEl, slideCount) => {
  paginationEl.replaceChildren();

  for (let i = 0; i < slideCount; i += 1) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'article-body__gallery-dot';
    dot.dataset.gallerySlide = String(i);
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Слайд ${i + 1}`);
    dot.addEventListener('click', () => {
      goToSlide(swiper, i, slideCount);
    });
    paginationEl.appendChild(dot);
  }

  const updateDots = () => {
    const activeIndex = getActiveSlideIndex(swiper);

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
    const slideCount = galleryEl.querySelectorAll('.swiper-slide').length;

    const swiper = new Swiper(galleryEl, {
      slidesPerView: 4,
      spaceBetween: 10,
      breakpoints: GALLERY_BREAKPOINTS,
    });

    if (!useDots) {
      bindCyclicNavigation(swiper, prevEl, nextEl, slideCount);
    }

    if (useDots && paginationEl) {
      bindGalleryDots(swiper, paginationEl, slideCount);
    }

    if (!useDots && currentEl && totalEl) {
      const updateCounter = () => {
        const current = getActiveSlideIndex(swiper) + 1;
        currentEl.textContent = String(current).padStart(2, '0');
        totalEl.textContent = String(slideCount).padStart(2, '0');
      };

      swiper.on('init', updateCounter);
      swiper.on('slideChange', updateCounter);
      updateCounter();
    }
  });
};

initArticleGallery();
