<template>
  <DocsShell>
    <h1 class="text-3xl font-bold text-neutral-950">Specification overview</h1>
    <p class="mt-4 text-neutral-700">
      NutriQR encodes complete EU-mandatory nutrition label data into a
      single, ultra-compact string suitable for a QR code. The format trades
      human readability for byte-level compactness — reference libraries are
      responsible for expanding the payload into a developer-friendly object.
    </p>

    <h2 class="mt-8 text-xl font-semibold text-neutral-950">The envelope</h2>
    <p class="mt-3 text-neutral-700">
      Every payload consists of a short magic prefix and version identifier,
      followed immediately by a minified JSON array:
    </p>
    <pre
      class="mt-3 overflow-x-auto rounded-xl bg-neutral-950 p-4 font-mono text-xs text-neutral-50"
    ><code>NQR&lt;version&gt;:&lt;json-array&gt;</code></pre>
    <p class="mt-3 text-neutral-700">
      <code class="rounded bg-primary-light px-1.5 py-0.5 text-primary-dark"
        >NQR</code
      >
      identifies a NutriQR payload,
      <code class="rounded bg-primary-light px-1.5 py-0.5 text-primary-dark"
        >&lt;version&gt;</code
      >
      is the array-layout version, and a colon separates the prefix from the
      array with no surrounding whitespace. This document describes
      <strong>version 1</strong> — the full prefix is
      <code class="rounded bg-primary-light px-1.5 py-0.5 text-primary-dark"
        >NQR1:</code
      >.
    </p>

    <h2 class="mt-8 text-xl font-semibold text-neutral-950">
      Reference example
    </h2>
    <p class="mt-3 text-neutral-700">
      100g of oats, encoded in 92 bytes including the envelope prefix:
    </p>
    <pre
      class="mt-3 overflow-x-auto rounded-xl bg-neutral-950 p-4 font-mono text-xs break-all whitespace-pre-wrap text-neutral-50"
    ><code>NQR1:["1234567890128","GrainWorks|Protein Oats","g",100,0.4,[415,13,5.6,43,9.7,0.47,25,8.5]]</code></pre>

    <p class="mt-8 text-neutral-700">
      Continue to the
      <NuxtLink to="/docs/spec/data-model" class="font-semibold text-primary"
        >data model</NuxtLink
      >
      for a full breakdown of the array's fields.
    </p>
  </DocsShell>
</template>
