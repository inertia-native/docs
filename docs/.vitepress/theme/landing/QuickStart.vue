<script setup lang="ts">
/**
 * The default slot is the entrypoint diff, written as a code block in
 * index.md so it gets the site's syntax highlighting.
 *
 * Terminal output follows the `npx inertia-native init` spec (INIT-CLI.md):
 * the dev server URL and next-step command depend on whether `artisan`
 * (Laravel) or `bin/dev` (Rails) exists.
 */
import { computed, ref } from 'vue'
import CopyCommand from './CopyCommand.vue'

const stacks = {
  laravel: {
    label: 'Laravel',
    entry: 'resources/js/app.tsx',
    url: 'http://localhost:8000',
    dev: 'composer run dev',
  },
  rails: {
    label: 'Rails',
    entry: 'app/frontend/entrypoints/inertia.tsx',
    url: 'http://localhost:3000',
    dev: 'bin/dev',
  },
} as const

type Stack = keyof typeof stacks
const current = ref<Stack>('laravel')
const s = computed(() => stacks[current.value])
</script>

<template>
  <section class="l-section alt" aria-labelledby="quick-start-title">
    <div class="l-wrap">
      <header class="head">
        <div>
          <h2 id="quick-start-title" class="l-h2">Two commands and your dev server</h2>
          <p class="l-lede">Run them in the root of your Inertia app.</p>
        </div>
        <div class="switch" role="group" aria-label="Show commands for">
          <button
            v-for="(stack, key) in stacks"
            :key="key"
            type="button"
            :aria-pressed="current === key"
            @click="current = key"
          >
            {{ stack.label }}
          </button>
        </div>
      </header>

      <div class="grid">
        <ol class="steps">
          <li>
            <h3 class="l-h3">Run init</h3>
            <CopyCommand command="npx inertia-native init" />
            <p class="l-text">
              It adds the package, puts two lines in your Inertia entrypoint
              and creates the <code>ios/</code> and <code>android/</code> projects.
            </p>
          </li>
          <li>
            <h3 class="l-h3">Start your dev server</h3>
            <CopyCommand :command="s.dev" />
            <p class="l-text">Keep it running. The apps load your pages from it.</p>
          </li>
          <li>
            <h3 class="l-h3">Run the app</h3>
            <div class="cmds">
              <CopyCommand command="npm run ios" />
              <CopyCommand command="npm run android" />
            </div>
            <p class="l-text">
              Builds the app and opens it in the iOS Simulator or an Android
              emulator. You need Xcode for iOS and the Android SDK for Android.
            </p>
          </li>
        </ol>

        <div class="output">
          <div class="terminal" role="region" aria-label="Output of npx inertia-native init">
            <div class="bar" aria-hidden="true"><i /><i /><i /></div>
            <pre><code><span class="dim">$</span> npx inertia-native init
<span class="ask">?</span> Platforms <span class="dim">›</span> <b>both</b>
<span class="ok">✓</span> Found entrypoint {{ s.entry }}
<span class="ask">?</span> App name <span class="dim">›</span> <b>Acme Shop</b>
<span class="ask">?</span> Bundle ID <span class="dim">›</span> <b>com.example.acmeshop</b>
<span class="ask">?</span> Dev server URL <span class="dim">›</span> <b>{{ s.url }}</b>
<span class="ok">✓</span> Added inertia-native to package.json (npm)
<span class="ok">✓</span> Patched {{ s.entry }}
<span class="ok">✓</span> Created ios/ and android/
<span class="ok">✓</span> Added "ios" and "android" scripts to package.json

<b>Next:</b> start your dev server ({{ s.dev }}), then run: <b>npm run ios</b></code></pre>
          </div>

          <div class="diff">
            <div class="file">
              <span>{{ s.entry }}</span>
              <span class="added">Two lines added by init</span>
            </div>
            <div class="vp-doc l-code"><slot /></div>
          </div>
        </div>
      </div>

      <p class="more"><a class="l-link" href="/guide/quick-start">Read the quick start</a></p>
    </div>
  </section>
</template>

<style scoped>
.head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.switch {
  display: inline-flex;
  padding: 3px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
}

.switch button {
  padding: 6px 14px;
  border-radius: 7px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: color 0.2s, background-color 0.2s;
}

.switch button:hover {
  color: var(--vp-c-text-1);
}

.switch button[aria-pressed='true'] {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}

.switch button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 1px;
}

.grid {
  display: grid;
  gap: 48px;
  margin-top: 48px;
}

/* Steps */
.steps {
  list-style: none;
  counter-reset: step;
  margin: 0;
  padding: 0;
}

.steps li {
  position: relative;
  counter-increment: step;
  padding: 0 0 36px 52px;
}

.steps li:last-child {
  padding-bottom: 0;
}

.steps li::before {
  content: counter(step);
  position: absolute;
  left: 0;
  top: -2px;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid var(--vp-c-brand-1);
  font-family: var(--l-display);
  font-size: 15px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-alt);
}

/* The thread between step numbers */
.steps li:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 15.5px;
  top: 34px;
  bottom: 2px;
  width: 1px;
  background: var(--vp-c-divider);
}

.steps .l-h3 {
  font-size: 20px;
}

.steps .cmd,
.cmds {
  margin-top: 12px;
}

.cmds {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cmds .cmd {
  margin-top: 0;
}

.steps .l-text {
  margin-top: 10px;
  max-width: 44ch;
}

/* Terminal */
.output {
  display: grid;
  gap: 16px;
  align-content: start;
  min-width: 0;
}

.terminal {
  border-radius: 12px;
  background: #16161a;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.06),
    0 20px 40px -24px rgba(20, 16, 50, 0.45);
  overflow: hidden;
}

.dark .terminal {
  background: #0f0f12;
  box-shadow: 0 0 0 1px var(--vp-c-divider);
}

.bar {
  display: flex;
  gap: 6px;
  padding: 12px 14px 0;
}

.bar i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #3a3a40;
}

.terminal pre {
  margin: 0;
  padding: 14px 20px 20px;
  overflow-x: auto;
}

.terminal code {
  display: block;
  width: max-content;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.75;
  color: #c9c9d1;
  background: none;
  padding: 0;
}

.terminal b {
  font-weight: 600;
  color: #fff;
}

.terminal .dim {
  color: #74747e;
}

.terminal .ask {
  color: #8fb4ff;
}

.terminal .ok {
  color: #4ccf82;
}

/* Entrypoint diff */
.diff {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-code-block-bg);
  overflow: hidden;
}

.file {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px 16px;
  padding: 10px 20px;
  border-bottom: 1px solid var(--vp-c-divider);
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
  color: var(--vp-c-text-2);
}

.added {
  font-family: var(--vp-font-family-base);
  color: var(--vp-c-text-2);
}

.diff :deep(div[class*='language-']) {
  border-radius: 0;
}

.diff :deep(span.lang) {
  display: none;
}

.more {
  margin-top: 40px;
}

@media (min-width: 960px) {
  .grid {
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    gap: 64px;
    margin-top: 56px;
  }
}
</style>
