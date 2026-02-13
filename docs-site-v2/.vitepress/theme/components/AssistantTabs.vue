<template>
  <div class="vp-tabs">
    <div class="vp-tabs__list" role="tablist" aria-label="Assistant selection">
      <button class="vp-tabs__button" :class="active === 'copilot' ? 'is-active' : ''" role="tab" :aria-selected="active === 'copilot'" @click="active = 'copilot'">GitHub Copilot</button>
      <button class="vp-tabs__button" :class="active === 'claude' ? 'is-active' : ''" role="tab" :aria-selected="active === 'claude'" @click="active = 'claude'">Claude Desktop</button>
      <button class="vp-tabs__button" :class="active === 'cursor' ? 'is-active' : ''" role="tab" :aria-selected="active === 'cursor'" @click="active = 'cursor'">Cursor</button>
    </div>

    <div class="vp-tabs__panel" role="tabpanel">
      <h3>Configuration</h3>
      <pre><code class="language-json">{
  "mcpServers": {
    "sfcc-dev": {
      "command": "npx",
      "args": ["sfcc-dev-mcp", "--dw-json", "/path/to/dw.json", "--debug", "false"]
    }
  }
}</code></pre>

      <div class="vp-grid vp-grid--3">
        <div class="vp-card" v-for="item in benefits[active]" :key="item.title">
          <h4>{{ item.title }}</h4>
          <p>{{ item.text }}</p>
        </div>
      </div>

      <div class="vp-links" v-if="links[active]">
        <a v-for="link in links[active]" :key="link.url" :href="link.url" target="_blank" rel="noopener noreferrer">{{ link.label }}</a>
      </div>

      <h4>Verification prompts</h4>
      <ul>
        <li v-for="prompt in prompts[active]" :key="prompt">{{ prompt }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type Assistant = 'copilot' | 'claude' | 'cursor';

const active = ref<Assistant>('copilot');

const benefits: Record<Assistant, Array<{ title: string; text: string }>> = {
  copilot: [
    { title: 'Inline speed', text: 'Rapid completions and edits in VS Code.' },
    { title: 'Scaffolding', text: 'Generate controllers, models, and tests.' },
    { title: 'Everyday flow', text: 'Low-friction iteration for daily work.' }
  ],
  claude: [
    { title: 'Deep reasoning', text: 'Great for architecture and multi-step planning.' },
    { title: 'Debug sessions', text: 'Explain logs and identify root causes.' },
    { title: 'Exploration', text: 'Modeling and refactor strategy guidance.' }
  ],
  cursor: [
    { title: 'Rule packs', text: 'Context-aware security and performance rules.' },
    { title: 'Large changes', text: 'Safely coordinate multi-file refactors.' },
    { title: 'Consistency', text: 'Standardize patterns across the codebase.' }
  ]
};

const prompts: Record<Assistant, string[]> = {
  copilot: [
    'Show methods on dw.catalog.Product',
    'Create SFRA controller for Product-Show',
    'Search job logs for failed step exceptions',
    'List custom attributes on Product object'
  ],
  claude: [
    'List available SFCC documentation tools',
    'Analyze recent error logs then summarize likely root cause',
    'Generate cartridge structure named demo_cartridge',
    'Show hook reference entries for SCAPI extension points'
  ],
  cursor: [
    'Suggest performance improvements for this controller',
    'Apply security patterns to this hook',
    'Search SFRA docs for middleware guidance',
    'Summarize latest job execution health'
  ]
};

const links: Record<Assistant, Array<{ label: string; url: string }>> = {
  copilot: [
    { label: 'Copilot MCP setup', url: 'https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/extend-copilot-chat-with-mcp' }
  ],
  claude: [
    { label: 'Claude MCP setup', url: 'https://support.anthropic.com/en/articles/10949351-getting-started-with-local-mcp-servers-on-claude-desktop' }
  ],
  cursor: [
    { label: 'Cursor MCP setup', url: 'https://docs.cursor.com/advanced/model-context-protocol' }
  ]
};
</script>
