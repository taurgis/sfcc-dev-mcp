<template>
  <aside
    class="maintenance-notice"
    :data-placement="placement"
    role="note"
    aria-label="Project maintenance notice"
  >
    <div class="maintenance-notice__inner">
      <p>
        <strong>This project is no longer actively maintained.</strong>
        Salesforce now offers an official, much more complete toolkit, and you should switch to the
        <a
          href="https://salesforcecommercecloud.github.io/b2c-developer-tooling/"
          target="_blank"
          rel="noopener noreferrer"
        >Agentic B2C Developer Toolkit</a>.
      </p>
      <p>
        It is generally available and includes the B2C CLI (<code>@salesforce/b2c-cli</code>),
        the official MCP server (<code>@salesforce/b2c-dx-mcp</code>, for example
        <code>npx -y @salesforce/b2c-dx-mcp@latest</code>), agent skills and plugins, and an IDE extension.
      </p>
      <ul>
        <li>
          <a
            href="https://salesforcecommercecloud.github.io/b2c-developer-tooling/"
            target="_blank"
            rel="noopener noreferrer"
          >Docs</a>
        </li>
        <li>
          <a
            href="https://salesforcecommercecloud.github.io/b2c-developer-tooling/mcp/"
            target="_blank"
            rel="noopener noreferrer"
          >MCP guide</a>
        </li>
        <li>
          <a
            href="https://github.com/SalesforceCommerceCloud/b2c-developer-tooling"
            target="_blank"
            rel="noopener noreferrer"
          >Repository</a>
        </li>
        <li>
          <a
            href="https://developer.salesforce.com/docs/commerce/b2c-commerce/guide/b2c-developer-tooling.html"
            target="_blank"
            rel="noopener noreferrer"
          >Salesforce Developers</a>
        </li>
      </ul>
      <p>
        Documentation lookup and development guidance are in the official MCP and its agent skills.
        Log investigation is in the MCP and the B2C CLI.
        The script debugger is in the MCP and the IDE extension.
        You can keep using the current version of this project if you already depend on it.
      </p>
    </div>
  </aside>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ placement?: 'banner' | 'inline' }>(), {
  placement: 'inline'
});
</script>
