<template>
  <DocsShell>
    <h1 class="text-3xl font-bold text-neutral-950">Data model</h1>
    <p class="mt-4 text-neutral-700">
      After the <code>NQR1:</code> envelope, the array itself has six fixed
      top-level positions:
    </p>

    <div class="mt-6 overflow-x-auto rounded-xl border border-neutral-200">
      <table class="w-full text-left text-sm">
        <thead class="bg-neutral-50 text-xs text-neutral-400 uppercase">
          <tr>
            <th class="px-4 py-3">Idx</th>
            <th class="px-4 py-3">Type</th>
            <th class="px-4 py-3">Field</th>
            <th class="px-4 py-3">Notes</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200">
          <tr>
            <td class="px-4 py-3 font-mono">0</td>
            <td class="px-4 py-3 font-mono">string</td>
            <td class="px-4 py-3">GTIN-13</td>
            <td class="px-4 py-3 text-neutral-700">
              13-digit string, or <code>""</code> if none. Leading zeros
              preserved.
            </td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono">1</td>
            <td class="px-4 py-3 font-mono">string</td>
            <td class="px-4 py-3">Manufacturer|Product</td>
            <td class="px-4 py-3 text-neutral-700">
              <code>|</code>-delimited; escape a literal pipe as
              <code>\|</code>.
            </td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono">2</td>
            <td class="px-4 py-3 font-mono">string</td>
            <td class="px-4 py-3">Base unit</td>
            <td class="px-4 py-3 text-neutral-700">
              One of <code>g</code>, <code>ml</code>, <code>oz</code>,
              <code>fl</code> (lowercase only).
            </td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono">3</td>
            <td class="px-4 py-3 font-mono">number</td>
            <td class="px-4 py-3">Base quantity</td>
            <td class="px-4 py-3 text-neutral-700">Usually 100.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono">4</td>
            <td class="px-4 py-3 font-mono">number</td>
            <td class="px-4 py-3">Portion multiplier</td>
            <td class="px-4 py-3 text-neutral-700">
              Fraction of the base quantity, e.g. 0.4.
            </td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono">5</td>
            <td class="px-4 py-3 font-mono">array</td>
            <td class="px-4 py-3">Nutrients</td>
            <td class="px-4 py-3 text-neutral-700">
              Fixed order, length 7 or 8 (with optional fibre).
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 class="mt-10 text-xl font-semibold text-neutral-950">
      Fixed nutrient order
    </h2>
    <p class="mt-3 text-neutral-700">
      Positioning within the nutrients array is strict. Values are expressed
      per base quantity (index 2), not per portion.
    </p>

    <div class="mt-6 overflow-x-auto rounded-xl border border-neutral-200">
      <table class="w-full text-left text-sm">
        <thead class="bg-neutral-50 text-xs text-neutral-400 uppercase">
          <tr>
            <th class="px-4 py-3">Pos</th>
            <th class="px-4 py-3">Nutrient</th>
            <th class="px-4 py-3">Required</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200">
          <tr>
            <td class="px-4 py-3 font-mono">0</td>
            <td class="px-4 py-3">Energy (kcal)</td>
            <td class="px-4 py-3 text-neutral-700">Yes</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono">1</td>
            <td class="px-4 py-3">Fat</td>
            <td class="px-4 py-3 text-neutral-700">Yes</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono">2</td>
            <td class="px-4 py-3">Saturated fat</td>
            <td class="px-4 py-3 text-neutral-700">Yes</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono">3</td>
            <td class="px-4 py-3">Carbohydrates</td>
            <td class="px-4 py-3 text-neutral-700">Yes</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono">4</td>
            <td class="px-4 py-3">Sugars</td>
            <td class="px-4 py-3 text-neutral-700">Yes</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono">5</td>
            <td class="px-4 py-3">Salt</td>
            <td class="px-4 py-3 text-neutral-700">Yes</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono">6</td>
            <td class="px-4 py-3">Protein</td>
            <td class="px-4 py-3 text-neutral-700">Yes</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono">7</td>
            <td class="px-4 py-3">Fibre</td>
            <td class="px-4 py-3 text-neutral-700">Optional</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="mt-3 text-sm text-neutral-400">
      If fibre is absent, the array terminates at position 6 (length 7).
    </p>
  </DocsShell>
</template>
