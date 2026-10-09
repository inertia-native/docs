<template>
  <section class="l-section alt" aria-labelledby="foundation-title">
    <div class="l-wrap grid">
      <div>
        <h2 id="foundation-title" class="l-h2">Built on Hotwire Native</h2>
        <p class="l-lede">
          Hotwire Native is the open-source framework 37signals uses for its
          HEY and Basecamp mobile apps. Inertia Native connects your Inertia
          app to it. The native side is a regular Hotwire Native app, so the
          Hotwire Native docs apply to it.
        </p>
        <p class="link">
          <a class="l-link" href="https://native.hotwired.dev" target="_blank" rel="noreferrer">
            Hotwire Native docs
          </a>
        </p>
      </div>

      <!-- The middle layer is thin on purpose: it is a shim. -->
      <ol class="cake" aria-label="How the pieces fit, top to bottom">
        <li class="tier web">
          <strong>Your Inertia app</strong>
          <span>React, Vue or Svelte pages, served by Laravel, Rails or any other backend.</span>
        </li>
        <li class="tier shim">
          <code>inertia-native</code>
          <span>Hands Inertia visits to Hotwire Native. Does nothing in a browser.</span>
        </li>
        <li class="tier native">
          <strong>Hotwire Native</strong>
          <span>The iOS and Android apps: native screens, modals and bridge components.</span>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  gap: 48px;
  align-items: center;
}

.link {
  margin-top: 24px;
}

.cake {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg);
  overflow: hidden;
  box-shadow: 0 24px 48px -32px rgba(30, 24, 60, 0.25);
}

.tier {
  display: grid;
  gap: 6px;
  padding: 28px 28px 30px;
}

.tier strong {
  font-family: var(--l-display);
  font-size: 22px;
  font-weight: 750;
  letter-spacing: -0.01em;
}

.tier span {
  max-width: 40ch;
  font-size: 15px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}

.web {
  background: var(--l-web-soft);
}

.web strong {
  color: var(--l-web);
}

.native {
  background: var(--l-native-soft);
}

.native strong {
  color: var(--l-native);
}

.tier.shim {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 14px;
  padding: 10px 28px;
  border-block: 1px dashed var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.shim code {
  padding: 0 !important;
  background: none !important;
  font-size: 13px !important;
  font-weight: 600;
  color: var(--vp-c-text-1) !important;
}

.shim span {
  max-width: none;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

@media (min-width: 960px) {
  .grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 80px;
  }
}
</style>
