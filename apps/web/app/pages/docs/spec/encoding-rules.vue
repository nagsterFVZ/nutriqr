<template>
  <DocsShell>
    <h1 class="text-3xl font-bold text-neutral-950">Encoding rules</h1>

    <ul class="mt-6 space-y-4 text-neutral-700">
      <li>
        <strong class="text-neutral-950">Prefix.</strong> The payload must
        begin with <code>NQR&lt;version&gt;:</code> (e.g. <code>NQR1:</code>),
        with no whitespace before the array.
      </li>
      <li>
        <strong class="text-neutral-950">Character set.</strong> UTF-8 only.
      </li>
      <li>
        <strong class="text-neutral-950">JSON formatting.</strong> Minified —
        no whitespace anywhere in the array.
      </li>
      <li>
        <strong class="text-neutral-950">Decimal format.</strong> Dot
        (<code>.</code>) as the radix point, arbitrary precision.
      </li>
      <li>
        <strong class="text-neutral-950">Array lengths.</strong> Exactly 6
        top-level items; the nutrient sub-array is 7 or 8 items.
      </li>
      <li>
        <strong class="text-neutral-950">Units.</strong> Lowercase SI symbols
        only: <code>g</code>, <code>ml</code>, <code>oz</code>,
        <code>fl</code>.
      </li>
      <li>
        <strong class="text-neutral-950">Portion.</strong> Always supplied —
        use <code>1</code> if the base quantity equals the serving size.
      </li>
    </ul>

    <h2 class="mt-10 text-xl font-semibold text-neutral-950">
      GTIN-13 (index 0)
    </h2>
    <ul class="mt-3 list-disc space-y-2 pl-5 text-neutral-700">
      <li>Provided as a string of exactly 13 digits.</li>
      <li>Leading zeros must be preserved, e.g. <code>"0012345678905"</code>.</li>
      <li>No separators, spaces, or formatting characters.</li>
      <li>
        If no GTIN is available, the value must be an empty string
        (<code>""</code>) to preserve array layout.
      </li>
    </ul>

    <h2 class="mt-10 text-xl font-semibold text-neutral-950">
      The <code>|</code> delimiter (index 1)
    </h2>
    <p class="mt-3 text-neutral-700">
      A single unescaped <code>|</code> separates manufacturer and product
      name. If either name contains a literal <code>|</code>, escape it as
      <code>\|</code>:
    </p>
    <pre
      class="mt-3 overflow-x-auto rounded-xl bg-neutral-950 p-4 font-mono text-xs text-neutral-50"
    ><code>Acme\|Foods|Protein Bar</code></pre>
    <p class="mt-3 text-neutral-700">
      splits to manufacturer <code>Acme|Foods</code> and product
      <code>Protein Bar</code>.
    </p>

    <h2 class="mt-10 text-xl font-semibold text-neutral-950">
      Length limits (recommended)
    </h2>
    <div class="mt-4 overflow-x-auto rounded-xl border border-neutral-200">
      <table class="w-full text-left text-sm">
        <thead class="bg-neutral-50 text-xs text-neutral-400 uppercase">
          <tr>
            <th class="px-4 py-3">Field</th>
            <th class="px-4 py-3">Soft max</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200">
          <tr>
            <td class="px-4 py-3">Manufacturer</td>
            <td class="px-4 py-3 text-neutral-700">40 bytes</td>
          </tr>
          <tr>
            <td class="px-4 py-3">Product</td>
            <td class="px-4 py-3 text-neutral-700">60 bytes</td>
          </tr>
        </tbody>
      </table>
    </div>
  </DocsShell>
</template>
