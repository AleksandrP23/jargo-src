import { CHIMNEY_SCHEMES, GENERATOR_TYPES } from '../data/chimney-schemes.js';
import {
  calculateBillOfMaterials,
  getAvailableSchemes,
} from './chimney-configurator-calc.js';
import { printChimneyResult } from './chimney-configurator-print.js';

const parseDecimal = (value) => {
  const normalized = String(value).trim().replace(',', '.');

  if (!normalized) {
    return null;
  }

  const num = Number.parseFloat(normalized);

  return Number.isFinite(num) ? num : null;
};

const parseInteger = (value) => {
  const normalized = String(value).trim();

  if (!normalized) {
    return null;
  }

  const num = Number.parseInt(normalized, 10);

  return Number.isFinite(num) ? num : null;
};

const isHeightValid = (value) => {
  const num = parseDecimal(value);

  if (num === null || num < 1 || num > 20) {
    return false;
  }

  return Math.abs(num * 2 - Math.round(num * 2)) < 0.001;
};

const isFloorsValid = (value) => {
  const num = parseInteger(value);

  return num !== null && num >= 0 && num <= 5;
};

const getCheckedValue = (root, name) => {
  return root.querySelector(`input[name="${name}"]:checked`)?.value ?? null;
};

const getGeneratorTitle = (generatorId) => {
  return GENERATOR_TYPES.find((item) => item.id === generatorId)?.title ?? '—';
};

const getSchemeContextLabel = (generatorId, hasTank) => {
  const title = getGeneratorTitle(generatorId);

  if (generatorId === 'bath') {
    return `${title} — ${hasTank ? 'с баком' : 'без бака'}`;
  }

  return title;
};

const getItemNote = (name, index) => {
  if (index === 0) {
    return 'Первый элемент от печи';
  }

  if (name === 'ППУ') {
    return 'Проходной узел';
  }

  return '';
};

const collectAnswers = (root) => {
  const generator = getCheckedValue(root, 'chimney-generator');
  const hasTank = getCheckedValue(root, 'chimney-tank') === 'yes';
  const schemeId = Number.parseInt(getCheckedValue(root, 'chimney-scheme') ?? '', 10);
  const height = parseDecimal(root.querySelector('[name="chimney-height"]')?.value);
  const floors = parseInteger(root.querySelector('[name="chimney-floors"]')?.value) ?? 0;

  return {
    generator,
    hasTank,
    schemeId,
    height,
    floors,
  };
};

const renderSchemeCards = (container, schemes, selectedId) => {
  container.innerHTML = schemes.map((scheme) => {
    const checked = scheme.id === selectedId ? 'checked' : '';

    return `
      <label class="chimney-scheme-card">
        <input class="visually-hidden chimney-scheme-card__input" type="radio" name="chimney-scheme" value="${scheme.id}" ${checked}>
        <span class="chimney-scheme-card__box">
          <span class="chimney-scheme-card__head">
            <span class="chimney-scheme-card__control" aria-hidden="true"></span>
            <span class="chimney-scheme-card__text-wrap">
              <span class="chimney-scheme-card__num">Схема ${scheme.id}</span>
              <span class="chimney-scheme-card__title">${scheme.cardTitle ?? scheme.title}</span>
            </span>
          </span>
          <span class="chimney-scheme-card__pic">
            <img class="chimney-scheme-card__img" src="img/chimneys/scheme-${scheme.id}.svg" width="100" height="120" alt="" aria-hidden="true">
          </span>
        </span>
      </label>
    `;
  }).join('');
};

const renderResultChips = (container, answers) => {
  const scheme = CHIMNEY_SCHEMES[answers.schemeId];
  const chips = [getGeneratorTitle(answers.generator)];

  if (answers.generator === 'bath') {
    chips.push(`Бак: ${answers.hasTank ? 'да' : 'нет'}`);
  }

  if (scheme) {
    chips.push(`Схема ${scheme.id}`);
  }

  chips.push(`Высота: ${answers.height} м`);
  chips.push(`Перекрытий: ${answers.floors}`);

  container.innerHTML = chips.map((chip) => {
    return `<span class="chimney-result__chip">${chip}</span>`;
  }).join('');

  return chips;
};

const renderResultScheme = (schemeEl, answers) => {
  if (!schemeEl) {
    return '';
  }

  const scheme = CHIMNEY_SCHEMES[answers.schemeId];

  if (!scheme) {
    schemeEl.hidden = true;
    schemeEl.textContent = '';
    return '';
  }

  const label = `Схема ${scheme.id} - ${scheme.cardTitle ?? scheme.title}`;
  schemeEl.textContent = label;
  schemeEl.hidden = false;
  return label;
};

const buildResultItemHtml = (item, index) => {
  const note = getItemNote(item.name, index);
  const noteHtml = note
    ? `<span class="chimney-result__note">${note}</span>`
    : '';

  return `
    <li class="chimney-result__item">
      <span class="chimney-result__num">${index + 1}</span>
      <span class="chimney-result__body">
        <span class="chimney-result__name">${item.name}</span>
        ${noteHtml}
      </span>
      <span class="chimney-result__qty">${item.quantity} шт</span>
    </li>
  `;
};

const renderResultList = (listCols, items) => {
  const midpoint = Math.ceil(items.length / 2);
  const columns = [
    items.slice(0, midpoint),
    items.slice(midpoint),
  ];

  listCols.forEach((listEl, columnIndex) => {
    if (!listEl) {
      return;
    }

    const columnItems = columns[columnIndex] ?? [];
    const offset = columnIndex === 0 ? 0 : midpoint;

    listEl.innerHTML = columnItems.map((item, index) => {
      return buildResultItemHtml(item, offset + index);
    }).join('');
  });
};

const initChimneyConfigurator = () => {
  const root = document.querySelector('[data-chimney-configurator]');

  if (!root) {
    return;
  }

  const introEl = root.querySelector('[data-chimney-intro]');
  const flowEl = root.querySelector('[data-chimney-flow]');
  const stepperEl = root.querySelector('[data-chimney-stepper]');
  const formSteps = Array.from(root.querySelectorAll('[data-chimney-form-step]'));
  const resultPanelEl = root.querySelector('[data-chimney-result-panel]');
  const schemesContainer = root.querySelector('[data-chimney-schemes]');
  const schemeDescEl = root.querySelector('[data-chimney-scheme-desc]');
  const tankGroupEl = root.querySelector('[data-chimney-tank-group]');
  const resultChipsEl = root.querySelector('[data-chimney-result-chips]');
  const resultSchemeEl = root.querySelector('[data-chimney-result-scheme]');
  const resultListCols = Array.from(root.querySelectorAll('[data-chimney-result-list-col]'));
  const startBtn = root.querySelector('[data-chimney-start]');
  const prevBtn = root.querySelector('[data-chimney-prev]');
  const nextBtn = root.querySelector('[data-chimney-next]');
  const againBtn = root.querySelector('[data-chimney-again]');
  const printBtn = root.querySelector('[data-chimney-print]');
  const actionsEl = root.querySelector('[data-chimney-actions]');
  const openers = document.querySelectorAll('[data-chimney-configurator-open]');
  const generatorInputs = root.querySelectorAll('input[name="chimney-generator"]');
  const tankInputs = root.querySelectorAll('input[name="chimney-tank"]');
  const paramInputs = root.querySelectorAll('[name="chimney-height"], [name="chimney-floors"]');

  let showingIntro = true;
  let stepIndex = 0;
  let showingResult = false;
  let lastResult = null;

  const isBathSelected = () => getCheckedValue(root, 'chimney-generator') === 'bath';
  const hasTankSelected = () => getCheckedValue(root, 'chimney-tank') === 'yes';

  const updateSchemeDescription = () => {
    if (!schemeDescEl) {
      return;
    }

    const generator = getCheckedValue(root, 'chimney-generator');

    if (!generator) {
      schemeDescEl.textContent = 'Выберите подходящую схему вывода дымохода';
      return;
    }

    const context = getSchemeContextLabel(generator, hasTankSelected());
    schemeDescEl.textContent = `Выберите подходящую схему вывода дымохода (${context})`;
  };

  const applyTankVisibility = () => {
    if (!tankGroupEl) {
      return;
    }

    const showTank = isBathSelected();
    tankGroupEl.hidden = !showTank;

    if (!showTank) {
      root.querySelector('input[name="chimney-tank"][value="no"]').checked = true;
    }

    updateSchemeDescription();
  };

  const refreshSchemeCards = (preserveSelection = true) => {
    const generator = getCheckedValue(root, 'chimney-generator');

    if (!generator || !schemesContainer) {
      return;
    }

    const schemes = getAvailableSchemes(generator, hasTankSelected());
    const currentSchemeId = preserveSelection
      ? Number.parseInt(getCheckedValue(root, 'chimney-scheme') ?? '', 10)
      : null;
    const validIds = schemes.map((scheme) => scheme.id);
    const selectedId = validIds.includes(currentSchemeId) ? currentSchemeId : null;

    renderSchemeCards(schemesContainer, schemes, selectedId);
    updateSchemeDescription();
  };

  const isStepValid = () => {
    if (stepIndex === 0) {
      return Boolean(getCheckedValue(root, 'chimney-generator'));
    }

    if (stepIndex === 1) {
      return Boolean(getCheckedValue(root, 'chimney-scheme'));
    }

    if (stepIndex === 2) {
      const heightRaw = root.querySelector('[name="chimney-height"]')?.value ?? '';
      const floorsRaw = root.querySelector('[name="chimney-floors"]')?.value ?? '';

      return isHeightValid(heightRaw) && isFloorsValid(floorsRaw);
    }

    return true;
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

    if (resultPanelEl) {
      resultPanelEl.hidden = true;
      resultPanelEl.classList.remove('quiz__step--active');
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

    if (resultPanelEl) {
      resultPanelEl.hidden = true;
      resultPanelEl.classList.remove('quiz__step--active');
    }

    setPhase(stepIndex);
    applyTankVisibility();

    if (stepIndex === 1) {
      refreshSchemeCards();
    }
  };

  const runCalculation = () => {
    const answers = collectAnswers(root);

    const items = calculateBillOfMaterials({
      schemeId: answers.schemeId,
      height: answers.height,
      floors: answers.floors,
      hasTank: answers.hasTank,
    });

    return { answers, items };
  };

  const renderResultView = () => {
    showingResult = true;
    formSteps.forEach((el) => {
      el.classList.remove('quiz__step--active');
    });

    const { answers, items } = runCalculation();
    lastResult = { answers, items, chips: [] };

    if (resultChipsEl) {
      const chips = renderResultChips(resultChipsEl, answers);
      const schemeLabel = renderResultScheme(resultSchemeEl, answers);
      lastResult.chips = schemeLabel ? [schemeLabel, ...chips] : chips;
    }

    renderResultList(resultListCols, items);

    if (resultPanelEl) {
      resultPanelEl.hidden = false;
      resultPanelEl.classList.add('quiz__step--active');
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

      if (printBtn) {
        printBtn.hidden = false;
      }

      actionsEl?.classList.add('quiz__actions--result-success');
      return;
    }

    actionsEl?.classList.remove('quiz__actions--result-success');

    if (printBtn) {
      printBtn.hidden = true;
    }

    nextBtn.hidden = false;
    againBtn.hidden = true;

    prevBtn.disabled = stepIndex === 0;

    if (stepIndex === 2) {
      nextBtn.textContent = 'Смотреть список →';
    } else {
      nextBtn.textContent = 'Далее →';
    }

    nextBtn.disabled = !isStepValid();
    nextBtn.classList.toggle('quiz__nav--accent', isStepValid());
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
    if (showingIntro || showingResult) {
      return;
    }

    if (!isStepValid()) {
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
    root.querySelectorAll('input[name="chimney-generator"]').forEach((input) => {
      input.checked = false;
    });

    root.querySelector('input[name="chimney-tank"][value="no"]').checked = true;
    root.querySelector('[name="chimney-height"]').value = '';
    root.querySelector('[name="chimney-floors"]').value = '';

    if (schemesContainer) {
      schemesContainer.innerHTML = '';
    }

    applyTankVisibility();
  };

  const restartFromScratch = () => {
    resetDefaults();
    showingResult = false;
    lastResult = null;
    showIntroView();
    renderActions();
    flowEl?.closest('.graph-modal__content')?.scrollTo(0, 0);
  };

  const printResult = () => {
    if (!lastResult) {
      return;
    }

    printChimneyResult({
      schemeTitle: lastResult.chips[0] ?? 'Список элементов',
      chips: lastResult.chips.slice(1),
      items: lastResult.items,
      schemeId: lastResult.answers.schemeId,
    });
  };

  startBtn?.addEventListener('click', () => {
    showingIntro = false;
    showingResult = false;
    stepIndex = 0;
    render();
    flowEl?.closest('.graph-modal__content')?.scrollTo(0, 0);
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

  generatorInputs.forEach((input) => {
    input.addEventListener('change', () => {
      applyTankVisibility();

      if (stepIndex === 1) {
        refreshSchemeCards(false);
      }

      if (!showingIntro && !showingResult) {
        renderActions();
      }
    });
  });

  tankInputs.forEach((input) => {
    input.addEventListener('change', () => {
      if (stepIndex === 1) {
        refreshSchemeCards(false);
      }

      updateSchemeDescription();

      if (!showingIntro && !showingResult) {
        renderActions();
      }
    });
  });

  root.addEventListener('change', (event) => {
    if (event.target.matches('input[name="chimney-scheme"]') && !showingIntro && !showingResult) {
      renderActions();
    }
  });

  paramInputs.forEach((input) => {
    input.addEventListener('input', () => {
      if (!showingIntro && !showingResult && stepIndex === 2) {
        renderActions();
      }
    });
  });

  applyTankVisibility();
  render();
};

initChimneyConfigurator();
