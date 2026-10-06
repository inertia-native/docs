# API

## `initHotwireNative`

```ts
import { initHotwireNative } from 'inertia-native'

initHotwireNative(options?: { debug?: boolean }): void
```

Installs the `window.Turbo` shim that Hotwire Native's injected `turbo.js`
drives. Call once, **before** `createInertiaApp`. In a regular browser it stays
inert.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `debug` | `boolean` | `false` | Log the web ↔ native message flow to the web view console. |

The call is idempotent — a repeat call (HMR, double import, React StrictMode)
is a no-op.

## `useBridgeComponent`

```ts
import { useBridgeComponent } from 'inertia-native/react'

useBridgeComponent(component: string): {
  supported: boolean
  send(
    event: string,
    data?: Record<string, unknown>,
    callback?: (message: BridgeMessage) => void,
  ): string | null
}
```

Generic React wrapper over the web bridge core (`window.HotwireNative.web`).

- `supported` — whether the connected native app supports `component`. Re-checks
  when the native handshake completes after mount.
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
| `window.Turbo` | `initHotwireNative()` | Shim that `turbo.js` drives for navigation. |
| `window.HotwireNative.web` | `initHotwireNative()` | Web side of the bridge (`send`, `supportsComponent`, …). |
| `window.webkit.messageHandlers.turbo` | WKWebView (iOS) | Feature-detect that the app runs inside the native shell. |
