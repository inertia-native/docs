# Overview

Bridge components let your web pages drive native UI — a button in the
navigation bar, a native menu, and so on. They build on Hotwire Native's bridge,
which this package re-implements on the web side as `window.HotwireNative.web`.

Each component has two halves that must agree:

| Half | Where it lives | What it does |
| --- | --- | --- |
| Web | Your Inertia app | Registers the component and handles replies |
| Native | Your iOS app | Draws the native UI and reports interaction back |

If the native half is not registered, the web half stays inert and your ordinary
web control is rendered instead. This is what makes the same page work in a
regular browser.

## `useBridgeComponent`

Each framework entry exposes one generic primitive — the examples below use
React; Vue and Svelte have the same shape (see the [API](/reference/api#usebridgecomponent)):

```js
import { useBridgeComponent } from 'inertia-native/react'
```

It returns whether the connected native app supports a component and a stable
`send`:

```jsx
function NativeMenu({ items, onSelect }) {
  const { supported, send } = useBridgeComponent('menu')
  if (!supported) return null

  return (
    <button
      onClick={() =>
        send('connect', { items }, (message) => onSelect(message.data.index))
      }
    >
      Open menu
    </button>
  )
}
```

- `supported` re-checks when the native handshake completes after mount.
- `send(event, data?, callback?)` returns a message id; native replies invoke
  the `callback`.

## Callback lifetime

`useBridgeComponent` removes every callback it registered when the component
unmounts. It does **not** remove them when you re-register — so if you send
`connect` again from an effect that re-runs, drop the previous callback first:

```js
useEffect(() => {
  if (!supported) return
  const id = send('connect', { title }, () => onTapRef.current?.())
  return () => window.HotwireNative?.web?.removeCallback(id)
}, [supported, title, send])
```

Without the cleanup, a changed prop leaves the old callback registered and every
subsequent interaction is reported twice.

## Restoring after a native screen

On Android, coming back to a web screen from a native one dispatches
`native:restore`, and native may have dropped the UI a component drew on
`connect`. `useBridgeComponent` exposes this as `restored`, a counter. Put it
in the deps of the effect that sends `connect`, so it is sent again:

```js
const { supported, send, restored } = useBridgeComponent('button')

useEffect(() => {
  if (!supported) return
  const id = send('connect', { title }, () => onTapRef.current?.())
  return () => window.HotwireNative?.web?.removeCallback(id)
}, [supported, title, send, restored])
```

Nothing is resent automatically: a component that only sends when called (like
`alert`) must not fire again.

## Ready-made components

Rather than writing each component from scratch, you can copy one from the
[bridge-components](https://github.com/inertia-native/bridge-components)
registry. It ships both halves — the web component and its Swift counterpart —
along with a contract describing the messages they exchange.

The model is copy-paste, not a package: you own the source once it is in your
app. See [Button](/components/button) for a worked example.

## Building your own

`useBridgeComponent` is the building block. A native submit button wired to an
Inertia form looks like this:

```js
// hooks/useBridgeForm.js
import { useEffect, useRef } from 'react'
import { useBridgeComponent } from 'inertia-native/react'

export function useBridgeForm({ submitTitle, processing, onSubmit }) {
  const { supported, send } = useBridgeComponent('form')
  const onSubmitRef = useRef(onSubmit)
  onSubmitRef.current = onSubmit

  useEffect(() => {
    if (!supported) return
    const id = send('connect', { submitTitle }, () => onSubmitRef.current?.())
    return () => window.HotwireNative?.web?.removeCallback(id)
  }, [supported, submitTitle, send])

  useEffect(() => {
    if (!supported) return
    send(processing ? 'submitDisabled' : 'submitEnabled')
  }, [supported, processing, send])

  return { supported }
}
```

Usage:

```jsx
import { useForm } from '@inertiajs/react'
import { useRef } from 'react'
import { useBridgeForm } from '@/hooks/useBridgeForm'

function NewResource() {
  const form = useForm({ name: '' })
  const formRef = useRef(null)

  const { supported } = useBridgeForm({
    submitTitle: 'Submit',
    processing: form.processing,
    onSubmit: () => formRef.current?.requestSubmit(),
  })

  return (
    <form ref={formRef} onSubmit={(e) => { e.preventDefault(); form.post('/resources') }}>
      <input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
      {!supported && <button type="submit">Submit</button>}
    </form>
  )
}
```

The native app must register the matching bridge component (`form`, `menu`, …)
for `supported` to be true. See the [iOS guide](/native/ios).
