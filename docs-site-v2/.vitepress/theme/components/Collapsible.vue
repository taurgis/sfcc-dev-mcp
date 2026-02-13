<template>
  <details class="vp-collapsible" :open="open">
    <summary class="vp-collapsible__summary">
      <span>{{ title }}</span>
    </summary>
    <div class="vp-collapsible__content">
      <slot />
    </div>
  </details>
</template>

<script setup lang="ts">
defineProps<{ title: string; open?: boolean }>();
</script>
