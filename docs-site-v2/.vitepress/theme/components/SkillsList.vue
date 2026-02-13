<template>
  <div class="skills-list">
    <div class="skills-controls">
      <input
        v-model="search"
        type="search"
        placeholder="Search skills..."
        class="skills-search"
        aria-label="Search skills"
      />
      <span class="skills-count">{{ filteredSkills.length }} skills</span>
    </div>
    <div class="skills-grid">
      <a
        v-for="skill in filteredSkills"
        :key="skill.name"
        class="skills-card"
        :href="skill.githubUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div class="skills-card__header">
          <span class="skills-card__badge">{{ skill.name }}</span>
        </div>
        <p class="skills-card__desc">{{ skill.description || 'No description provided.' }}</p>
        <span class="skills-card__link">View on GitHub</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { skills } from '../../../data/skills';

const search = ref('');

const filteredSkills = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return skills;
  return skills.filter((skill) => {
    return (
      skill.name.toLowerCase().includes(q) ||
      skill.description.toLowerCase().includes(q)
    );
  });
});
</script>
