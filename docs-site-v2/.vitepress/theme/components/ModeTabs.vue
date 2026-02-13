<template>
  <div class="vp-tabs">
    <div class="vp-tabs__list" role="tablist" aria-label="Mode selection">
      <button
        class="vp-tabs__button"
        :class="active === 'docs' ? 'is-active' : ''"
        role="tab"
        :aria-selected="active === 'docs'"
        @click="active = 'docs'"
      >
        Docs Mode
      </button>
      <button
        class="vp-tabs__button"
        :class="active === 'full' ? 'is-active' : ''"
        role="tab"
        :aria-selected="active === 'full'"
        @click="active = 'full'"
      >
        Full Mode
      </button>
    </div>

    <div v-if="active === 'docs'" class="vp-tabs__panel" role="tabpanel">
      <h3>Configuration (Docs Mode)</h3>
      <pre><code class="language-json">{
  "mcpServers": {
    "sfcc-dev": {
      "command": "npx",
      "args": ["sfcc-dev-mcp"]
    }
  }
}</code></pre>
      <ul>
        <li>Immediate access to SFCC docs, SFRA, ISML, and cartridge generation</li>
        <li>No credentials required</li>
        <li>Great for onboarding and quick lookups</li>
      </ul>
    </div>

    <div v-else class="vp-tabs__panel" role="tabpanel">
      <h3>Configuration (Full Mode)</h3>
      <pre><code class="language-json">{
  "mcpServers": {
    "sfcc-dev": {
      "command": "npx",
      "args": [
        "sfcc-dev-mcp",
        "--dw-json",
        "/path/to/dw.json",
        "--debug",
        "false"
      ]
    }
  }
}</code></pre>
      <ul>
        <li>Live logs and job logs</li>
        <li>System and custom object metadata</li>
        <li>Site preferences and code version tools</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const active = ref<'docs' | 'full'>('docs');
</script>
