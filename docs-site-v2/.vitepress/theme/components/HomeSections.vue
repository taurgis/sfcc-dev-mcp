<template>
  <section class="home-section home-section--quick-start">
    <div class="home-section__header">
      <span class="home-pill home-pill--green">No credentials required</span>
      <h2>Zero-config quick start</h2>
      <p>
        Jump straight into SFCC development with AI assistance. Get access to documentation,
        agent skills, and cartridge generation tools instantly.
      </p>
    </div>

    <NewcomerCTA />

    <div class="home-grid home-grid--2">
      <div class="home-card">
        <h3>Add to your AI client</h3>
        <pre><code class="language-json">{
  "mcpServers": {
    "sfcc-dev": {
      "command": "npx",
      "args": ["sfcc-dev-mcp"]
    }
  }
}</code></pre>
      </div>
      <div class="home-card home-card--steps">
        <div class="home-step">
          <span class="home-step__icon">✓</span>
          <div>
            <strong>Instant access</strong>
            <p>Start using SFCC documentation and tools immediately</p>
          </div>
        </div>
        <div class="home-step">
          <span class="home-step__icon">✓</span>
          <div>
            <strong>No setup required</strong>
            <p>Documentation-only mode works out of the box</p>
          </div>
        </div>
        <div class="home-step">
          <span class="home-step__icon">✓</span>
          <div>
            <strong>Full documentation</strong>
            <p>SFCC API docs, SFRA docs, ISML, and skills included</p>
          </div>
        </div>
      </div>
    </div>

    <div class="home-callout home-callout--info">
      💡 <strong>Want more features?</strong> Open a workspace with <code>dw.json</code> (auto-discovered),
      or use <code>--dw-json</code> for logs, system objects, and advanced tools.
    </div>
  </section>

  <div class="home-cta-row">
    <a class="home-button home-button--primary" href="/guide/ai-interfaces">Get started in 2 minutes →</a>
    <a class="home-button" href="/examples">See examples</a>
  </div>

  <section class="home-section home-section--warning">
    <div class="home-warning">
      <div class="home-warning__icon">⚠️</div>
      <div>
        <h3>Essential: AI instructions required</h3>
        <p>
          Your AI needs specific instructions to use the MCP server effectively. Use the ready-to-go instruction files
          for GitHub Copilot, Claude, and Cursor.
        </p>
        <div class="home-warning__actions">
          <a class="home-button home-button--danger" href="https://github.com/taurgis/sfcc-dev-mcp/tree/main/ai-instructions" target="_blank" rel="noopener noreferrer">Download AI instructions</a>
          <a class="home-link" href="/guide/ai-interfaces">Setup guide →</a>
        </div>
      </div>
    </div>
  </section>

  <section class="home-section home-section--timeline">
    <div class="home-section__header">
      <h2>Stop fighting documentation</h2>
      <p>Transform your SFCC workflow from manual hunting to AI-powered assistance.</p>
    </div>

    <div class="timeline-grid">
      <div class="timeline-card timeline-card--before">
        <div class="timeline-card__header">
          <span class="timeline-badge timeline-badge--bad">Traditional</span>
          <p>Frustrating & time-consuming</p>
        </div>
        <div class="timeline-steps">
          <div class="timeline-step">
            <span>1</span>
            <div>
              <strong>Documentation hunt</strong>
              <p>Open 10+ tabs searching for method signatures</p>
              <em>15-30 minutes</em>
            </div>
          </div>
          <div class="timeline-step">
            <span>2</span>
            <div>
              <strong>Copy-paste engineering</strong>
              <p>Hunt for code examples across forums and docs</p>
              <em>20-45 minutes</em>
            </div>
          </div>
          <div class="timeline-step">
            <span>3</span>
            <div>
              <strong>Debug blindly</strong>
              <p>Manual log analysis without proper context</p>
              <em>1-3 hours</em>
            </div>
          </div>
          <div class="timeline-step">
            <span>4</span>
            <div>
              <strong>Feature scaffolding</strong>
              <p>Manually create cartridge structures and boilerplate</p>
              <em>30-60 minutes</em>
            </div>
          </div>
          <div class="timeline-step">
            <span>5</span>
            <div>
              <strong>Context switching</strong>
              <p>Jump between IDE, browser, logs, and docs</p>
              <em>Constant overhead</em>
            </div>
          </div>
        </div>
        <div class="timeline-summary">Total time lost: 2-4 hours daily</div>
      </div>

      <div class="timeline-card timeline-card--after">
        <div class="timeline-card__header">
          <span class="timeline-badge timeline-badge--good">AI-enhanced</span>
          <p>Efficient & intelligent</p>
        </div>
        <div class="timeline-steps">
          <div class="timeline-step">
            <span>1</span>
            <div>
              <strong>Ask AI directly</strong>
              <p>Instant answers grounded in SFCC docs</p>
              <em>30 seconds</em>
            </div>
          </div>
          <div class="timeline-step">
            <span>2</span>
            <div>
              <strong>Get complete examples</strong>
              <p>Curated agent skills drive correct patterns</p>
              <em>1-2 minutes</em>
            </div>
          </div>
          <div class="timeline-step">
            <span>3</span>
            <div>
              <strong>Smart debugging</strong>
              <p>AI filters logs and surfaces root causes</p>
              <em>2-5 minutes</em>
            </div>
          </div>
          <div class="timeline-step">
            <span>4</span>
            <div>
              <strong>Instant scaffolding</strong>
              <p>Generate cartridges and endpoints fast</p>
              <em>1-2 minutes</em>
            </div>
          </div>
          <div class="timeline-step">
            <span>5</span>
            <div>
              <strong>Stay in flow</strong>
              <p>Everything inside your editor</p>
              <em>No context switching</em>
            </div>
          </div>
        </div>
        <div class="timeline-summary">Total time saved: 2-3 hours daily</div>
      </div>
    </div>

    <div class="timeline-cta">Ready to 10x your SFCC productivity? Set up in under 2 minutes.</div>
  </section>

  <section class="home-section home-section--modes">
    <div class="home-section__header">
      <h2>What you get</h2>
      <p>Two modes to match your needs: start instantly, then upgrade to full mode for live data analysis.</p>
    </div>

    <div class="home-grid home-grid--2">
      <div class="mode-card mode-card--docs">
        <h3>Documentation mode</h3>
        <p>Zero setup required</p>
        <ul>
          <li>Complete SFCC API documentation</li>
          <li>SFRA documentation and skills</li>
          <li>Cartridge generation tools</li>
          <li>Security and performance guidance</li>
        </ul>
      </div>
      <div class="mode-card mode-card--full">
        <h3>Full mode</h3>
        <p>Everything + live data</p>
        <ul>
          <li>All documentation features</li>
          <li>Real-time log analysis</li>
          <li>System and custom object exploration</li>
          <li>Code version management</li>
        </ul>
        <div class="mode-card__badge">Requires SFCC credentials</div>
      </div>
    </div>
  </section>

  <section class="home-section home-section--features">
    <div class="home-section__header">
      <h2>Everything you need</h2>
      <p>38 specialized tools for comprehensive SFCC development support.</p>
    </div>

    <div class="feature-grid">
      <div class="feature-item">
        <span>📚</span>
        <h4>Documentation</h4>
        <p>Complete API docs</p>
      </div>
      <div class="feature-item">
        <span>🧰</span>
        <h4>Log analysis</h4>
        <p>Real-time monitoring</p>
      </div>
      <div class="feature-item">
        <span>🧩</span>
        <h4>System objects</h4>
        <p>Live exploration</p>
      </div>
      <div class="feature-item">
        <span>📦</span>
        <h4>Cartridges</h4>
        <p>Auto generation</p>
      </div>
      <div class="feature-item">
        <span>🧵</span>
        <h4>Job logs</h4>
        <p>Execution insights</p>
      </div>
    </div>
  </section>

  <section class="home-section home-section--testdrive">
    <div class="home-section__header">
      <span class="home-pill home-pill--teal">Test drive</span>
      <h2>Try it right now</h2>
      <p>After setup, ask your AI this question to see the MCP server in action.</p>
    </div>

    <div class="testdrive-card">
      <h3>Ask your AI this</h3>
      <div class="testdrive-prompt">
        "Explain how to get the sale price for a product variant in SFCC. Keep it short and a quick example"
      </div>
      <div class="testdrive-actions">
        <button class="home-button home-button--primary" type="button" @click="copyPrompt">Copy prompt</button>
        <button class="home-button home-button--danger" type="button" @click="openWithoutModal">View without MCP</button>
        <button class="home-button home-button--success" type="button" @click="openWithModal">View with MCP</button>
      </div>
    </div>

    <div class="testdrive-grid">
      <div class="testdrive-chip">
        <strong>SFCC methods</strong>
        <p>Lists actual APIs like getPriceModel()</p>
      </div>
      <div class="testdrive-chip">
        <strong>Code examples</strong>
        <p>Real SFCC code with correct syntax</p>
      </div>
      <div class="testdrive-chip">
        <strong>Documentation</strong>
        <p>Accurate API context and references</p>
      </div>
    </div>

    <div class="testdrive-note">
      Without MCP, your AI gives generic responses. With MCP, it uses live SFCC docs for accurate answers.
    </div>

    <div class="home-cta-row">
      <a class="home-button home-button--success" href="/examples">Try more examples</a>
      <a class="home-button" href="/guide/configuration">Add full mode</a>
    </div>
  </section>

  <section class="home-section home-section--final">
    <div class="final-card">
      <p>
        "Empower your AI assistant with comprehensive SFCC knowledge for faster, more accurate development assistance."
      </p>
      <div class="home-cta-row">
        <a class="home-button home-button--primary" href="/guide/ai-interfaces">Get started now</a>
        <a class="home-button" href="/features">Explore features</a>
      </div>
    </div>
  </section>

  <div v-if="isWithoutModalOpen" class="image-modal" @click.self="closeWithoutModal">
    <div
      ref="withoutModalRef"
      class="image-modal__content"
      role="dialog"
      aria-modal="true"
      aria-labelledby="without-mcp-modal-title"
      tabindex="-1"
    >
      <header>
        <h3 id="without-mcp-modal-title">AI response without MCP</h3>
        <button ref="withoutCloseButtonRef" aria-label="Close without MCP modal" @click="closeWithoutModal">Close</button>
      </header>
      <div class="image-modal__image">
        <img
          ref="imageRef1"
          src="/explain-product-pricing-methods-no-mcp.png"
          alt="AI response without MCP"
          @mousemove="onMoveImage1"
          @mouseenter="zooming1 = true"
          @mouseleave="zooming1 = false"
        />
        <div v-if="zooming1" class="image-modal__zoom" :style="zoomStyle1"></div>
      </div>
      <div class="image-modal__note image-modal__note--bad">
        This response uses generic or incorrect patterns. MCP provides grounded SFCC guidance.
      </div>
    </div>
  </div>

  <div v-if="isWithModalOpen" class="image-modal" @click.self="closeWithModal">
    <div
      ref="withModalRef"
      class="image-modal__content"
      role="dialog"
      aria-modal="true"
      aria-labelledby="with-mcp-modal-title"
      tabindex="-1"
    >
      <header>
        <h3 id="with-mcp-modal-title">AI response with MCP</h3>
        <button ref="withCloseButtonRef" aria-label="Close with MCP modal" @click="closeWithModal">Close</button>
      </header>
      <div class="image-modal__image">
        <img
          ref="imageRef2"
          src="/explain-product-pricing-methods.png"
          alt="AI response with MCP"
          @mousemove="onMoveImage2"
          @mouseenter="zooming2 = true"
          @mouseleave="zooming2 = false"
        />
        <div v-if="zooming2" class="image-modal__zoom" :style="zoomStyle2"></div>
      </div>
      <div class="image-modal__note image-modal__note--good">
        MCP pulls accurate SFCC methods, patterns, and examples from live docs.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue';
import NewcomerCTA from './NewcomerCTA.vue';

const promptText = 'Explain how to get the sale price for a product variant in SFCC. Keep it short and a quick example';

const copyPrompt = async () => {
  if (typeof navigator === 'undefined') return;
  await navigator.clipboard.writeText(promptText);
};

const isWithoutModalOpen = ref(false);
const isWithModalOpen = ref(false);
const withoutModalRef = ref<HTMLElement | null>(null);
const withModalRef = ref<HTMLElement | null>(null);
const withoutCloseButtonRef = ref<HTMLButtonElement | null>(null);
const withCloseButtonRef = ref<HTMLButtonElement | null>(null);
const previouslyFocusedElement = ref<HTMLElement | null>(null);

const zooming1 = ref(false);
const zooming2 = ref(false);
const zoomPosition1 = ref({ x: 0, y: 0 });
const zoomPosition2 = ref({ x: 0, y: 0 });
const imageRef1 = ref<HTMLImageElement | null>(null);
const imageRef2 = ref<HTMLImageElement | null>(null);

const getActiveModalElement = () => {
  if (isWithoutModalOpen.value) return withoutModalRef.value;
  if (isWithModalOpen.value) return withModalRef.value;
  return null;
};

const openWithoutModal = () => {
  isWithoutModalOpen.value = true;
};

const openWithModal = () => {
  isWithModalOpen.value = true;
};

const closeWithoutModal = () => {
  isWithoutModalOpen.value = false;
};

const closeWithModal = () => {
  isWithModalOpen.value = false;
};

const closeAllModals = () => {
  isWithoutModalOpen.value = false;
  isWithModalOpen.value = false;
};

const focusModalCloseButton = async () => {
  await nextTick();
  if (isWithoutModalOpen.value) {
    withoutCloseButtonRef.value?.focus();
    return;
  }
  if (isWithModalOpen.value) {
    withCloseButtonRef.value?.focus();
  }
};

const trapFocusInModal = (event: KeyboardEvent) => {
  if (event.key !== 'Tab') return;
  const modalElement = getActiveModalElement();
  if (!modalElement) return;

  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  const focusableElements = Array.from(modalElement.querySelectorAll<HTMLElement>(focusableSelectors))
    .filter((element) => !element.hasAttribute('disabled'));

  if (!focusableElements.length) {
    event.preventDefault();
    modalElement.focus();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  const activeElement = document.activeElement;

  if (event.shiftKey && activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
    return;
  }

  if (!event.shiftKey && activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
};

const onWindowKeydown = (event: KeyboardEvent) => {
  if (!isWithoutModalOpen.value && !isWithModalOpen.value) return;

  if (event.key === 'Escape') {
    event.preventDefault();
    closeAllModals();
    return;
  }

  trapFocusInModal(event);
};

watch([isWithoutModalOpen, isWithModalOpen], async ([withoutOpen, withOpen], [wasWithoutOpen, wasWithOpen]) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const isOpen = withoutOpen || withOpen;
  const wasOpen = wasWithoutOpen || wasWithOpen;

  if (isOpen && !wasOpen) {
    previouslyFocusedElement.value = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onWindowKeydown);
    await focusModalCloseButton();
    return;
  }

  if (isOpen) {
    await focusModalCloseButton();
    return;
  }

  if (!isOpen && wasOpen) {
    window.removeEventListener('keydown', onWindowKeydown);
    document.body.style.overflow = '';
    previouslyFocusedElement.value?.focus();
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', onWindowKeydown);
  }
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
});

const onMoveImage1 = (event: MouseEvent) => {
  if (!imageRef1.value) return;
  const rect = imageRef1.value.getBoundingClientRect();
  zoomPosition1.value = { x: event.clientX - rect.left, y: event.clientY - rect.top };
};

const onMoveImage2 = (event: MouseEvent) => {
  if (!imageRef2.value) return;
  const rect = imageRef2.value.getBoundingClientRect();
  zoomPosition2.value = { x: event.clientX - rect.left, y: event.clientY - rect.top };
};

const createZoomStyle = (image: HTMLImageElement | null, position: { x: number; y: number }) => {
  if (!image) return {};
  const scale = 2;
  const size = 240;
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${position.x - size / 2}px`,
    top: `${position.y - size / 2}px`,
    backgroundImage: `url('${image.src}')`,
    backgroundSize: `${image.offsetWidth * scale}px ${image.offsetHeight * scale}px`,
    backgroundPosition: `-${position.x * scale - size / 2}px -${position.y * scale - size / 2}px`
  };
};

const zoomStyle1 = computed(() => createZoomStyle(imageRef1.value, zoomPosition1.value));
const zoomStyle2 = computed(() => createZoomStyle(imageRef2.value, zoomPosition2.value));
</script>
