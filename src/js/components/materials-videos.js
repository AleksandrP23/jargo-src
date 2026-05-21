const initMaterialsVideos = () => {
  const root = document.querySelector('[data-materials-videos]');

  if (!root) {
    return;
  }

  const previewBtn = root.querySelector('[data-materials-video-preview]');
  const picture = previewBtn?.querySelector('picture');
  const img = picture?.querySelector('img');
  const sourceWebp = picture?.querySelector('source[type="image/webp"]');
  const headingEl = root.querySelector('[data-materials-video-heading]');
  const durationEl = root.querySelector('[data-materials-video-duration]');
  const picks = root.querySelectorAll('.materials-videos__pick');

  if (!previewBtn || !picks.length) {
    return;
  }

  const applyPick = (btn) => {
    const { videoSrc, videoPoster, videoPosterWebp, videoTitle, videoDuration } = btn.dataset;

    if (videoSrc) {
      previewBtn.dataset.videoSrc = videoSrc;
    }

    if (videoPosterWebp && sourceWebp) {
      sourceWebp.srcset = videoPosterWebp;
    }

    if (videoPoster && img) {
      img.src = videoPoster;
      if (videoTitle) {
        img.alt = videoTitle;
      }
    }

    if (videoTitle && headingEl) {
      headingEl.textContent = videoTitle;
    }

    if (videoDuration && durationEl) {
      durationEl.textContent = videoDuration;
    }

    if (videoTitle) {
      previewBtn.setAttribute('aria-label', `Открыть видео: ${videoTitle}`);
    }

    picks.forEach((el) => el.classList.remove('materials-videos__pick--active'));
    btn.classList.add('materials-videos__pick--active');
  };

  picks.forEach((btn) => {
    btn.addEventListener('click', () => applyPick(btn));
  });

  const active = root.querySelector('.materials-videos__pick--active');

  if (active) {
    applyPick(active);
  } else if (picks[0]) {
    applyPick(picks[0]);
  }
};

initMaterialsVideos();
