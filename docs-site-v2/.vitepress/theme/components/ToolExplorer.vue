<template>
  <div class="vp-tool-explorer">
    <div class="vp-tool-explorer__controls">
      <input
        v-model="search"
        type="search"
        placeholder="Search tools or prompts..."
        aria-label="Search tools or prompts"
      />
      <button v-if="search" class="vp-tool-explorer__clear" type="button" @click="search = ''">Clear</button>
      <select v-model="activeCategory" aria-label="Filter tools by category">
        <option value="All">All categories ({{ tools.length }})</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }} ({{ categoryCounts[category] }})
        </option>
      </select>
    </div>

    <div class="vp-tool-grid">
      <div v-for="tool in filteredTools" :key="tool.id" class="vp-tool-card" :id="tool.id">
        <div class="vp-tool-card__header">
          <span class="vp-tool-card__name">{{ tool.name }}</span>
          <span class="vp-tool-card__mode" :data-mode="tool.mode">{{ modeLabel(tool.mode) }}</span>
        </div>
        <p>{{ tool.description }}</p>
        <details v-if="tool.params?.length || tool.examples?.length" class="vp-tool-card__details">
          <summary>View parameters and examples</summary>
          <div v-if="tool.params && tool.params.length" class="vp-tool-card__params">
            <strong>Parameters</strong>
            <ul>
              <li v-for="param in tool.params" :key="param.name">
                <span class="vp-code-inline">{{ param.name }}</span>
                <span>{{ param.description }}</span>
              </li>
            </ul>
          </div>
          <div v-if="tool.examples && tool.examples.length" class="vp-tool-card__examples">
            <strong>Examples</strong>
            <ul>
              <li v-for="example in tool.examples" :key="example">{{ example }}</li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { tools, TOOL_CATEGORIES } from '../../../data/tools';

const search = ref('');
const activeCategory = ref('All');

const categories = TOOL_CATEGORIES as unknown as string[];

const categoryCounts = tools.reduce<Record<string, number>>((acc, tool) => {
  acc[tool.category] = (acc[tool.category] || 0) + 1;
  return acc;
}, {});

const modeLabel = (mode: string) => {
  if (mode === 'both') return 'Docs + Full';
  if (mode === 'docs') return 'Docs';
  return 'Full';
};


const filteredTools = computed(() => {
  const q = search.value.trim().toLowerCase();
  return tools.filter((tool) => {
    const matchCategory = activeCategory.value === 'All' || tool.category === activeCategory.value;
    if (!matchCategory) return false;
    if (!q) return true;
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.examples?.some((ex) => ex.toLowerCase().includes(q)) ||
      tool.params?.some((param) => param.name.toLowerCase().includes(q)) ||
      tool.tags?.some((tag) => tag.toLowerCase().includes(q))
    );
  });
});
</script>
