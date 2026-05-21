const validateFormStep = (stepEl) => {
  const fields = stepEl.querySelectorAll('input, select, textarea');

  for (const field of fields) {
    if (!field.checkValidity()) {
      field.reportValidity();
      return false;
    }
  }

  return true;
};

const initQuiz = () => {
  const quiz = document.querySelector('[data-quiz]');

  if (!quiz) {
    return;
  }

  const introEl = quiz.querySelector('[data-quiz-intro]');
  const flowEl = quiz.querySelector('[data-quiz-flow]');
  const stepperEl = quiz.querySelector('[data-quiz-stepper]');
  const formSteps = Array.from(quiz.querySelectorAll('[data-quiz-form-step]'));
  const resultSuccessEl = quiz.querySelector('[data-quiz-result-panel="success"]');
  const resultEmptyEl = quiz.querySelector('[data-quiz-result-panel="empty"]');
  const startBtn = quiz.querySelector('[data-quiz-start]');
  const prevBtn = quiz.querySelector('[data-quiz-prev]');
  const nextBtn = quiz.querySelector('[data-quiz-next]');
  const againBtn = quiz.querySelector('[data-quiz-again]');
  const openers = document.querySelectorAll('[data-quiz-open]');

  let showingIntro = true;
  /** @type {number} 0..2 — шаги анкеты, 3 — экран результата */
  let stepIndex = 0;
  let showingResult = false;

  const demoHasResults = () => quiz.getAttribute('data-quiz-demo-results') !== 'false';

  const setPhase = (phase) => {
    if (stepperEl) {
      stepperEl.setAttribute('data-phase', String(phase));
    }
  };

  const showIntroView = () => {
    showingIntro = true;
    showingResult = false;
    stepIndex = 0;

    introEl?.removeAttribute('hidden');
    flowEl?.setAttribute('hidden', '');

    if (resultSuccessEl) {
      resultSuccessEl.hidden = true;
      resultSuccessEl.classList.remove('quiz__step--active');
    }

    if (resultEmptyEl) {
      resultEmptyEl.hidden = true;
      resultEmptyEl.classList.remove('quiz__step--active');
    }

    formSteps.forEach((el, i) => {
      el.classList.toggle('quiz__step--active', i === 0);
    });

    setPhase(0);
  };

  const showFlowView = () => {
    showingIntro = false;
    introEl?.setAttribute('hidden', '');
    flowEl?.removeAttribute('hidden');
  };

  const renderFormSteps = () => {
    formSteps.forEach((el, i) => {
      el.classList.toggle('quiz__step--active', i === stepIndex && !showingResult);
    });

    if (resultSuccessEl) {
      resultSuccessEl.hidden = true;
      resultSuccessEl.classList.remove('quiz__step--active');
    }

    if (resultEmptyEl) {
      resultEmptyEl.hidden = true;
      resultEmptyEl.classList.remove('quiz__step--active');
    }

    setPhase(stepIndex);
  };

  const renderResultView = () => {
    showingResult = true;
    formSteps.forEach((el) => {
      el.classList.remove('quiz__step--active');
    });

    const hasResults = demoHasResults();

    if (resultSuccessEl) {
      resultSuccessEl.hidden = !hasResults;
      resultSuccessEl.classList.toggle('quiz__step--active', hasResults);
    }

    if (resultEmptyEl) {
      resultEmptyEl.hidden = hasResults;
      resultEmptyEl.classList.toggle('quiz__step--active', !hasResults);
    }

    setPhase(3);
  };

  const renderActions = () => {
    if (!prevBtn || !nextBtn || !againBtn) {
      return;
    }

    if (showingIntro) {
      return;
    }

    if (showingResult) {
      prevBtn.disabled = false;
      prevBtn.textContent = '← Назад';
      nextBtn.hidden = true;
      againBtn.hidden = false;
      return;
    }

    nextBtn.hidden = false;
    againBtn.hidden = true;

    if (stepIndex === 0) {
      prevBtn.disabled = true;
      nextBtn.textContent = 'Далее →';
      nextBtn.classList.remove('quiz__nav--accent');
    } else {
      prevBtn.disabled = false;
      prevBtn.textContent = '← Назад';
      nextBtn.textContent = 'Смотреть результат →';
      nextBtn.classList.add('quiz__nav--accent');
    }
  };

  const render = () => {
    if (showingIntro) {
      showIntroView();
      renderActions();
      return;
    }

    showFlowView();

    if (showingResult) {
      renderResultView();
    } else {
      renderFormSteps();
    }

    renderActions();
  };

  const goNext = () => {
    if (showingIntro) {
      return;
    }

    if (showingResult) {
      return;
    }

    if (!validateFormStep(formSteps[stepIndex])) {
      return;
    }

    if (stepIndex < 2) {
      stepIndex += 1;
      render();
      return;
    }

    showingResult = true;
    render();
  };

  const goPrev = () => {
    if (showingIntro) {
      return;
    }

    if (showingResult) {
      showingResult = false;
      stepIndex = 2;
      render();
      return;
    }

    if (stepIndex > 0) {
      stepIndex -= 1;
      render();
    }
  };

  const restartFromScratch = () => {
    quiz.querySelectorAll('input').forEach((input) => {
      if (input.type === 'radio' || input.type === 'checkbox') {
        input.checked = false;
      } else {
        input.value = '';
      }
    });

    showingResult = false;
    showIntroView();
    renderActions();
  };

  startBtn?.addEventListener('click', () => {
    showingIntro = false;
    showingResult = false;
    stepIndex = 0;
    render();
  });

  nextBtn?.addEventListener('click', goNext);
  prevBtn?.addEventListener('click', goPrev);
  againBtn?.addEventListener('click', restartFromScratch);

  openers.forEach((opener) => {
    opener.addEventListener('click', () => {
      restartFromScratch();
    });
  });

  render();
};

initQuiz();
