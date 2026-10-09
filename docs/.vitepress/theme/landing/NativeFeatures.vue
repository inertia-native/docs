<script setup lang="ts">
/** The default slot is the bridge component example, a code block in index.md. */
import Phone from './Phone.vue'
</script>

<template>
  <section class="l-section" aria-labelledby="native-title">
    <div class="l-wrap">
      <h2 id="native-title" class="l-h2">What your pages do inside the app</h2>
      <p class="l-lede">
        Your Inertia code stays as it is. Hotwire Native handles the screens.
      </p>

      <div class="map-grid">
        <div class="map">
          <div class="cols" aria-hidden="true">
            <span class="web">In your Inertia app</span>
            <span class="native">On the phone</span>
          </div>
          <dl>
            <div class="row">
              <dt><code>&lt;Link href="/orders/42"&gt;</code></dt>
              <dd>Pushes a native screen with a back button.</dd>
            </div>
            <div class="row">
              <dt>Going back, by button or swipe</dt>
              <dd>Pops the screen. Inertia restores the page from its history.</dd>
            </div>
            <div class="row">
              <dt><code>router.visit(url, { replace: true })</code></dt>
              <dd>Swaps the current screen for the new one.</dd>
            </div>
            <div class="row">
              <dt><code>"context": "modal"</code> in your path configuration</dt>
              <dd>Opens matching pages as native modals.</dd>
            </div>
            <div class="row">
              <dt><code>form.post('/orders')</code></dt>
              <dd>
                Submits in place. With <code>proposeFormRedirects</code>, native
                can close the modal and show the result.
              </dd>
            </div>
            <div class="row">
              <dt>A 404, a 500 or no connection</dt>
              <dd>Shows the native error screen.</dd>
            </div>
            <div class="row">
              <dt>Pull to refresh</dt>
              <dd>Reloads the current page.</dd>
            </div>
          </dl>
        </div>

        <figure class="shot">
          <Phone
            platform="ios"
            src="/landing/ios-modal.webp"
            alt="iOS app showing a page presented as a native modal sheet over the previous screen"
          />
          <figcaption>A page opened as a modal on iOS</figcaption>
        </figure>
      </div>

      <div class="bridge">
        <figure class="shot">
          <Phone
            platform="android"
            src="/media/button-android.mp4"
            alt="Android app with a Tap me button in the native toolbar. Each tap updates the count on the web page below."
          />
          <figcaption>A web page adds a button to the Android toolbar</figcaption>
        </figure>

        <div class="bridge-copy">
          <h3 class="l-h3">Native controls from your pages</h3>
          <p class="l-text">
            Bridge components let a page put native UI on screen, like a button
            in the navigation bar or an alert, and react when someone taps it.
            Copy ready-made ones from the
            <a href="https://github.com/inertia-native/bridge-components" target="_blank" rel="noreferrer">registry</a>,
            or build your own with
            <code>useBridgeComponent</code> in React, Vue or Svelte.
          </p>
          <div class="vp-doc l-code code"><slot /></div>
          <p class="l-text note">
            Inside the app, <strong>Tap me</strong> goes in the navigation bar.
            In a browser, the page shows its own button instead.
          </p>
          <p><a class="l-link" href="/components/button">See the Button component</a></p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.map-grid {
  display: grid;
  gap: 56px;
  margin-top: 48px;
}

/* Column labels: violet is your app, amber is the phone. */
.cols {
  display: none;
}

.cols span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
}

.cols span::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: currentColor;
}

.web {
  color: var(--l-web);
}

.native {
  color: var(--l-native);
}

dl {
  margin: 0;
}

.row {
  display: grid;
  gap: 6px;
  padding: 16px 0;
  border-top: 1px solid var(--vp-c-divider);
}

.row:last-child {
  border-bottom: 1px solid var(--vp-c-divider);
}

dt {
  font-size: 15px;
  font-weight: 500;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}

dt code {
  color: var(--l-web) !important;
  background: var(--l-web-soft) !important;
}

dd {
  margin: 0;
  position: relative;
  padding-left: 22px;
  font-size: 15px;
  line-height: 1.55;
  color: var(--vp-c-text-2);
}

dd::before {
  content: '\2192';
  position: absolute;
  left: 0;
  color: var(--l-native);
  font-weight: 600;
}

.shot {
  margin: 0;
  width: min(62vw, 250px);
  justify-self: center;
}

.shot figcaption {
  margin-top: 16px;
  text-align: center;
  font-size: 13px;
  line-height: 1.4;
  color: var(--vp-c-text-2);
}

/* Bridge components */
.bridge {
  display: grid;
  gap: 48px;
  margin-top: 96px;
}

.bridge-copy {
  min-width: 0;
}

.bridge-copy .l-text {
  margin-top: 12px;
  max-width: 56ch;
}

.code {
  margin-top: 24px;
  border-radius: 12px;
  overflow: hidden;
}

.code :deep(div[class*='language-']) {
  border-radius: 12px;
}

.note {
  font-size: 14px !important;
}

.bridge-copy .l-text a {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.bridge-copy p:last-child {
  margin-top: 20px;
}

@media (min-width: 768px) {
  .row {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 24px;
    align-items: baseline;
  }

  .cols {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 24px;
    padding-bottom: 12px;
  }

  .cols .native {
    padding-left: 22px;
  }
}

@media (min-width: 960px) {
  .map-grid {
    grid-template-columns: minmax(0, 1fr) 260px;
    gap: 72px;
    align-items: start;
  }

  .map-grid .shot {
    position: sticky;
    top: calc(var(--vp-nav-height) + 32px);
    width: 100%;
  }

  .bridge {
    grid-template-columns: 260px minmax(0, 1fr);
    gap: 72px;
    align-items: center;
    margin-top: 120px;
  }

  .bridge .shot {
    width: 100%;
  }
}
</style>
