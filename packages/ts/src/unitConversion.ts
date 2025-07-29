// Conversion utilities for NutriQR units
// Supported conversions: ml <-> fl, g <-> oz

function mlToFl(ml: number): number {
  // 1 US fluid ounce = 29.5735 ml
  return ml / 29.5735;
}

function flToMl(fl: number): number {
  // 1 US fluid ounce = 29.5735 ml
  return fl * 29.5735;
}

function gToOz(g: number): number {
  // 1 US ounce = 28.3495 g
  return g / 28.3495;
}

function ozToG(oz: number): number {
  // 1 US ounce = 28.3495 g
  return oz * 28.3495;
}

// Generic conversion function
/**
 * Convert a value from its current unit to metric or imperial system.
 * If already in desired system, returns value unchanged.
 */
export function convertUnit(
  value: number,
  from: 'ml' | 'fl' | 'g' | 'oz',
  toSystem: 'metric' | 'imperial'
): { value: number; unit: 'ml' | 'fl' | 'g' | 'oz' } {
  // Metric: g, ml; Imperial: oz, fl
  const metricUnits = ['g', 'ml'];
  const imperialUnits = ['oz', 'fl'];
  if (toSystem === 'metric' && metricUnits.includes(from)) {
    return { value, unit: from };
  }
  if (toSystem === 'imperial' && imperialUnits.includes(from)) {
    return { value, unit: from };
  }
  if (from === 'ml' && toSystem === 'imperial') {
    return { value: mlToFl(value), unit: 'fl' };
  }
  if (from === 'fl' && toSystem === 'metric') {
    return { value: flToMl(value), unit: 'ml' };
  }
  if (from === 'g' && toSystem === 'imperial') {
    return { value: gToOz(value), unit: 'oz' };
  }
  if (from === 'oz' && toSystem === 'metric') {
    return { value: ozToG(value), unit: 'g' };
  }
  throw new Error(`Unsupported conversion: ${from} to ${toSystem}`);
}

// Convert a whole ExpandedData object to metric or imperial units
import type { ExpandedData, NutriQRUnit } from './types.js';

export function convertDecodedNutriQR(
  data: ExpandedData,
  toSystem: 'metric' | 'imperial'
): ExpandedData {
  // Convert unit, baseQuantity, portionQuantity, and nutrients proportionally
  const { value: newBase, unit: newUnit } = convertUnit(
    data.baseQuantity,
    data.unit,
    toSystem
  );
  const { value: newPortion } = convertUnit(
    data.portionQuantity,
    data.unit,
    toSystem
  );
  // Calculate conversion factor
  const factor = newBase / data.baseQuantity;
  const nutrients = {
    ...data.nutrients,
    fat: data.nutrients.fat * factor,
    saturatedFat: data.nutrients.saturatedFat * factor,
    carbs: data.nutrients.carbs * factor,
    sugar: data.nutrients.sugar * factor,
    salt: data.nutrients.salt * factor,
    protein: data.nutrients.protein * factor,
    ...(data.nutrients.fibre !== undefined
      ? { fibre: data.nutrients.fibre * factor }
      : {})
    // energyKcal and energyKj are not converted
  };
  return {
    ...data,
    unit: newUnit as NutriQRUnit,
    baseQuantity: newBase,
    portionQuantity: newPortion,
    nutrients
  };
}
