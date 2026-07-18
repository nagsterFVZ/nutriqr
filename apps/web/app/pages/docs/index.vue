<template>
  <div class="mx-auto max-w-4xl px-6 py-16 text-center">
    <h1 class="text-3xl font-bold text-neutral-950">Documentation</h1>
    <p class="mx-auto mt-3 max-w-xl text-neutral-700">
      Everything you need to read or write NutriQR codes — the format
      specification, and the reference TypeScript package.
    </p>

    <div class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <NuxtLink
        to="/docs/spec"
        class="rounded-2xl border border-neutral-200 bg-white p-8 text-left shadow-sm transition-colors hover:border-primary"
      >
        <h2 class="text-lg font-semibold text-neutral-950">Specification</h2>
        <p class="mt-2 text-sm text-neutral-700">
          The normative data model, encoding rules, unit handling, and
          versioning scheme behind every NutriQR payload.
        </p>
        <span class="mt-4 inline-block text-sm font-semibold text-primary"
          >Read the spec &rarr;</span
        >
      </NuxtLink>

      <NuxtLink
        to="/docs/packages/ts"
        class="rounded-2xl border border-neutral-200 bg-white p-8 text-left shadow-sm transition-colors hover:border-primary"
      >
        <h2 class="text-lg font-semibold text-neutral-950">
          TypeScript package
        </h2>
        <p class="mt-2 text-sm text-neutral-700">
          Installation and API reference for <code>nutriqr</code>, the
          zero-dependency reference encoder/decoder.
        </p>
        <span class="mt-4 inline-block text-sm font-semibold text-primary"
          >View package docs &rarr;</span
        >
      </NuxtLink>
    </div>
  </div>
</template>
