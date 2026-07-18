<script setup lang="ts">
const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Demo', to: '/demo' },
  { label: 'Docs', to: '/docs' }
]
</script>

<template>
  <header
    class="sticky top-0 z-20 border-b border-neutral-200 bg-neutral-50/90 backdrop-blur"
  >
    <div
      class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
    >
      <NuxtLink to="/" class="flex items-center gap-2">
        <span class="text-lg font-semibold text-neutral-950">NutriQR</span>
      </NuxtLink>

      <nav class="flex items-center gap-6">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="text-sm font-medium text-neutral-700 transition-colors hover:text-primary"
          active-class="text-primary"
        >
          {{ link.label }}
        </NuxtLink>
        <a
          href="https://www.npmjs.com/package/nutriqr"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm font-medium text-neutral-700 transition-colors hover:text-primary"
        >
          npm
        </a>
        <a
          href="https://github.com/nagsterFVZ/nutriqr"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm font-medium text-neutral-700 transition-colors hover:text-primary"
        >
          GitHub
        </a>
      </nav>
    </div>
  </header>
</template>
