# Installation

Most apps should start with `npx inertia-native init`, which installs the
package, sets it up, and creates the native apps. The
[quick start](/guide/quick-start) walks through it. This page covers the
package on its own: what it needs and how to set it up by hand.

```bash
npm add inertia-native
```

## Requirements

The package needs Inertia 3. The framework packages are optional peers, so you
only need the one your app uses:

- `@inertiajs/core` >= 3.0
- `react` >= 18, only for the `inertia-native/react` entry
- `vue` >= 3.0, only for the `inertia-native/vue` entry
- `svelte` >= 4.0, only for the `inertia-native/svelte` entry

## Setup

Call `initInertiaNative()` once, **before** `createInertiaApp`, in your Inertia
entrypoint:

```js
import { createInertiaApp } from '@inertiajs/react'
import { initInertiaNative } from 'inertia-native'

initInertiaNative()

createInertiaApp({ /* ... */ })
```

That's all native navigation needs: new screens, going back, modals, forms,
error screens, and pull to refresh. In a regular browser the call does
nothing.

To log the messages between your page and the native app while you develop,
pass `debug`:

```js
initInertiaNative({ debug: import.meta.env.DEV })
```

See the [API](/reference/api) for every option.

### Server-side rendering

From version 1.1, `initInertiaNative()` does nothing on the server, where
there's no `window`. In version 1.0, guard the call:
<!-- TODO: confirm version -->

```js
if (typeof window !== 'undefined') initInertiaNative()
```

The [FAQ](/guide/faq#does-server-side-rendering-work) covers bridge components
and server-side rendering.

## Native apps

The package is the web half. The native iOS and Android apps that load your
pages are separate projects, and `npx inertia-native init` creates them. See
[iOS](/native/ios) and [Android](/native/android).

## Upgrading from 0.1.0-beta

Version 1.0 renamed the setup function and dropped Inertia 2:

- `initHotwireNative` is now `initInertiaNative`.
- `@inertiajs/core` 2.x is no longer supported.
- The package was published as `inertia-hotwire-native` before
  `0.1.0-beta.2`; replace that dependency with `inertia-native`.

Next: [Bridge components](/components/overview).
