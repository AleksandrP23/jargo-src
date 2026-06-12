import { CHIMNEY_SCHEMES, GENERATOR_TYPES } from '../data/chimney-schemes.js';

const ceil = (value) => Math.ceil(value);

const getSandwichCount = (height, hasTank) => {
  return hasTank ? ceil(height - 1) : ceil(height);
};

const CALC_HANDLERS = {
  sandwich: (ctx) => getSandwichCount(ctx.height, false),
  sandwich_tank: (ctx) => getSandwichCount(ctx.height, true),
  ppu: (ctx) => ctx.floors,
  brackets_roof: (ctx) => Math.max(0, ceil(ctx.height / 1.5) - 1),
  brackets_wall: (ctx) => ceil(ctx.height / 1.5),
  'clamps:1': (ctx) => getSandwichCount(ctx.height, false) + 2,
  'clamps:2': (ctx) => getSandwichCount(ctx.height, false) + 5,
  'clamps:3': (ctx) => getSandwichCount(ctx.height, true) + 2,
  'clamps:4': (ctx) => getSandwichCount(ctx.height, true) + 5,
  'clamps:5': (ctx) => ceil(ctx.height) + 2,
  'clamps:6': (ctx) => ceil(ctx.height) + 6,
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
