<script setup lang="ts">
const props = withDefaults(defineProps<{ data: string; size?: number }>(), {
  size: 200
})

const container = ref<HTMLElement | null>(null)
const ready = ref(false)
// qr-code-styling renders via canvas/SVG and only makes sense client-side;
// the instance itself doesn't need to be reactive.
let qrInstance: import('qr-code-styling').default | null = null

async function ensureInstance() {
  if (qrInstance || !import.meta.client || !props.data) return
  const { default: QRCodeStyling } = await import('qr-code-styling')
  qrInstance = new QRCodeStyling({
    width: props.size,
    height: props.size,
    data: props.data,
    margin: 8,
    qrOptions: { errorCorrectionLevel: 'M' },
    dotsOptions: { type: 'square', color: '#10151a' },
    cornersSquareOptions: { type: 'square', color: '#10151a' },
    cornersDotOptions: { type: 'square', color: '#10151a' },
    backgroundOptions: { color: '#ffffff' }
  })
  if (container.value) qrInstance.append(container.value)
  ready.value = true
}

onMounted(ensureInstance)

watch(
  () => props.data,
  async (val) => {
    if (!val) return
    if (!qrInstance) {
      await ensureInstance()
      return
    }
    qrInstance.update({ data: val })
  }
)
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div
      :style="{ width: `${size}px`, height: `${size}px` }"
      class="overflow-hidden rounded-2xl bg-white"
    >
      <div v-if="!ready" class="h-full w-full animate-pulse bg-neutral-200" />
      <div ref="container" />
    </div>
    <p class="text-lg font-semibold tracking-[0.3em] text-neutral-950">
      NutriQR
    </p>
  </div>
</template>
