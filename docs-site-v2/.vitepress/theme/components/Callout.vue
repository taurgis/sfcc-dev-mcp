<template>
  <div class="vp-callout" :data-variant="variant">
    <strong v-if="title">{{ title }}</strong>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title?: string; variant?: 'info' | 'warn' | 'danger' | 'success' }>();
</script>
