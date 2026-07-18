<template>
  <footer class="border-t border-neutral-200 bg-white">
    <div
      class="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-10 text-sm text-neutral-400 sm:flex-row sm:justify-between"
    >
      <p>&copy; {{ new Date().getFullYear() }} NutriQR. Released under the MIT License.</p>
      <div class="flex items-center gap-5">
        <a
          href="https://github.com/nagsterFVZ/nutriqr/blob/main/spec.md"
          target="_blank"
          rel="noopener noreferrer"
          class="transition-colors hover:text-primary"
        >
          Specification
        </a>
        <a
          href="https://github.com/nagsterFVZ/nutriqr/tree/main/packages/ts"
          target="_blank"
          rel="noopener noreferrer"
          class="transition-colors hover:text-primary"
        >
          TypeScript package
        </a>
        <a
          href="https://www.npmjs.com/package/nutriqr"
          target="_blank"
          rel="noopener noreferrer"
          class="transition-colors hover:text-primary"
        >
          npm
        </a>
      </div>
    </div>
  </footer>
</template>
