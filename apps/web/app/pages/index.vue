<script setup lang="ts">
const referenceString =
  'NQR1:["1234567890128","GrainWorks|Protein Oats","g",100,0.4,[415,13,5.6,43,9.7,0.47,25,8.5]]'

const steps = [
  {
    title: 'Encode',
    body: 'A manufacturer packs GTIN, brand/product name, and the full EU nutrition table into one compact NQR1: string.'
  },
  {
    title: 'Print',
    body: 'The string is rendered as a QR code and printed directly on the packaging — no barcode lookup required.'
  },
  {
    title: 'Scan offline',
    body: 'Any app using the NutriQR library decodes the code instantly, with zero network calls.'
  }
]

const benefits = [
  {
    title: 'Ultra-compact',
    body: 'A full nutrition profile fits in as little as 82 bytes — small enough for tiny QR codes on real packaging.'
  },
  {
    title: 'Offline-first',
    body: 'All mandatory nutrition data lives inside the code itself. No database, no network, no lookup latency.'
  },
  {
    title: 'Metric & imperial',
    body: 'Native support for g/ml and oz/fl units, with precise conversion built into the reference library.'
  },
  {
    title: 'GTIN-linkable',
    body: 'An optional GTIN-13 still lets apps connect to external product databases when they are online.'
  }
]
</script>

<template>
  <div>
    <section class="mx-auto max-w-5xl px-6 pt-20 pb-16 text-center">
      <span
        class="inline-block rounded-full bg-primary-light px-4 py-1 text-xs font-semibold tracking-wide text-primary-dark uppercase"
      >
        Open specification
      </span>
      <h1 class="mt-6 text-4xl font-bold text-neutral-950 sm:text-5xl">
        Nutrition data, packed into a QR code
      </h1>
      <p class="mx-auto mt-5 max-w-2xl text-lg text-neutral-700">
        NutriQR is a compact, open format for encoding complete EU nutrition
        labels into a single QR code — so calorie and diet trackers can read
        packaging instantly, without a backend product database.
      </p>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
        <NuxtLink
          to="/demo"
          class="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
        >
          Try the live demo
        </NuxtLink>
        <NuxtLink
          to="/docs/spec"
          class="rounded-lg border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition-colors hover:border-primary hover:text-primary"
        >
          Read the specification
        </NuxtLink>
      </div>

      <div class="mt-14 flex justify-center">
        <ClientOnly>
          <BrandedQrCode :data="referenceString" :size="180" />
          <template #fallback>
            <div
              class="h-[180px] w-[180px] animate-pulse rounded-2xl bg-neutral-200"
            />
          </template>
        </ClientOnly>
      </div>
      <p class="mt-3 font-mono text-xs break-all text-neutral-400">
        {{ referenceString }}
      </p>
    </section>

    <section class="border-y border-neutral-200 bg-white py-16">
      <div class="mx-auto max-w-5xl px-6">
        <h2 class="text-center text-2xl font-bold text-neutral-950">
          How it works
        </h2>
        <div class="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div v-for="(step, i) in steps" :key="step.title" class="text-center">
            <div
              class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white"
            >
              {{ i + 1 }}
            </div>
            <h3 class="mt-4 text-base font-semibold text-neutral-950">
              {{ step.title }}
            </h3>
            <p class="mt-2 text-sm text-neutral-700">{{ step.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-5xl px-6 py-16">
      <h2 class="text-center text-2xl font-bold text-neutral-950">
        Why NutriQR
      </h2>
      <div class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div
          v-for="benefit in benefits"
          :key="benefit.title"
          class="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <h3 class="text-base font-semibold text-neutral-950">
            {{ benefit.title }}
          </h3>
          <p class="mt-2 text-sm text-neutral-700">{{ benefit.body }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
