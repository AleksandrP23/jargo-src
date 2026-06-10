const WALL_COEFFICIENT = {
  vagon: 1.0,
  breven: 1.2,
};

const matchesParam = (modelValue, selectedValue) => {
  return modelValue === 'both' || modelValue === selectedValue;
};

/**
 * Расчётный объём парной, м³.
 * V = (Длина × Ширина × Высота + 1.2 × S) × К_стен
 */
export const calculateVolume = ({ length, width, height, uninsulatedArea, wallMaterial }) => {
  const S = Number.isFinite(uninsulatedArea) ? uninsulatedArea : 0;
  const K = WALL_COEFFICIENT[wallMaterial] ?? 1.0;
  const raw = (length * width * height + 1.2 * S) * K;

  return Math.round(raw * 10) / 10;
};

const deduplicateBySeries = (models) => {
  const bySeries = new Map();

  models.forEach((model) => {
    const existing = bySeries.get(model.series);

    if (!existing || model.maxVolume < existing.maxVolume) {
      bySeries.set(model.series, model);
    }
  });

  return Array.from(bySeries.values());
};

const sortModels = (models, volume) => {
  return [...models].sort((a, b) => {
    const aTaganay = a.series === 'taganay' ? 0 : 1;
    const bTaganay = b.series === 'taganay' ? 0 : 1;

    if (aTaganay !== bTaganay) {
      return aTaganay - bTaganay;
    }

    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }

    const aDiff = Math.abs(a.maxVolume - volume);
    const bDiff = Math.abs(b.maxVolume - volume);

    return aDiff - bDiff;
  });
};

/**
 * Подбор до 3 моделей по параметрам парной и расчётному объёму.
 */
export const matchStoves = (volume, filters, stoves) => {
  const matched = stoves.filter((model) => {
    return (
      model.maxVolume >= volume
      && matchesParam(model.saunaMode, filters.saunaType)
      && matchesParam(model.firebox, filters.firebox)
      && matchesParam(model.door, filters.door)
      && model.material === filters.material
    );
  });

  const deduped = deduplicateBySeries(matched);
  const sorted = sortModels(deduped, volume);

  return sorted.slice(0, 3);
};
