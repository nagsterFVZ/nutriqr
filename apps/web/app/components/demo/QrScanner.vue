<script setup lang="ts">
import { isNutriQRString } from 'nutriqr'
import type QrScanner from 'qr-scanner'

const { rawString } = useNutriQRDemo()

const open = ref(false)
const video = ref<HTMLVideoElement | null>(null)
const status = ref<'idle' | 'starting' | 'scanning' | 'error'>('idle')
const errorMessage = ref('')
const hint = ref('')
let hintTimeout: ReturnType<typeof setTimeout> | undefined
let scanner: QrScanner | null = null

function onDecode(result: { data: string }) {
  const text = result.data
  if (!isNutriQRString(text)) {
    hint.value = "That QR code isn't a NutriQR code — keep scanning."
    clearTimeout(hintTimeout)
    hintTimeout = setTimeout(() => (hint.value = ''), 2000)
    return
  }
  rawString.value = text
  close()
}

async function openScanner() {
  open.value = true
  status.value = 'starting'
  errorMessage.value = ''

  if (!import.meta.client || !navigator.mediaDevices?.getUserMedia) {
    status.value = 'error'
    errorMessage.value = 'Camera access is not supported in this browser.'
    return
  }

  try {
    const { default: QrScannerCtor } = await import('qr-scanner')
    await nextTick()
    if (!video.value) return

    scanner = new QrScannerCtor(video.value, onDecode, {
      preferredCamera: 'environment',
      highlightScanRegion: true,
      highlightCodeOutline: true,
      returnDetailedScanResult: true
    })
    await scanner.start()
    status.value = 'scanning'
  } catch (e) {
    status.value = 'error'
    errorMessage.value =
      e instanceof Error
        ? e.message
        : 'Could not access the camera. Check permissions and try again.'
  }
}

function close() {
  open.value = false
  status.value = 'idle'
  hint.value = ''
  clearTimeout(hintTimeout)
  scanner?.stop()
  scanner?.destroy()
  scanner = null
}

onBeforeUnmount(close)
</script>

<template>
  <div>
    <button
      type="button"
      class="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:border-primary hover:text-primary"
      @click="openScanner"
    >
      Scan a QR code
    </button>

    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/70 p-6"
      @click.self="close"
    >
      <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-neutral-950">Scan a QR code</h2>
          <button
            type="button"
            class="text-sm font-medium text-neutral-400 hover:text-neutral-950"
            @click="close"
          >
            Close
          </button>
        </div>

        <div
          class="relative mt-4 aspect-square w-full overflow-hidden rounded-xl bg-neutral-950"
        >
          <video
            ref="video"
            class="h-full w-full object-cover"
            muted
            playsinline
          />
        </div>

        <p v-if="status === 'starting'" class="mt-3 text-sm text-neutral-400">
          Requesting camera access&hellip;
        </p>
        <p
          v-else-if="status === 'scanning'"
          class="mt-3 text-sm text-neutral-400"
        >
          Point your camera at a NutriQR code.
        </p>
        <p v-if="hint" class="mt-2 text-sm text-neutral-700">{{ hint }}</p>
        <p
          v-if="status === 'error'"
          class="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-danger"
        >
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </div>
</template>
