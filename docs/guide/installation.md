# Installation

::: warning Beta
Published under the `beta` tag while the API stabilizes. Install with `@beta`.
:::

```bash
npm add inertia-native@beta
```

## Requirements

- `@inertiajs/core` >= 2.0 (works with the v3 line)
- `react` >= 18 — only for the `inertia-native/react` entry

## Setup

Call `initHotwireNative()` once, **before** `createInertiaApp`, in your Inertia
entrypoint:

```js
import { createInertiaApp } from '@inertiajs/react'
import { initHotwireNative } from 'inertia-native'

const isHotwireNative = !!window.webkit?.messageHandlers?.turbo
initHotwireNative({ debug: import.meta.env.DEV || isHotwireNative })

createInertiaApp({ /* ... */ })
```

That's all that's needed for native navigation (push/pop/replace/restore,
modals, forms, error screens, pull-to-refresh).

To set up the native iOS and Android shells that load your app, see
[Native apps → iOS](/native/ios) and [Android](/native/android).

Next: [Navigation](/guide/navigation).
