<script setup lang="ts">
// Demo state is a module-scope singleton composable (see useNutriQRDemo.ts) —
// keeping this page client-only avoids that state leaking across concurrent
// SSR requests on the server, and there's no SEO value in server-rendering
// an interactive playground anyway.
definePageMeta({ ssr: false })
</script>

<template>
  <div class="mx-auto max-w-6xl px-6 py-12">
    <div class="mb-10 text-center">
      <h1 class="text-3xl font-bold text-neutral-950 sm:text-4xl">
        Interactive demo
      </h1>
      <p class="mx-auto mt-3 max-w-2xl text-neutral-700">
        Edit the nutrition data on the left and watch the encoded
        <code class="rounded bg-primary-light px-1.5 py-0.5 text-primary-dark"
          >NQR1:</code
        >
        string and QR code update live. You can also edit the string directly
        — it syncs back into the form.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <DemoNutrientForm />
      <div class="flex flex-col gap-6">
        <DemoStringSync />
        <DemoQrPreview />
      </div>
    </div>
  </div>
</template>
