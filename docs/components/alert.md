# Alert

A **native confirmation dialog** put in front of an action. The web side asks for
the alert and hears back only if it was confirmed; iOS presents a
`UIAlertController` and Android an `AlertDialog`.

Outside of Hotwire Native nothing is registered and the hook falls back to
`window.confirm`, so the same page still works in a regular browser.

<video src="/media/alert-ios.mp4" autoplay muted loop playsinline controls style="max-width: 320px; width: 100%; border-radius: 12px;"></video>

*Confirming reports back and the page acts on it. Dismissing reports nothing at
all — the page is left exactly as it was.*

::: tip You copy it, you own it
There is nothing to install. The files below are the complete component — paste
the web one plus whichever platforms you ship into your app, and change them
however you like. They are shown straight from the
[bridge-components](https://github.com/inertia-native/bridge-components/tree/main/registry/alert)
registry, so what you see here is what the registry holds.
:::

## Web side

Save this as `bridge/useBridgeAlert.tsx` in your app:

::: code-group

<<< @/../vendor/hotwire-bridge-components/registry/alert/inertia/react.tsx [useBridgeAlert.tsx]

:::

Then call `show` from wherever the action starts. It runs `onConfirm` only if the
alert was confirmed:

```jsx
import { useBridgeAlert } from '@/bridge/useBridgeAlert'

function DeleteButton({ file }) {
  const { show } = useBridgeAlert()

  const destroy = () => {
    show(
      {
        title: 'Delete this file?',
        description: 'This cannot be undone.',
        destructive: true,
        confirm: 'Delete',
      },
      () => router.delete(`/files/${file.id}`)
    )
  }

  return <button type="button" onClick={destroy}>Delete</button>
}
```

| Option | Type | Default | Purpose |
| --- | --- | --- | --- |
| `title` | `string` | — | Headline of the alert |
| `description` | `string` | — | Body text under the title |
| `destructive` | `boolean` | `false` | Draw the confirming action as destructive |
| `confirm` | `string` | `'OK'` | Label of the confirming action |
| `dismiss` | `string` | `'Cancel'` | Label of the dismissing action |

`useBridgeAlert()` also returns `supported`, for a page that would rather render
its own dialog than let the browser fallback handle it.

::: tip A hook, not a component
[Button](/components/button) draws native UI the moment it mounts, so it is a
component whose children are the web fallback. This one draws nothing until it is
called — there is no markup for a component to own, so it ships as a hook.
:::

## iOS side

Add this file to your Xcode project:

::: code-group

<<< @/../vendor/hotwire-bridge-components/registry/alert/native/AlertComponent.swift [AlertComponent.swift]

:::

Then register it at launch, in `AppDelegate`:

```swift
Hotwire.registerBridgeComponents([
    AlertComponent.self,
    // … your other components
])
```

Until it is registered, `supported` stays false on the web side and `show` falls
back to `window.confirm`.

## The contract

Component name: `alert`.

### `show` — web → native

Presents the alert. Sent once per confirmation, not on connect.

```jsonc
{
  "title": "Are you sure?",                // string, required — headline
  "description": "This cannot be undone.", // string, optional — body text
  "destructive": true,                     // bool, optional, default false
  "confirm": "Delete",                     // string, optional, default "OK"
  "dismiss": "Cancel"                      // string, optional, default "Cancel"
}
```

### `show` reply — native → web

Native replies to the `show` message **only when the confirming action is
tapped**. Dismissing the alert sends nothing at all. The reply carries no data —
it is the confirmation signal itself.

::: warning A dismissal is silence
Because nothing comes back from a cancelled alert, its callback is never invoked
and stays in the bridge's map until the page unmounts. The registry hook drops
the previous callback before each `show`, so at most one is ever outstanding. If
you write your own web side, do the same — see
[Callback lifetime](/components/overview#callback-lifetime).
:::

## Android

The Kotlin half presents an `AlertDialog`. Add this file to your project:

::: code-group

<<< @/../vendor/hotwire-bridge-components/registry/alert/native/AlertComponent.kt [AlertComponent.kt]

:::

Then register it at launch, in your `Application`:

```kotlin
Hotwire.registerBridgeComponents(
    BridgeComponentFactory("alert", ::AlertComponent),
    // … your other components
)
```

<video src="/media/alert-android.mp4" autoplay muted loop playsinline controls style="max-width: 320px; width: 100%; border-radius: 12px;"></video>

*The same page on Android: dismissing with `Keep` leaves the page alone,
confirming with `Delete` updates it.*

::: warning No destructive style
Android has no destructive button style, so `destructive` tints the positive
button with the theme's `colorError` instead. It reads as a warning rather than
as the platform-standard destructive action iOS gives you.
:::
