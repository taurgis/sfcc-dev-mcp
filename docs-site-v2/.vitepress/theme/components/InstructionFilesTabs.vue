<template>
  <div class="vp-tabs">
    <div class="vp-tabs__list" role="tablist" aria-label="Instruction files selection">
      <button class="vp-tabs__button" :class="active === 'copilot' ? 'is-active' : ''" role="tab" :aria-selected="active === 'copilot'" @click="active = 'copilot'">GitHub Copilot</button>
      <button class="vp-tabs__button" :class="active === 'claude' ? 'is-active' : ''" role="tab" :aria-selected="active === 'claude'" @click="active = 'claude'">Claude Desktop</button>
      <button class="vp-tabs__button" :class="active === 'cursor' ? 'is-active' : ''" role="tab" :aria-selected="active === 'cursor'" @click="active = 'cursor'">Cursor</button>
    </div>

    <div class="vp-tabs__panel" role="tabpanel">
      <h3>Available instruction files</h3>
      <ul>
        <li v-for="file in data[active].files" :key="file.name">
          <strong>{{ file.name }}</strong> - {{ file.description }}
          <div class="vp-code-inline">{{ file.path }}</div>
        </li>
      </ul>

      <h4>Setup steps</h4>
      <ol>
        <li v-for="step in data[active].instructions" :key="step">{{ step }}</li>
      </ol>

      <a :href="data[active].setupUrl" target="_blank" rel="noopener noreferrer">Official setup guide</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type Target = 'copilot' | 'claude' | 'cursor';

const active = ref<Target>('copilot');

const data: Record<Target, {
  setupUrl: string;
  files: Array<{ name: string; path: string; description: string }>;
  instructions: string[];
}> = {
  copilot: {
    setupUrl: 'https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions',
    files: [
      {
        name: 'copilot-instructions.md',
        path: '.github/copilot-instructions.md',
        description: 'Main instruction file for GitHub Copilot with SFCC expertise and MCP tool usage patterns'
      }
    ],
    instructions: [
      'Copy the instruction file from the repository to your project',
      'Place it in the .github folder of your repository',
      'Copilot automatically detects and uses these instructions',
      'The file includes SFCC development patterns, security guidance, and tool usage'
    ]
  },
  claude: {
    setupUrl: 'https://support.anthropic.com/en/articles/10185728-understanding-claude-s-personalization-features',
    files: [
      {
        name: 'claude_custom_instructions.md',
        path: 'ai-instructions/claude-desktop/claude_custom_instructions.md',
        description: 'Claude Desktop instructions with conversational development patterns and MCP integration'
      }
    ],
    instructions: [
      'Copy the instruction content from the repository file',
      'Open Claude settings and paste the content into preferences',
      'The profile applies to all conversations'
    ]
  },
  cursor: {
    setupUrl: 'https://docs.cursor.com/en/context/rules',
    files: [
      {
        name: 'SFCC rule pack',
        path: 'ai-instructions/cursor/.cursor/rules/',
        description: 'Rule pack with specialized files covering SFCC development areas'
      }
    ],
    instructions: [
      'Copy the entire .cursor folder from the repository to your project root',
      'Cursor automatically applies rules based on file context',
      'Rules cover cartridge development, SFRA patterns, security, performance, and debugging'
    ]
  }
};
</script>
