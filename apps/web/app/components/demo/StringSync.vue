<script setup lang="ts">
const { rawString, stringError } = useNutriQRDemo()

const copied = ref(false)

async function copyString() {
  await navigator.clipboard.writeText(rawString.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <div class="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-neutral-950">NutriQR string</h2>
      <button
        type="button"
        class="rounded-lg bg-primary-light px-3 py-1.5 text-xs font-semibold text-primary-dark transition-colors hover:bg-primary hover:text-white"
        @click="copyString"
      >
        {{ copied ? 'Copied!' : 'Copy' }}
      </button>
    </div>
    <p class="mt-1 text-sm text-neutral-400">
      This is also editable — paste a different NutriQR string to sync it back into the form.
    </p>

    <textarea
      v-model="rawString"
      rows="4"
      spellcheck="false"
      class="mt-4 w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono text-xs text-neutral-950 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
    />

    <p
      v-if="stringError"
      class="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-danger"
    >
      {{ stringError }}
    </p>
  </div>
</template>
