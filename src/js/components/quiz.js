import { QUIZ_STOVES } from '../data/quiz-stoves.js';
import { calculateVolume, matchStoves } from './quiz-calc.js';
import { getQuizModelDescription, printQuizResult, QUIZ_LABELS } from './quiz-print.js';

const parseDecimal = (value) => {
  const normalized = String(value).trim().replace(',', '.');

  if (!normalized) {
    return null;
  }

  const num = Number.parseFloat(normalized);

  return Number.isFinite(num) && num >= 0 ? num : null;
};

const getCheckedValue = (quiz, name) => {
  return quiz.querySelector(`input[name="${name}"]:checked`)?.value ?? null;
};

const isDimensionsStepValid = (quiz) => {
  const length = parseDecimal(quiz.querySelector('[name="quiz-length"]')?.value);
  const width = parseDecimal(quiz.querySelector('[name="quiz-width"]')?.value);
  const height = parseDecimal(quiz.querySelector('[name="quiz-height"]')?.value);

  return length !== null && width !== null && height !== null && length > 0 && width > 0 && height > 0;
};

const collectAnswers = (quiz) => {
  const length = parseDecimal(quiz.querySelector('[name="quiz-length"]')?.value);
  const width = parseDecimal(quiz.querySelector('[name="quiz-width"]')?.value);
  const height = parseDecimal(quiz.querySelector('[name="quiz-height"]')?.value);
  const areaRaw = quiz.querySelector('[name="quiz-area"]')?.value ?? '';
  const uninsulatedArea = parseDecimal(areaRaw) ?? 0;

  return {
    length,
    width,
    height,
    uninsulatedArea,
    wallMaterial: getCheckedValue(quiz, 'quiz-wall'),
    saunaType: getCheckedValue(quiz, 'quiz-sauna-type'),
    firebox: getCheckedValue(quiz, 'quiz-firebox'),
    door: getCheckedValue(quiz, 'quiz-door'),
    material: getCheckedValue(quiz, 'quiz-material'),
  };
};

const formatResultDimensions = (answers, volume) => {
  return `${answers.length}×${answers.width}×${answers.height} м (${volume} м³)`;
};

const formatResultUninsulated = (answers) => {
  return answers.uninsulatedArea > 0 ? `${answers.uninsulatedArea} м²` : '0 м²';
};

const renderResultSummary = (summaryEl, answers, volume) => {
  if (!summaryEl) {
    return;
  }

  const rows = [
    ['Размеры:', formatResultDimensions(answers, volume)],
    ['Материал стен:', QUIZ_LABELS.wall[answers.wallMaterial] ?? '—'],
    ['Топка:', QUIZ_LABELS.firebox[answers.firebox] ?? '—'],
    ['Неутеплённые поверхности:', formatResultUninsulated(answers)],
    ['Тип парной:', QUIZ_LABELS.saunaType[answers.saunaType] ?? '—'],
  ];

  const buildRow = ([label, value]) => `
    <p class="quiz-result-summary__row">
      <span class="quiz-result-summary__label">${label}</span>
      <span class="quiz-result-summary__value">${value}</span>
    </p>
  `;

  summaryEl.innerHTML = `
    <div class="quiz-result-summary__col">
      ${rows.slice(0, 3).map(buildRow).join('')}
    </div>
    <div class="quiz-result-summary__col">
      ${rows.slice(3).map(buildRow).join('')}
    </div>
  `;
};

const renderResultCards = (listEl, models) => {
  listEl.innerHTML = models.map((model, index) => {
    const isFeatured = index === 0;
    const badge = isFeatured
      ? '<span class="quiz-result-card__badge">Рекомендуем</span>'
      : '';
    const description = getQuizModelDescription(model);

    return `
      <li class="quiz-result-card${isFeatured ? ' quiz-result-card--featured' : ''}">
        ${badge}
        <article class="quiz-result-card__inner">
          <a class="quiz-result-card__link" href="${model.url}">
            <picture class="quiz-result-card__pic">
              <source srcset="${model.imageWebp}" type="image/webp">
              <img class="quiz-result-card__img" src="${model.image}" width="215" height="150" alt="">
            </picture>
            <span class="quiz-result-card__title">${model.title}</span>
            <span class="quiz-result-card__desc">${description}</span>
          </a>
        </article>
      </li>
    `;
  }).join('');
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
  const resultListEl = quiz.querySelector('[data-quiz-result-list]');
  const resultSummaryEl = quiz.querySelector('[data-quiz-result-summary]');
  const resultVolumeEl = quiz.querySelector('[data-quiz-result-volume]');
  const startBtn = quiz.querySelector('[data-quiz-start]');
  const prevBtn = quiz.querySelector('[data-quiz-prev]');
  const nextBtn = quiz.querySelector('[data-quiz-next]');
  const againBtn = quiz.querySelector('[data-quiz-again]');
  const printBtn = quiz.querySelector('[data-quiz-print]');
  const actionsEl = quiz.querySelector('[data-quiz-actions]');
  const openers = document.querySelectorAll('[data-quiz-open]');
  const fireboxInputs = quiz.querySelectorAll('input[name="quiz-firebox"]');
  const doorGlassLabel = quiz.querySelector('[data-quiz-door-glass]');
  const doorGlassInput = quiz.querySelector('input[name="quiz-door"][value="glass"]');
  const doorPlainInput = quiz.querySelector('input[name="quiz-door"][value="plain"]');
  const dimensionInputs = quiz.querySelectorAll('[name="quiz-length"], [name="quiz-width"], [name="quiz-height"]');

  let showingIntro = true;
  /** @type {number} 0..2 — шаги анкеты, 3 — экран результата */
  let stepIndex = 0;
  let showingResult = false;
  let lastResult = null;

  const isKtkSelected = () => getCheckedValue(quiz, 'quiz-firebox') === 'ktk';

  const applyKtkDoorRule = () => {
    if (!doorGlassLabel || !doorGlassInput || !doorPlainInput) {
      return;
    }

    const ktk = isKtkSelected();

    doorGlassLabel.classList.toggle('quiz-radio-card--disabled', ktk);
    doorGlassInput.disabled = ktk;

    if (ktk) {
      doorPlainInput.checked = true;
    }
  };

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
    applyKtkDoorRule();
  };

  const runCalculation = () => {
    const answers = collectAnswers(quiz);
    const volume = calculateVolume({
      length: answers.length,
      width: answers.width,
      height: answers.height,
      uninsulatedArea: answers.uninsulatedArea,
      wallMaterial: answers.wallMaterial,
    });

    const models = matchStoves(volume, {
      saunaType: answers.saunaType,
      firebox: answers.firebox,
      door: answers.door,
      material: answers.material,
    }, QUIZ_STOVES);

    return { volume, models };
  };

  const renderResultView = () => {
    showingResult = true;
    formSteps.forEach((el) => {
      el.classList.remove('quiz__step--active');
    });

    const answers = collectAnswers(quiz);
    const { volume, models } = runCalculation();
    const hasResults = models.length > 0;

    lastResult = hasResults ? { answers, volume, models } : null;

    if (hasResults) {
      renderResultSummary(resultSummaryEl, answers, volume);
    }

    if (resultVolumeEl) {
      resultVolumeEl.textContent = `${volume} м³`;
    }

    if (resultListEl && hasResults) {
      renderResultCards(resultListEl, models);
    }

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
      const hasSuccessResult = Boolean(lastResult);

      prevBtn.disabled = false;
      prevBtn.textContent = '← Назад';
      nextBtn.hidden = true;
      againBtn.hidden = false;

      if (printBtn) {
        printBtn.hidden = !hasSuccessResult;
      }

      actionsEl?.classList.toggle('quiz__actions--result-success', hasSuccessResult);
      return;
    }

    actionsEl?.classList.remove('quiz__actions--result-success');

    if (printBtn) {
      printBtn.hidden = true;
    }

    nextBtn.hidden = false;
    againBtn.hidden = true;

    if (stepIndex === 0) {
      prevBtn.disabled = true;
      nextBtn.textContent = 'Далее →';
      nextBtn.classList.remove('quiz__nav--accent');
      nextBtn.disabled = !isDimensionsStepValid(quiz);
    } else if (stepIndex === 1) {
      prevBtn.disabled = false;
      prevBtn.textContent = '← Назад';
      nextBtn.textContent = 'Далее →';
      nextBtn.classList.remove('quiz__nav--accent');
      nextBtn.disabled = false;
    } else {
      prevBtn.disabled = false;
      prevBtn.textContent = '← Назад';
      nextBtn.textContent = 'Подобрать →';
      nextBtn.classList.add('quiz__nav--accent');
      nextBtn.disabled = false;
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

  const validateFormStep = (stepEl) => {
    if (stepIndex === 0) {
      return isDimensionsStepValid(quiz);
    }

    return true;
  };

  const goNext = () => {
    if (showingIntro || showingResult) {
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

  const resetDefaults = () => {
    quiz.querySelector('[name="quiz-length"]').value = '';
    quiz.querySelector('[name="quiz-width"]').value = '';
    quiz.querySelector('[name="quiz-height"]').value = '';
    quiz.querySelector('[name="quiz-area"]').value = '';

    quiz.querySelector('input[name="quiz-wall"][value="vagon"]').checked = true;
    quiz.querySelector('input[name="quiz-sauna-type"][value="russian"]').checked = true;
    quiz.querySelector('input[name="quiz-firebox"][value="ktk"]').checked = true;
    quiz.querySelector('input[name="quiz-door"][value="plain"]').checked = true;
    quiz.querySelector('input[name="quiz-material"][value="stal"]').checked = true;

    applyKtkDoorRule();
  };

  const restartFromScratch = () => {
    resetDefaults();
    showingResult = false;
    lastResult = null;
    showIntroView();
    renderActions();
  };

  const printResult = () => {
    if (!lastResult) {
      return;
    }

    printQuizResult(lastResult);
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
  printBtn?.addEventListener('click', printResult);

  openers.forEach((opener) => {
    opener.addEventListener('click', () => {
      restartFromScratch();
    });
  });

  fireboxInputs.forEach((input) => {
    input.addEventListener('change', () => {
      applyKtkDoorRule();
    });
  });

  dimensionInputs.forEach((input) => {
    input.addEventListener('input', () => {
      if (!showingIntro && !showingResult && stepIndex === 0) {
        renderActions();
      }
    });
  });

  applyKtkDoorRule();
  render();
};

initQuiz();
