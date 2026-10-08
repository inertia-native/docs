<script setup lang="ts">
/**
 * A phone frame around a screenshot or a screen recording.
 *
 * To swap a screenshot for a recording, change `src` to the video file:
 *   <Phone src="/landing/ios-push.webp" ... />  →  <Phone src="/landing/ios-push.mp4" ... />
 * Videos play muted, looped and inline; they stay paused for visitors who
 * prefer reduced motion. Media should match the device aspect ratio
 * (iOS 1206×2622, Android 1080×2400, or any size with the same ratio).
 */
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'

const props = withDefaults(
  defineProps<{
    src: string
    alt: string
    platform?: 'ios' | 'android'
    /** Still frame shown until a video can play. */
    poster?: string
    /** Load right away (above the fold). */
    eager?: boolean
  }>(),
  { platform: 'ios', eager: false },
)

const isVideo = computed(() => /\.(mp4|webm|mov)$/i.test(props.src.split(/[?#]/)[0]))
const video = ref<HTMLVideoElement>()
const playing = ref(false)

function toggle() {
  const el = video.value
  if (!el) return
  if (el.paused) el.play().catch(() => {})
  else el.pause()
}

onMounted(() => {
  const el = video.value
  if (!el) return
  el.addEventListener('play', () => (playing.value = true))
  el.addEventListener('pause', () => (playing.value = false))
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) el.play().catch(() => {})
})
</script>

<template>
  <div class="phone" :class="platform">
    <div class="body">
      <div class="screen">
        <video
          v-if="isVideo"
          ref="video"
          :src="withBase(src)"
          :poster="poster && withBase(poster)"
          :aria-label="alt"
          muted
          loop
          playsinline
          :preload="eager ? 'auto' : 'metadata'"
        />
        <img
          v-else
          :src="withBase(src)"
          :alt="alt"
          :loading="eager ? 'eager' : 'lazy'"
          decoding="async"
        />
        <span class="cutout" aria-hidden="true" />
        <button
          v-if="isVideo"
          type="button"
          class="toggle"
          :aria-label="playing ? 'Pause video' : 'Play video'"
          @click="toggle"
        >
          <svg v-if="playing" viewBox="0 0 16 16" aria-hidden="true">
            <rect x="4" y="3" width="3" height="10" rx="1" />
            <rect x="9" y="3" width="3" height="10" rx="1" />
          </svg>
          <svg v-else viewBox="0 0 16 16" aria-hidden="true">
            <path d="M5 3.2v9.6a.7.7 0 0 0 1.06.6l7.6-4.8a.7.7 0 0 0 0-1.2l-7.6-4.8A.7.7 0 0 0 5 3.2Z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.phone {
  container-type: inline-size;
  width: 100%;
}

.body {
  position: relative;
  padding: 2.6cqw;
  border-radius: 15cqw;
  background:
    linear-gradient(145deg, #3a3a3e 0%, #1c1c1f 22%, #121214 70%, #2b2b2f 100%);
  box-shadow:
    inset 0 0 0 0.45cqw #4a4a50,
    inset 0 0 0 0.9cqw #0c0c0d,
    0 1px 2px rgba(15, 15, 30, 0.12),
    0 24px 48px -16px rgba(30, 24, 60, 0.35),
    0 60px 90px -40px rgba(30, 24, 60, 0.3);
}

.dark .body {
  box-shadow:
    inset 0 0 0 0.45cqw #55555c,
    inset 0 0 0 0.9cqw #0c0c0d,
    0 0 0 1px rgba(255, 255, 255, 0.06),
    0 24px 48px -16px rgba(0, 0, 0, 0.6),
    0 60px 90px -40px rgba(0, 0, 0, 0.55);
}

/* Side buttons */
.body::before,
.body::after {
  content: '';
  position: absolute;
  width: 0.9cqw;
  border-radius: 0.5cqw;
  background: #2a2a2e;
}

.body::before {
  right: -0.7cqw;
  top: 30%;
  height: 14%;
}

.body::after {
  left: -0.7cqw;
  top: 22%;
  height: 8%;
  box-shadow: 0 14cqw 0 #2a2a2e;
}

.screen {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1206 / 2622;
  border-radius: 12.6cqw;
  background: #f2f2f4;
  /* Keeps Safari from drawing square corners over the rounded mask. */
  isolation: isolate;
}

.screen img,
.screen video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.cutout {
  position: absolute;
  left: 50%;
  top: 3.4cqw;
  width: 29.4cqw;
  height: 8.8cqw;
  border-radius: 99px;
  background: #050505;
  transform: translateX(-50%);
  pointer-events: none;
}

.toggle {
  position: absolute;
  right: 5cqw;
  bottom: 5cqw;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(20, 20, 24, 0.55);
  color: #fff;
  opacity: 0.75;
  backdrop-filter: blur(6px);
  transition: opacity 0.2s;
}

.toggle:hover,
.toggle:focus-visible {
  opacity: 1;
}

.toggle:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.toggle svg {
  width: 12px;
  height: 12px;
  fill: currentColor;
}

/* Android: squarer corners, punch-hole camera. */
.android .body {
  padding: 2.4cqw;
  border-radius: 9cqw;
}

.android .body::after {
  display: none;
}

.android .body::before {
  top: 24%;
  height: 10%;
}

.android .screen {
  aspect-ratio: 1080 / 2400;
  border-radius: 7cqw;
}

.android .cutout {
  top: 2.6cqw;
  width: 3.4cqw;
  height: 3.4cqw;
}
</style>
