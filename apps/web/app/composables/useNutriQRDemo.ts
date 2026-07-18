import { reactive, ref, watch, effectScope } from 'vue'
import {
  createNutriQRString,
  decodeNutriQRString,
  NutriQRError
} from 'nutriqr'
import type { NutriQRUnit } from 'nutriqr'

export interface DemoNutrients {
  energyKcal: number
  fat: number
  saturatedFat: number
  carbs: number
  sugar: number
  salt: number
  protein: number
  fibre: number
}

export interface DemoForm {
  gtin13: string
  manufacturer: string
  productName: string
  unit: NutriQRUnit
  baseQuantity: number
  portionFactor: number
  includeFibre: boolean
  nutrients: DemoNutrients
}

const DEFAULT_FORM: DemoForm = {
  gtin13: '1234567890128',
  manufacturer: 'GrainWorks',
  productName: 'Protein Oats',
  unit: 'g',
  baseQuantity: 100,
  portionFactor: 0.4,
  includeFibre: true,
  nutrients: {
    energyKcal: 415,
    fat: 13,
    saturatedFat: 5.6,
    carbs: 43,
    sugar: 9.7,
    salt: 0.47,
    protein: 25,
    fibre: 8.5
  }
}

const form = reactive<DemoForm>(structuredClone(DEFAULT_FORM))
const rawString = ref('')
const lastValidString = ref('')
const formError = ref<string | null>(null)
const stringError = ref<string | null>(null)
const isInternalUpdate = ref(false)
let stringDebounce: ReturnType<typeof setTimeout> | undefined
let initialized = false
// Detached scope so the watchers below survive regardless of which component
// instance happens to trigger initialization first - a plain watch() call
// made during a component's setup() gets bound to that component's effect
// scope and is torn down (silently, permanently) when it unmounts, e.g. on
// an HMR reload. This scope is never attached to any component, so it lives
// for the lifetime of the module.
const scope = effectScope(true)

function encodeFromForm() {
  try {
    const encoded = createNutriQRString(
      form.gtin13,
      form.manufacturer,
      form.productName,
      form.unit,
      form.baseQuantity,
      form.portionFactor,
      {
        energyKcal: form.nutrients.energyKcal,
        fat: form.nutrients.fat,
        saturatedFat: form.nutrients.saturatedFat,
        carbs: form.nutrients.carbs,
        sugar: form.nutrients.sugar,
        salt: form.nutrients.salt,
        protein: form.nutrients.protein,
        ...(form.includeFibre ? { fibre: form.nutrients.fibre } : {})
      }
    )
    formError.value = null
    lastValidString.value = encoded
    isInternalUpdate.value = true
    rawString.value = encoded
  } catch (e) {
    formError.value = e instanceof NutriQRError ? e.message : 'Invalid input.'
    // Leave rawString/lastValidString untouched: last-good QR/string stays visible.
  } finally {
    isInternalUpdate.value = false
  }
}

function decodeIntoForm(str: string) {
  if (str === '') {
    stringError.value = null
    return
  }
  try {
    const decoded = decodeNutriQRString(str)
    stringError.value = null
    lastValidString.value = str
    isInternalUpdate.value = true
    form.gtin13 = decoded.gtin13
    form.manufacturer = decoded.manufacturer
    form.productName = decoded.productName
    form.unit = decoded.unit
    form.baseQuantity = decoded.baseQuantity
    form.portionFactor =
      decoded.baseQuantity !== 0
        ? decoded.portionQuantity / decoded.baseQuantity
        : 0
    form.nutrients.energyKcal = decoded.nutrients.energyKcal
    form.nutrients.fat = decoded.nutrients.fat
    form.nutrients.saturatedFat = decoded.nutrients.saturatedFat
    form.nutrients.carbs = decoded.nutrients.carbs
    form.nutrients.sugar = decoded.nutrients.sugar
    form.nutrients.salt = decoded.nutrients.salt
    form.nutrients.protein = decoded.nutrients.protein
    if (decoded.nutrients.fibre !== undefined) {
      form.includeFibre = true
      form.nutrients.fibre = decoded.nutrients.fibre
    } else {
      form.includeFibre = false
    }
  } catch (e) {
    stringError.value =
      e instanceof NutriQRError ? e.message : 'Invalid NutriQR string.'
    // Leave form untouched: don't clobber in-progress edits on a bad paste.
  } finally {
    isInternalUpdate.value = false
  }
}

function ensureInitialized() {
  if (initialized) return
  initialized = true

  scope.run(() => {
    watch(
      form,
      () => {
        if (!isInternalUpdate.value) encodeFromForm()
      },
      { deep: true }
    )

    watch(rawString, (val) => {
      if (isInternalUpdate.value) return
      clearTimeout(stringDebounce)
      stringDebounce = setTimeout(() => decodeIntoForm(val), 400)
    })
  })

  encodeFromForm() // Seed rawString/lastValidString from DEFAULT_FORM.
}

export function useNutriQRDemo() {
  ensureInitialized()
  return { form, rawString, lastValidString, formError, stringError }
}
