<script setup lang="ts">
const specLinks = [
  { to: '/docs/spec', label: 'Overview' },
  { to: '/docs/spec/data-model', label: 'Data model' },
  { to: '/docs/spec/encoding-rules', label: 'Encoding rules' },
  { to: '/docs/spec/units', label: 'Units' },
  { to: '/docs/spec/versioning', label: 'Versioning' }
]
const packageLinks = [{ to: '/docs/packages/ts', label: 'TypeScript (nutriqr)' }]
</script>

<template>
  <div class="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-[220px_1fr]">
    <aside class="lg:sticky lg:top-24 lg:h-fit">
      <p class="mb-2 text-xs font-semibold tracking-wide text-neutral-400 uppercase">
        Specification
      </p>
      <nav class="flex flex-col gap-1">
        <NuxtLink
          v-for="link in specLinks"
          :key="link.to"
          :to="link.to"
          class="rounded-lg px-3 py-1.5 text-sm text-neutral-700 transition-colors hover:bg-primary-light hover:text-primary-dark"
          active-class="bg-primary-light text-primary-dark font-medium"
          exact-active-class="bg-primary-light text-primary-dark font-medium"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <p class="mt-6 mb-2 text-xs font-semibold tracking-wide text-neutral-400 uppercase">
        Packages
      </p>
      <nav class="flex flex-col gap-1">
        <NuxtLink
          v-for="link in packageLinks"
          :key="link.to"
          :to="link.to"
          class="rounded-lg px-3 py-1.5 text-sm text-neutral-700 transition-colors hover:bg-primary-light hover:text-primary-dark"
          active-class="bg-primary-light text-primary-dark font-medium"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </aside>

    <article class="min-w-0 max-w-3xl">
      <slot />
    </article>
  </div>
</template>
