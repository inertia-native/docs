# iOS

The native iOS shell is a standard [Hotwire Native iOS](https://native.hotwired.dev/ios/overview)
app that loads your Inertia application in a web view. The package handles the
web side; the iOS app provides the navigation stack, path configuration, and any
bridge components.

::: tip Reference app
A runnable example lives in
[demo-ios](https://github.com/inertia-native/demo-ios).
Clone it to see a working setup end to end.
:::

## Outline

1. Create a Hotwire Native iOS app and add the SDK via Swift Package Manager.
2. Point its `Navigator` at your app's URL.
3. Add a `path-configuration` JSON to control which routes present as modals,
   pushes, etc.
4. Register the bridge components your web pages use (`button`, `form`, `menu`,
   …) if any.

## Registering bridge components

Each bridge component your web pages use needs a Swift counterpart registered at
launch, otherwise the web side falls back to its ordinary markup:

```swift
Hotwire.registerBridgeComponents([
    ButtonComponent.self,
    FormComponent.self,
    MenuComponent.self,
])
```

Ready-made components — Swift source plus the matching web half — live in the
[bridge-components](https://github.com/inertia-native/bridge-components)
registry. See [Button](/components/button) for a worked example, including the
minimum SDK version they require.

::: info Work in progress
A full step-by-step walkthrough is being written. For now, the demo app is the
source of truth.
:::
