<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ command: string }>()
const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  try {
    await navigator.clipboard.writeText(props.command)
    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => (copied.value = false), 1600)
  } catch {
    // Clipboard blocked: the command is still selectable text.
  }
}
</script>

<template>
  <div class="cmd">
    <code><span class="ps" aria-hidden="true">$</span>{{ command }}</code>
    <button type="button" :aria-label="`Copy “${command}”`" @click="copy">
      <span aria-live="polite">{{ copied ? 'Copied' : 'Copy' }}</span>
    </button>
  </div>
</template>

<style scoped>
.cmd {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  line-height: 1;
}

.cmd code {
  overflow-x: auto;
  padding: 11px 4px 11px 14px;
  white-space: nowrap;
  color: var(--vp-c-text-1);
  background: none;
  font-size: inherit;
  border-radius: 0;
}

.ps {
  margin-right: 10px;
  color: var(--vp-c-text-3);
  user-select: none;
}

button {
  flex: none;
  align-self: stretch;
  padding: 0 12px;
  border-left: 1px solid var(--vp-c-divider);
  font-family: var(--vp-font-family-base);
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: color 0.2s, background-color 0.2s;
  border-radius: 0 7px 7px 0;
}

button:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-default-soft);
}

button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: -2px;
}
</style>
