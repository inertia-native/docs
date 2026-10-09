<script setup lang="ts">
import { VPButton } from 'vitepress/theme'
import Phone from './Phone.vue'
import CopyCommand from './CopyCommand.vue'
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="glow" aria-hidden="true" />
    <div class="inner l-wrap">
      <div class="copy">
        <p class="name"><span class="logo" aria-hidden="true" />Inertia Native</p>
        <h1 id="hero-title">
          Your Inertia app,<br class="br" /> as a real iOS <span class="nw">and Android app</span>
        </h1>
        <p class="lede">
          Inertia Native opens the pages you already have as native screens,
          with the platform’s own navigation and modals. In a browser it does
          nothing, so your website keeps working.
        </p>
        <div class="actions">
          <VPButton size="big" theme="brand" text="Get started" href="/guide/quick-start" />
          <VPButton
            size="big"
            theme="alt"
            text="GitHub"
            href="https://github.com/inertia-native/inertia-native"
          />
        </div>
        <CopyCommand class="install" command="npx inertia-native init" />
        <p class="stack">
          Inertia 3 with React, Vue or Svelte. Laravel, Rails or any other backend.
        </p>
      </div>

      <figure class="devices">
        <div class="dev-ios">
          <Phone
            platform="ios"
            src="/landing/ios-push.webp"
            alt="iOS app showing a pushed screen titled Basic Navigation, with a native back button"
            eager
          />
          <div class="mark native" aria-hidden="true"><span>Native navigation</span></div>
          <div class="mark web" aria-hidden="true"><span>Your Inertia page</span></div>
        </div>
        <div class="dev-android">
          <Phone
            platform="android"
            src="/landing/android-push.webp"
            alt="The same screen on Android, with a native toolbar and back arrow"
            eager
          />
        </div>
        <figcaption>The same Inertia page on iOS and Android</figcaption>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding: 40px var(--l-gutter) 72px;
  isolation: isolate;
}

.glow {
  position: absolute;
  inset: -64px 0 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(60% 26% at 40% 76%, var(--l-web-soft), transparent 70%),
    radial-gradient(44% 18% at 70% 90%, var(--l-native-soft), transparent 70%);
}

.inner {
  display: grid;
  gap: 56px;
}

.name {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--l-display);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.005em;
  color: var(--vp-c-text-1);
}

/* Two screens, one on top of the other: your app and the phone. */
.logo {
  position: relative;
  width: 18px;
  height: 18px;
}

.logo::before,
.logo::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.logo::before {
  left: 0;
  top: 0;
  background: var(--l-web);
}

.logo::after {
  right: 0;
  bottom: 0;
  background: var(--l-native);
  box-shadow: 0 0 0 2px var(--vp-c-bg);
}

.nw {
  white-space: nowrap;
}

.br {
  display: none;
}

@media (min-width: 480px) {
  .br {
    display: inline;
  }
}

h1 {
  margin-top: 14px;
  font-family: var(--l-display);
  font-size: clamp(40px, 6.4vw, 68px);
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.035em;
  color: var(--vp-c-text-1);
  text-wrap: balance;
}

.lede {
  margin-top: 22px;
  max-width: 34em;
  font-size: 19px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  text-wrap: pretty;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.install {
  margin-top: 16px;
}

.stack {
  margin-top: 20px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

/* Devices */
.devices {
  --phone: min(46vw, 230px);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin: 0;
}

.dev-ios,
.dev-android {
  flex: none;
  animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

/* iOS sits behind and higher; Android in front, so both back buttons show. */
.dev-ios {
  position: relative;
  z-index: 1;
  width: var(--phone);
}

.dev-android {
  position: relative;
  z-index: 2;
  width: calc(var(--phone) * 0.95);
  margin-top: calc(var(--phone) * 0.52);
  margin-left: calc(var(--phone) * -0.32);
  animation-delay: 0.12s;
}

figcaption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -36px;
  text-align: center;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.mark {
  display: none;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(28px);
  }
}

@keyframes fade {
  from {
    opacity: 0;
  }
}

@media (min-width: 960px) {
  .hero {
    padding-top: 64px;
    padding-bottom: 96px;
  }

  .glow {
    background:
      radial-gradient(36% 44% at 72% 36%, var(--l-web-soft), transparent 70%),
      radial-gradient(26% 32% at 86% 72%, var(--l-native-soft), transparent 70%);
  }

  .inner {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: center;
    gap: 32px;
  }

  h1 {
    font-size: clamp(46px, 4.7vw, 68px);
  }

  .devices {
    --phone: clamp(200px, 18vw, 250px);
    justify-content: flex-end;
    padding-left: 150px;
  }

  .mark {
    display: block;
    position: absolute;
    right: calc(100% + 14px);
    width: 10px;
    border: 1.5px solid currentColor;
    border-right: 0;
    border-radius: 3px 0 0 3px;
    animation: fade 0.6s ease-out 0.7s both;
  }

  .mark span {
    position: absolute;
    right: calc(100% + 10px);
    white-space: nowrap;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.3;
    text-align: right;
  }

  .mark.native {
    top: 1.5%;
    height: 11%;
    color: var(--l-native);
  }

  .mark.native span {
    top: 50%;
    transform: translateY(-50%);
  }

  .mark.web {
    top: 14%;
    bottom: 1.5%;
    color: var(--l-web);
  }

  .mark.web span {
    top: 24px;
  }
}

@media (min-width: 1200px) {
  .inner {
    grid-template-columns: minmax(0, 1.08fr) minmax(0, 1fr);
  }
}
</style>
