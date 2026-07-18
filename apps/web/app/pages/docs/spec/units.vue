<template>
  <DocsShell>
    <h1 class="text-3xl font-bold text-neutral-950">Units</h1>
    <p class="mt-4 text-neutral-700">
      The unit field (index 2) specifies the measurement unit for both the
      base quantity and every nutrient value in the array. It must be one of
      four lowercase strings:
    </p>

    <div class="mt-6 overflow-x-auto rounded-xl border border-neutral-200">
      <table class="w-full text-left text-sm">
        <thead class="bg-neutral-50 text-xs text-neutral-400 uppercase">
          <tr>
            <th class="px-4 py-3">Code</th>
            <th class="px-4 py-3">Description</th>
            <th class="px-4 py-3">Typical use</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200">
          <tr>
            <td class="px-4 py-3 font-mono">g</td>
            <td class="px-4 py-3">Grams</td>
            <td class="px-4 py-3 text-neutral-700">Most solid foods (EU/US)</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono">ml</td>
            <td class="px-4 py-3">Millilitres</td>
            <td class="px-4 py-3 text-neutral-700">Most liquids (EU/US)</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono">oz</td>
            <td class="px-4 py-3">Ounces</td>
            <td class="px-4 py-3 text-neutral-700">US/UK snack portions, cereal</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono">fl</td>
            <td class="px-4 py-3">Fluid ounces</td>
            <td class="px-4 py-3 text-neutral-700">US/UK drinks, sauces</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="mt-6 text-neutral-700">
      All nutrient values in the array are per <em>base quantity</em>, in
      whichever unit is declared — e.g. if <code>unit = "oz"</code> and
      <code>baseQuantity = 1</code>, nutrients are given per 1 ounce.
    </p>

    <h2 class="mt-10 text-xl font-semibold text-neutral-950">
      Conversion precision
    </h2>
    <p class="mt-3 text-neutral-700">
      Rounded figures (28.35g / 29.57ml) are commonly quoted for readability,
      but implementations — including the
      <NuxtLink to="/docs/packages/ts" class="font-semibold text-primary"
        >TypeScript package</NuxtLink
      >
      — must convert using full precision to avoid rounding drift:
    </p>
    <ul class="mt-3 list-disc space-y-2 pl-5 text-neutral-700">
      <li>1 oz = 28.3495 g</li>
      <li>1 fl oz = 29.5735 ml</li>
    </ul>
  </DocsShell>
</template>
