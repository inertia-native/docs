# Android

The native Android shell is a standard [Hotwire Native Android](https://native.hotwired.dev/android/overview)
app that loads your Inertia application in a web view. The package handles the
web side; the Android app provides the navigation stack, path configuration, and
any bridge components.

::: tip Reference app
A runnable example lives in
[demo-android](https://github.com/inertia-native/demo-android).
Clone it to see a working setup end to end.
:::

## Outline

1. Create a Hotwire Native Android app (Gradle).
2. Point its navigation at your app's URL.
3. Add a `path-configuration` JSON to control which routes present as modals,
   pushes, etc.
4. Register the bridge components your web pages use (`form`, `menu`, …) if any.

::: info Work in progress
A full step-by-step walkthrough is being written. For now, the demo app is the
source of truth.
:::
