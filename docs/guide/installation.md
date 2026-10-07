# Installation

```bash
npm add inertia-native
```

## Requirements

- `@inertiajs/core` >= 3.0
- `react` >= 18 — only for the `inertia-native/react` entry
- `vue` >= 3.0 — only for the `inertia-native/vue` entry
- `svelte` >= 4.0 — only for the `inertia-native/svelte` entry

## Setup

Call `initInertiaNative()` once, **before** `createInertiaApp`, in your Inertia
entrypoint:

```js
import { createInertiaApp } from '@inertiajs/react'
import { initInertiaNative } from 'inertia-native'

const isNativeApp = !!window.webkit?.messageHandlers?.turbo
initInertiaNative({ debug: import.meta.env.DEV || isNativeApp })

createInertiaApp({ /* ... */ })
```

That's all that's needed for native navigation (push/pop/replace/restore,
modals, forms, error screens, pull-to-refresh). See the [API](/reference/api)
for the available options.

To set up the native iOS and Android shells that load your app, see
[Native apps → iOS](/native/ios) and [Android](/native/android).

## Upgrading from 0.1.0-beta

- `initHotwireNative` is now `initInertiaNative`.
- `@inertiajs/core` 2.x is no longer supported.
- The package was published as `inertia-hotwire-native` before
  `0.1.0-beta.2`; replace that dependency with `inertia-native`.

Next: [Navigation](/guide/navigation).
