<template>
  <div class="vp-card">
    <h3>dw.json builder</h3>
    <p>Fill in the fields you need. Empty fields are omitted from the JSON output.</p>

    <div class="vp-form">
      <label>
        Hostname
        <input v-model="form.hostname" type="text" placeholder="your-instance.sandbox.us01.dx.commercecloud.salesforce.com" />
      </label>
      <label>
        Username
        <input v-model="form.username" type="text" placeholder="your-username" />
      </label>
      <label>
        Password
        <input v-model="form.password" type="password" placeholder="your-password" />
      </label>
      <label>
        Client ID
        <input v-model="form.clientId" type="text" placeholder="your-ocapi-client-id" />
      </label>
      <label>
        Client Secret
        <input v-model="form.clientSecret" type="password" placeholder="your-ocapi-client-secret" />
      </label>
      <label>
        Site ID
        <input v-model="form.siteId" type="text" placeholder="SiteGenesis" />
      </label>
      <label>
        Code Version
        <input v-model="form.codeVersion" type="text" placeholder="version1" />
      </label>
    </div>

    <div class="vp-code-block">
      <pre><code class="language-json">{{ output }}</code></pre>
    </div>

    <button class="vp-button" type="button" @click="copyJson">Copy JSON</button>
    <span v-if="copied" class="vp-hint">Copied</span>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';

const form = reactive({
  hostname: '',
  username: '',
  password: '',
  clientId: '',
  clientSecret: '',
  siteId: '',
  codeVersion: ''
});

const output = computed(() => {
  const data: Record<string, string> = {};
  if (form.hostname) data.hostname = form.hostname;
  if (form.username) data.username = form.username;
  if (form.password) data.password = form.password;
  if (form.clientId) data['client-id'] = form.clientId;
  if (form.clientSecret) data['client-secret'] = form.clientSecret;
  if (form.siteId) data['site-id'] = form.siteId;
  if (form.codeVersion) data['code-version'] = form.codeVersion;
  return JSON.stringify(data, null, 2);
});

const copied = ref(false);

const copyJson = async () => {
  copied.value = false;
  if (typeof navigator === 'undefined') return;
  await navigator.clipboard.writeText(output.value);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 1500);
};
</script>
