<script setup lang="ts">
const { form, formError } = useNutriQRDemo()

const units = [
  { value: 'g', label: 'Grams (g)' },
  { value: 'ml', label: 'Millilitres (ml)' },
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'fl', label: 'Fluid ounces (fl)' }
] as const
</script>

<template>
  <div class="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
    <h2 class="text-lg font-semibold text-neutral-950">Nutrition data</h2>
    <p class="mt-1 text-sm text-neutral-400">
      Edit any field — the encoded string and QR code update live.
    </p>

    <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <label class="flex flex-col gap-1 sm:col-span-2">
        <span class="text-xs font-medium text-neutral-700">GTIN-13 (optional)</span>
        <input
          v-model="form.gtin13"
          type="text"
          maxlength="13"
          placeholder="1234567890128"
          class="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
      </label>

      <label class="flex flex-col gap-1">
        <span class="text-xs font-medium text-neutral-700">Manufacturer</span>
        <input
          v-model="form.manufacturer"
          type="text"
          class="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
      </label>

      <label class="flex flex-col gap-1">
        <span class="text-xs font-medium text-neutral-700">Product name</span>
        <input
          v-model="form.productName"
          type="text"
          class="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
      </label>

      <label class="flex flex-col gap-1">
        <span class="text-xs font-medium text-neutral-700">Base unit</span>
        <select
          v-model="form.unit"
          class="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        >
          <option v-for="u in units" :key="u.value" :value="u.value">
            {{ u.label }}
          </option>
        </select>
      </label>

      <label class="flex flex-col gap-1">
        <span class="text-xs font-medium text-neutral-700">Base quantity</span>
        <input
          v-model.number="form.baseQuantity"
          type="number"
          min="0"
          step="any"
          class="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
      </label>

      <label class="flex flex-col gap-1 sm:col-span-2">
        <span class="text-xs font-medium text-neutral-700">
          Portion multiplier (fraction of base quantity, e.g. 0.4 = 40{{ form.unit }})
        </span>
        <input
          v-model.number="form.portionFactor"
          type="number"
          min="0"
          step="any"
          class="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
      </label>
    </div>

    <h3 class="mt-6 text-sm font-semibold text-neutral-950">
      Nutrients (per base quantity)
    </h3>
    <div class="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
      <label class="flex flex-col gap-1">
        <span class="text-xs font-medium text-neutral-700">Energy (kcal)</span>
        <input
          v-model.number="form.nutrients.energyKcal"
          type="number"
          min="0"
          step="any"
          class="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
      </label>
      <label class="flex flex-col gap-1">
        <span class="text-xs font-medium text-neutral-700">Fat</span>
        <input
          v-model.number="form.nutrients.fat"
          type="number"
          min="0"
          step="any"
          class="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
      </label>
      <label class="flex flex-col gap-1">
        <span class="text-xs font-medium text-neutral-700">Saturated fat</span>
        <input
          v-model.number="form.nutrients.saturatedFat"
          type="number"
          min="0"
          step="any"
          class="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
      </label>
      <label class="flex flex-col gap-1">
        <span class="text-xs font-medium text-neutral-700">Carbohydrates</span>
        <input
          v-model.number="form.nutrients.carbs"
          type="number"
          min="0"
          step="any"
          class="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
      </label>
      <label class="flex flex-col gap-1">
        <span class="text-xs font-medium text-neutral-700">Sugars</span>
        <input
          v-model.number="form.nutrients.sugar"
          type="number"
          min="0"
          step="any"
          class="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
      </label>
      <label class="flex flex-col gap-1">
        <span class="text-xs font-medium text-neutral-700">Salt</span>
        <input
          v-model.number="form.nutrients.salt"
          type="number"
          min="0"
          step="any"
          class="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
      </label>
      <label class="flex flex-col gap-1">
        <span class="text-xs font-medium text-neutral-700">Protein</span>
        <input
          v-model.number="form.nutrients.protein"
          type="number"
          min="0"
          step="any"
          class="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
      </label>
      <label class="flex flex-col gap-1">
        <span class="flex items-center gap-2 text-xs font-medium text-neutral-700">
          <input v-model="form.includeFibre" type="checkbox" class="accent-primary" />
          Fibre (optional)
        </span>
        <input
          v-model.number="form.nutrients.fibre"
          type="number"
          min="0"
          step="any"
          :disabled="!form.includeFibre"
          class="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light disabled:bg-neutral-50 disabled:text-neutral-400"
        />
      </label>
    </div>

    <p
      v-if="formError"
      class="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-danger"
    >
      {{ formError }}
    </p>
  </div>
</template>
