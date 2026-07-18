<template>
  <div class="flex min-h-screen flex-col bg-neutral-50">
    <LayoutSiteHeader />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutSiteFooter />
  </div>
</template>
