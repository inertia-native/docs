# API

## `initInertiaNative`

```ts
import { initInertiaNative } from 'inertia-native'

initInertiaNative(options?: {
  debug?: boolean
  proposeFormRedirects?: boolean
}): void
```

Installs the `window.Turbo` shim that Hotwire Native's injected `turbo.js`
drives. Call once, **before** `createInertiaApp`. In a regular browser it stays
inert.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `debug` | `boolean` | `false` | Log the web ↔ native message flow to the web view console. |
| `proposeFormRedirects` | `boolean` | `false` | After a form lands on another URL, propose that URL to native, as Turbo does. See [Form redirects](/guide/navigation#form-redirects). |

The call is idempotent — a repeat call (HMR, double import, React StrictMode)
is a no-op.

## `useBridgeComponent`

The same primitive ships for React, Vue and Svelte. It returns whether the
connected native app supports a component, a `send` function, and a `restored`
counter.

### React

```ts
import { useBridgeComponent } from 'inertia-native/react'

useBridgeComponent(component: string): {
  supported: boolean
  restored: number
  send(
    event: string,
    data?: Record<string, unknown>,
    callback?: (message: BridgeMessage) => void,
  ): string | null
}
```

### Vue

```ts
import { useBridgeComponent } from 'inertia-native/vue'

useBridgeComponent(component: string): {
  supported: Ref<boolean>
  restored: Ref<number>
  send(event, data?, callback?): string | null
}
```

A composable: call it from `setup`. Cleanup runs on unmount.

### Svelte

```ts
import { useBridgeComponent } from 'inertia-native/svelte'

useBridgeComponent(component: string): {
  supported: Readable<boolean>
  restored: Readable<number>
  send(event, data?, callback?): string | null
}
```

Call it during component initialization — it registers an `onDestroy` cleanup.
Read the stores as `$supported` and `$restored`.

### Fields

- `supported` — whether the connected native app supports `component`. Re-checks
  when the native handshake completes after mount.
- `restored` — bumped each time the web view comes back from a native screen
  (`native:restore`, dispatched on Android). A component that draws native UI on
  `connect` should send it again when this changes; see
  [Restoring after a native screen](/components/overview#restoring-after-a-native-screen).
- `send` — sends a message to native. Returns the message id (for callback
  cleanup), or `null` if it was queued or the component is unsupported.

### `BridgeMessage`

```ts
interface BridgeMessage {
  id: string
  component: string
  event: string
  data: Record<string, unknown>
}
```

## Globals

The package installs and reads these on `window`:

| Global | Set by | Purpose |
| --- | --- | --- |
| `window.Turbo` | `initInertiaNative()` | Shim that `turbo.js` drives for navigation. Internal. |
| `window.HotwireNative.web` | `initInertiaNative()` | Web side of the bridge (`send`, `supportsComponent`, `removeCallback`, …). The name is Hotwire Native's bridge protocol. |
| `window.webkit.messageHandlers.turbo` | WKWebView (iOS) | Feature-detect that the app runs inside the native shell. |
