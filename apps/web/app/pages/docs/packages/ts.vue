<template>
  <DocsShell>
    <h1 class="text-3xl font-bold text-neutral-950">TypeScript package</h1>
    <p class="mt-4 text-neutral-700">
      <code>nutriqr</code> is the zero-runtime-dependency reference
      implementation of the NutriQR spec, written in TypeScript and built as
      dual ESM/CJS.
    </p>

    <h2 class="mt-8 text-xl font-semibold text-neutral-950">Installation</h2>
    <pre
      class="mt-3 overflow-x-auto rounded-xl bg-neutral-950 p-4 font-mono text-xs text-neutral-50"
    ><code>npm install nutriqr</code></pre>
    <p class="mt-3 text-sm text-neutral-400">
      The package isn't published to npm yet — until it is, install it
      directly from the
      <a
        href="https://github.com/nagsterFVZ/nutriqr/tree/main/packages/ts"
        target="_blank"
        rel="noopener noreferrer"
        class="font-semibold text-primary"
        >repository</a
      >.
    </p>

    <h2 class="mt-10 text-xl font-semibold text-neutral-950">API reference</h2>

    <h3 class="mt-6 font-mono text-base font-semibold text-neutral-950">
      createNutriQRString(gtin13, manufacturer, productName, unit,
      baseQuantity, portionFactor, nutrients)
    </h3>
    <p class="mt-2 text-neutral-700">
      Encodes the given fields into an <code>NQR1:...</code> string. Throws a
      <code>NutriQRError</code> if any field fails validation.
    </p>

    <h3 class="mt-6 font-mono text-base font-semibold text-neutral-950">
      decodeNutriQRString(str)
    </h3>
    <p class="mt-2 text-neutral-700">
      Parses an <code>NQR1:...</code> string into an
      <code>ExpandedData</code> object:
      <code
        >{ gtin13, manufacturer, productName, unit, baseQuantity,
        portionQuantity, nutrients, version }</code
      >, where <code>nutrients</code> is
      <code
        >{ energyKcal, energyKj, fat, saturatedFat, carbs, sugar, salt,
        protein, fibre? }</code
      >. Throws a <code>NutriQRError</code> if the string is malformed or
      invalid.
    </p>

    <h3 class="mt-6 font-mono text-base font-semibold text-neutral-950">
      isNutriQRString(str)
    </h3>
    <p class="mt-2 text-neutral-700">
      Non-throwing validity check — returns <code>true</code> /
      <code>false</code>.
    </p>

    <h3 class="mt-6 font-mono text-base font-semibold text-neutral-950">
      convertUnit / convertDecodedNutriQR
    </h3>
    <p class="mt-2 text-neutral-700">
      Convert a single value, or an entire decoded <code>ExpandedData</code>
      object, between metric (g/ml) and imperial (oz/fl) units.
    </p>

    <h2 class="mt-10 text-xl font-semibold text-neutral-950">Types</h2>
    <ul class="mt-3 list-disc space-y-2 pl-5 text-neutral-700">
      <li>
        <code>NutriQRUnit</code> —
        <code>'g' | 'ml' | 'oz' | 'fl'</code>
      </li>
      <li>
        <code>NutrientInput</code> —
        <code
          >{ energyKcal, fat, saturatedFat, carbs, sugar, salt, protein,
          fibre? }</code
        >
        (note the field is <code>fibre</code>, not <code>fiber</code>)
      </li>
    </ul>

    <h2 class="mt-10 text-xl font-semibold text-neutral-950">Error handling</h2>
    <p class="mt-3 text-neutral-700">
      Both <code>createNutriQRString</code> and
      <code>decodeNutriQRString</code> throw a typed
      <code>NutriQRError</code> with an <code>errorType</code> from the
      <code>NutriQRErrorType</code> enum:
    </p>

    <div class="mt-4 overflow-x-auto rounded-xl border border-neutral-200">
      <table class="w-full text-left text-sm">
        <thead class="bg-neutral-50 text-xs text-neutral-400 uppercase">
          <tr>
            <th class="px-4 py-3">Error type</th>
            <th class="px-4 py-3">Meaning</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200 font-mono text-xs">
          <tr><td class="px-4 py-3">INVALID_PREFIX</td><td class="px-4 py-3 font-sans text-neutral-700">Missing/malformed <code>NQR&lt;version&gt;:</code> prefix</td></tr>
          <tr><td class="px-4 py-3">UNSUPPORTED_VERSION</td><td class="px-4 py-3 font-sans text-neutral-700">Prefix version isn't recognized by this library</td></tr>
          <tr><td class="px-4 py-3">INVALID_JSON</td><td class="px-4 py-3 font-sans text-neutral-700">Content after the prefix isn't valid JSON</td></tr>
          <tr><td class="px-4 py-3">NON_STRING_INPUT</td><td class="px-4 py-3 font-sans text-neutral-700">Input to decode wasn't a string</td></tr>
          <tr><td class="px-4 py-3">INVALID_ARRAY_LENGTH</td><td class="px-4 py-3 font-sans text-neutral-700">Top-level array isn't exactly 6 items</td></tr>
          <tr><td class="px-4 py-3">INVALID_GTIN13</td><td class="px-4 py-3 font-sans text-neutral-700">GTIN isn't <code>""</code> or 13 digits</td></tr>
          <tr><td class="px-4 py-3">EMPTY_BRAND_PRODUCT</td><td class="px-4 py-3 font-sans text-neutral-700">Brand|Product field is empty</td></tr>
          <tr><td class="px-4 py-3">MISSING_DELIMITER</td><td class="px-4 py-3 font-sans text-neutral-700">No unescaped <code>|</code> between manufacturer and product</td></tr>
          <tr><td class="px-4 py-3">EMPTY_MANUFACTURER_OR_PRODUCT</td><td class="px-4 py-3 font-sans text-neutral-700">Manufacturer or product name is empty after splitting</td></tr>
          <tr><td class="px-4 py-3">INVALID_UNIT</td><td class="px-4 py-3 font-sans text-neutral-700">Unit isn't g/ml/oz/fl</td></tr>
          <tr><td class="px-4 py-3">INVALID_BASE_QUANTITY</td><td class="px-4 py-3 font-sans text-neutral-700">Base quantity isn't a positive finite number</td></tr>
          <tr><td class="px-4 py-3">INVALID_PORTION_FACTOR</td><td class="px-4 py-3 font-sans text-neutral-700">Portion factor isn't a positive finite number</td></tr>
          <tr><td class="px-4 py-3">INVALID_NUTRIENTS_ARRAY</td><td class="px-4 py-3 font-sans text-neutral-700">Nutrients array isn't length 7 or 8</td></tr>
          <tr><td class="px-4 py-3">INVALID_NUTRIENT_VALUE</td><td class="px-4 py-3 font-sans text-neutral-700">A nutrient value isn't a non-negative finite number</td></tr>
          <tr><td class="px-4 py-3">SUGAR_EXCEEDS_CARBS</td><td class="px-4 py-3 font-sans text-neutral-700">Sugars greater than carbohydrates</td></tr>
          <tr><td class="px-4 py-3">SATURATED_FAT_EXCEEDS_TOTAL_FAT</td><td class="px-4 py-3 font-sans text-neutral-700">Saturated fat greater than total fat</td></tr>
          <tr><td class="px-4 py-3">NUTRIENTS_EXCEED_BASE_QUANTITY</td><td class="px-4 py-3 font-sans text-neutral-700">Fat + carbs + salt + protein exceed the base quantity</td></tr>
        </tbody>
      </table>
    </div>

    <pre
      class="mt-6 overflow-x-auto rounded-xl bg-neutral-950 p-4 font-mono text-xs text-neutral-50"
    ><code>try {
  decodeNutriQRString(someString)
} catch (e) {
  if (e instanceof NutriQRError) {
    console.error(e.errorType, e.message)
  }
}</code></pre>

    <h2 class="mt-10 text-xl font-semibold text-neutral-950">Worked example</h2>
    <pre
      class="mt-3 overflow-x-auto rounded-xl bg-neutral-950 p-4 font-mono text-xs text-neutral-50"
    ><code>import { createNutriQRString, decodeNutriQRString } from 'nutriqr'

const nutriqr = createNutriQRString(
  '1234567890128',
  'GrainWorks',
  'Protein Oats',
  'g',
  100,
  0.4,
  {
    energyKcal: 415,
    fat: 13,
    saturatedFat: 5.6,
    carbs: 43,
    sugar: 9.7,
    salt: 0.47,
    protein: 25,
    fibre: 8.5
  }
)
console.log(nutriqr) // "NQR1:[&quot;1234567890128&quot;,...]"

const decoded = decodeNutriQRString(nutriqr)
console.log(decoded.productName)        // "Protein Oats"
console.log(decoded.nutrients.protein)  // 25 (per 100g base quantity)
console.log(decoded.portionQuantity)    // 40 (actual serving size in grams)</code></pre>
  </DocsShell>
</template>
