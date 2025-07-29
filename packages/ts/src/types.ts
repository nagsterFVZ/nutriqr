/**
 * Type definitions for NutriQR
 */

export type NutriQRUnit = 'g' | 'ml' | 'oz' | 'fl';

export type NutriQR = [
  string,
  string,
  NutriQRUnit,
  number,
  number,
  [number, number, number, number, number, number, number, number?]
];

export interface ExpandedData {
  gtin13: string;
  manufacturer: string;
  productName: string;
  unit: NutriQRUnit;
  baseQuantity: number;
  portionQuantity: number;
  nutrients: {
    energyKcal: number;
    energyKj: number;
    fat: number;
    saturatedFat: number;
    carbs: number;
    sugar: number;
    salt: number;
    protein: number;
    fibre?: number;
  };
}

export interface NutrientInput {
  energyKcal: number;
  fat: number;
  saturatedFat: number;
  carbs: number;
  sugar: number;
  salt: number;
  protein: number;
  fibre?: number;
}
