<script setup lang="ts">
const { lastValidString } = useNutriQRDemo()
</script>

<template>
  <div
    class="flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm"
  >
    <h2 class="self-start text-lg font-semibold text-neutral-950">
      QR code
    </h2>

    <ClientOnly>
      <BrandedQrCode :data="lastValidString" :size="200" />
    </ClientOnly>

    <p class="text-xs text-neutral-400">
      Always reflects the last successfully encoded value.
    </p>
  </div>
</template>
