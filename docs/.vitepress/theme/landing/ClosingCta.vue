<script setup lang="ts">
import { VPButton } from 'vitepress/theme'
</script>

<template>
  <section class="l-section cta" aria-labelledby="cta-title">
    <div class="l-wrap inner">
      <h2 id="cta-title" class="l-h2">You already wrote the app</h2>
      <p class="l-lede">Add the native shells and open it in the simulator.</p>
      <div class="actions">
        <VPButton size="big" theme="brand" text="Get started" href="/guide/quick-start" />
        <VPButton
          size="big"
          theme="alt"
          text="GitHub"
          href="https://github.com/inertia-native/inertia-native"
        />
      </div>
    </div>
    <footer class="foot l-wrap">
      MIT licensed. A community project, not affiliated with the Inertia.js or
      Hotwire teams.
    </footer>
  </section>
</template>

<style scoped>
.cta {
  padding-bottom: 40px;
}

.inner {
  text-align: center;
}

.inner .l-lede {
  margin-inline: auto;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
}

.foot {
  margin-top: 96px;
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
  text-align: center;
  font-size: 13px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}
</style>
