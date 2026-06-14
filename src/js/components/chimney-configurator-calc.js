import { CHIMNEY_SCHEMES, GENERATOR_TYPES } from '../data/chimney-schemes.js';

/**
 * Расчёт количества элементов конфигуратора дымохода.
 *
 * Переменные:
 *   H — высота дымохода (м), ввод пользователя
 *   P — количество перекрытий (шт.), ввод пользователя
 *   ceil(x) — округление вверх до целого
 *
 * Формулы (ТЗ §4):
 *   Труба сэндвич 1 м (без бака)     → ceil(H)
 *   Труба сэндвич 1 м (с баком)       → ceil(H − 1)
 *   ППУ                              → P
 *   Хомуты — схемы 1, 3, 5         → ceil(H) или ceil(H−1) + 2
 *   Хомуты — схемы 2, 4              → ceil(H) или ceil(H−1) + 5
 *   Хомуты — схема 6                 → ceil(H) + 6
 *   Хомуты — схема 7                 → ceil(H) + 9
 *   Кронштейны — через кровлю 2, 4, 5 → max(0, ceil(H / 1.5) − 1)
 *   Кронштейны — через стену 6, 7    → ceil(H / 1.5)
 */

const ceil = (value) => Math.ceil(value);

/** ceil(H) без бака | ceil(H − 1) с баком */
const getSandwichCount = (height, hasTank) => {
  return hasTank ? ceil(height - 1) : ceil(height);
};

const CALC_HANDLERS = {
  /** Труба сэндвич 1 м — вертикальный участок без бака */
  sandwich: (ctx) => getSandwichCount(ctx.height, false),

  /** Труба сэндвич 1 м — вертикальный участок с баком (бак занимает 1 м) */
  sandwich_tank: (ctx) => getSandwichCount(ctx.height, true),

  /** ППУ — один на каждое перекрытие */
  ppu: (ctx) => ctx.floors,

  /** Кронштейны — схемы 2, 4, 5 (через кровлю / подключение сзади) */
  brackets_roof: (ctx) => Math.max(0, ceil(ctx.height / 1.5) - 1),

  /** Кронштейны — схемы 6, 7 (через стену) */
  brackets_wall: (ctx) => ceil(ctx.height / 1.5),

  /** Хомуты — схемы 1, 3, 5: сэндвич-трубы + 2 (старт + финиш) */
  'clamps:1': (ctx) => getSandwichCount(ctx.height, false) + 2,
  'clamps:3': (ctx) => getSandwichCount(ctx.height, true) + 2,

  /** Хомуты — схемы 2, 4: сэндвич-трубы + 5 (старт + финиш + колена и доп. труба) */
  'clamps:2': (ctx) => getSandwichCount(ctx.height, false) + 5,
  'clamps:4': (ctx) => getSandwichCount(ctx.height, true) + 5,

  /** Хомуты — схема 6: ceil(H) + 6 */
  'clamps:6': (ctx) => ceil(ctx.height) + 6,

  /** Хомуты — схема 7: ceil(H) + 9 */
  'clamps:7': (ctx) => ceil(ctx.height) + 9,
};

const resolveQuantity = (calcKey, ctx) => {
  if (calcKey.startsWith('fixed:')) {
    return Number.parseInt(calcKey.split(':')[1], 10);
  }

  const handler = CALC_HANDLERS[calcKey];

  if (!handler) {
    return 0;
  }

  return handler(ctx);
};

export const getAvailableSchemes = (generatorId, hasTank) => {
  const generator = GENERATOR_TYPES.find((item) => item.id === generatorId);

  if (!generator) {
    return [];
  }

  if (generatorId === 'bath') {
    const schemeIds = hasTank ? generator.schemesWithTank : generator.schemesNoTank;

    return schemeIds.map((id) => CHIMNEY_SCHEMES[id]).filter(Boolean);
  }

  return generator.schemes.map((id) => CHIMNEY_SCHEMES[id]).filter(Boolean);
};

export const calculateBillOfMaterials = ({ schemeId, height, floors, hasTank }) => {
  const scheme = CHIMNEY_SCHEMES[schemeId];

  if (!scheme) {
    return [];
  }

  const ctx = {
    height,
    floors,
    hasTank,
  };

  return scheme.elements.map((element) => ({
    name: element.name,
    quantity: resolveQuantity(element.calc, ctx),
  }));
};

export const getGeneratorLabel = (generatorId, hasTank) => {
  const generator = GENERATOR_TYPES.find((item) => item.id === generatorId);

  if (!generator) {
    return '—';
  }

  if (generatorId === 'bath') {
    return hasTank ? 'Печь для бани — с баком' : 'Печь для бани — без бака';
  }

  return generator.title;
};
