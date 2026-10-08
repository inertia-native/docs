---
layout: home
markdownStyles: false
title: Inertia Native
titleTemplate: Your Inertia app as an iOS and Android app
description: Run your Inertia.js app inside native iOS and Android apps built on Hotwire Native. In a browser it does nothing, so your website keeps working.
---

<script setup>
import LandingHero from './.vitepress/theme/landing/LandingHero.vue'
import QuickStart from './.vitepress/theme/landing/QuickStart.vue'
import NativeFeatures from './.vitepress/theme/landing/NativeFeatures.vue'
import Foundation from './.vitepress/theme/landing/Foundation.vue'
import ClosingCta from './.vitepress/theme/landing/ClosingCta.vue'
</script>

<div class="landing">

<LandingHero />

<QuickStart>

```tsx
import { createInertiaApp } from '@inertiajs/react'
import { initInertiaNative } from 'inertia-native' // [!code ++]

initInertiaNative() // [!code ++]

createInertiaApp({
  // ...unchanged
})
```

</QuickStart>

<NativeFeatures>

```jsx
import { useState } from 'react'
import { BridgeButton } from '@/bridge/BridgeButton'

function Counter() {
  const [taps, setTaps] = useState(0)
  const tap = () => setTaps((n) => n + 1)

  return (
    <>
      <BridgeButton title="Tap me" onTap={tap}>
        <button type="button" onClick={tap}>Tap me</button>
      </BridgeButton>
      <h2>Tapped {taps} times</h2>
    </>
  )
}
```

</NativeFeatures>

<Foundation />

<ClosingCta />

</div>
