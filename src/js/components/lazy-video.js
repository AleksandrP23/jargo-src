const initLazyVideo = () => {
  const triggerList = document.querySelectorAll('[data-video-modal]');
  const videoContainer = document.querySelector('[data-video-container]');

  if (!triggerList.length || !videoContainer) {
    return;
  }

  document.addEventListener(
    'click',
    (event) => {
      const trigger = event.target.closest('[data-graph-path="video"]');

      if (!trigger) {
        return;
      }

      if (trigger.dataset.graphReturn) {
        window.__graphModalReturnTarget = trigger.dataset.graphReturn;
      } else {
        window.__graphModalReturnTarget = null;
      }
    },
    true,
  );

  triggerList.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const src = trigger.dataset.videoSrc;

      if (!src) {
        return;
      }

      videoContainer.innerHTML = `<iframe src="${src}" title="Видео" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
    });
  });
};

initLazyVideo();
