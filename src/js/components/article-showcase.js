import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

const MOBILE_MQ = '(max-width: 560px)';

const initArticleShowcase = () => {
  const sliders = document.querySelectorAll('[data-article-showcase-swiper]');

  sliders.forEach((rootEl) => {
    const prevEl = rootEl.querySelector('.article-showcase__nav--prev');
    const nextEl = rootEl.querySelector('.article-showcase__nav--next');
    const currentEl = rootEl.querySelector('[data-showcase-current]');
    const totalEl = rootEl.querySelector('[data-showcase-total]');
    let swiper;
    const mq = window.matchMedia(MOBILE_MQ);

    const enableSwiper = () => {
      swiper = new Swiper(rootEl, {
        modules: [Navigation],
        slidesPerView: 1.08,
        spaceBetween: 12,
        watchOverflow: true,
        navigation: {
          prevEl: prevEl ?? undefined,
          nextEl: nextEl ?? undefined,
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
    };

    const checker = () => {
      if (mq.matches) {
        if (swiper === undefined) {
          enableSwiper();
        }
      } else if (swiper !== undefined) {
        swiper.destroy(true, true);
        swiper = undefined;
      }
    };

    mq.addEventListener('change', checker);
    checker();
  });
};

initArticleShowcase();
