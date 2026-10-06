# Button

A button rendered in the **native navigation bar**. The web side registers a
title; iOS draws a `UIBarButtonItem` and Android a toolbar menu item; every tap
is relayed back to the web side.

Outside of Hotwire Native nothing is registered and your own markup is rendered
instead, so the same page still works in a regular browser.

<video src="/media/button-ios.mp4" autoplay muted loop playsinline controls style="max-width: 320px; width: 100%; border-radius: 12px;"></video>

*Opening the page registers `Tap me` in the navigation bar; each tap is counted
by the web page below it.*

::: tip You copy it, you own it
There is nothing to install. The files below are the complete component — paste
the web one plus whichever platforms you ship into your app, and change them
however you like. They are shown straight from the
[bridge-components](https://github.com/inertia-native/bridge-components/tree/main/registry/button)
registry, so what you see here is what the registry holds.
:::

## Web side

Save this as `bridge/BridgeButton.tsx` in your app:

::: code-group

<<< @/../vendor/hotwire-bridge-components/registry/button/inertia/react.tsx [BridgeButton.tsx]

:::

Then use it as a component. It renders nothing when the native button is
showing, and renders its children as the web fallback when it is not:

```jsx
import { BridgeButton } from '@/bridge/BridgeButton'

function Article({ onSave }) {
  return (
    <>
      <BridgeButton title="Save" onTap={onSave}>
        <button type="button" onClick={onSave}>Save</button>
      </BridgeButton>

      {/* … */}
    </>
  )
}
```

| Prop | Type | Default | Purpose |
| --- | --- | --- | --- |
| `title` | `string` | — | Label on the native button |
| `side` | `'left' \| 'right'` | `'right'` | Which end of the navigation bar |
| `onTap` | `() => void` | — | Called on every tap |
| `children` | `ReactNode` | — | Web fallback, rendered only in a browser |

## iOS side

Add this file to your Xcode project:

::: code-group

<<< @/../vendor/hotwire-bridge-components/registry/button/native/ButtonComponent.swift [ButtonComponent.swift]

:::

Then register it at launch, in `AppDelegate`:

```swift
Hotwire.registerBridgeComponents([
    ButtonComponent.self,
    // … your other components
])
```

Until it is registered, `supported` stays false on the web side and only the
fallback is rendered.

## The contract

Component name: `button`.

### `connect` — web → native

Registers or re-registers the bar button. Sent on connect and whenever the title
or side changes.

```jsonc
{
  "title": "Save",   // string, required — button label
  "side": "right"    // "left" | "right", optional, default "right"
}
```

### `connect` reply — native → web

Native **replies to the same `connect` message** every time the button is
tapped. There is no separate tap event — the reply *is* the tap signal, and it
arrives once per tap rather than once per registration.

Because a reply can arrive many times, re-registering without dropping the
previous callback makes each tap fire twice. The registry component handles this;
see [Callback lifetime](/components/overview#callback-lifetime) if you write your
own.

## Android

The Kotlin half adds an item to the destination's toolbar. Add this file to your
project:

::: code-group

<<< @/../vendor/hotwire-bridge-components/registry/button/native/ButtonComponent.kt [ButtonComponent.kt]

:::

Then register it at launch, in your `Application`:

```kotlin
Hotwire.registerBridgeComponents(
    BridgeComponentFactory("button", ::ButtonComponent),
    // … your other components
)
```

<video src="/media/button-android.mp4" autoplay muted loop playsinline controls style="max-width: 320px; width: 100%; border-radius: 12px;"></video>

*The same page on Android. Toolbar menu items are upper-cased by the platform,
so `Tap me` is drawn as `TAP ME`.*

::: warning `side` is ignored
Android toolbar menu items always sit at the end of the bar, so a `"left"`
button still appears on the right. Treat `side` as a hint that iOS honours and
Android cannot.
:::
