# Introduction

[`inertia-native`](https://www.npmjs.com/package/inertia-native) turns an
[Inertia.js](https://inertiajs.com) app into iOS and Android apps. Your server
keeps rendering every page, and each page visit opens as a native screen, with
native navigation, modals, error screens, and pull to refresh. It works with
React, Vue, and Svelte, and with any backend, such as Laravel or Rails.

It's built on [Hotwire Native](https://native.hotwired.dev), the open-source
framework from 37signals for apps that show web pages in native screens. You
don't need to know Hotwire Native to use it.

::: tip New here?
The [quick start](/guide/quick-start) takes you from your Inertia app to a
native app running in a simulator.
:::

::: info Unofficial
This is a community-built integration. It is **not** an official Inertia.js or
Hotwire project.
:::

## How it works

Hotwire Native was built for Turbo, and it expects to find Turbo on every page.
This package stands in for Turbo and translates its messages to Inertia's
router. When Inertia visits a new page, the native app opens a new screen for
it. The package also lets your pages use bridge components, which draw native
UI such as buttons in the navigation bar.

In a regular browser no native app is listening, so the package does nothing
and Inertia navigates as usual.

[How it works](/guide/how-it-works) explains the native side step by step.

## Entry points

The package has one core entry and three optional ones:

- **Framework-agnostic core** (`inertia-native`) peer-depends on
  `@inertiajs/core` and handles all navigation.
- **Bridge component bindings** are optional. Each one peer-depends on its
  framework and provides `useBridgeComponent`:
  - `inertia-native/react`
  - `inertia-native/vue`
  - `inertia-native/svelte`

## The ecosystem

| Repository | What it is |
| --- | --- |
| [inertia-native](https://github.com/inertia-native/inertia-native) | The npm package, including the native app templates that `init` uses |
| [bridge-components](https://github.com/inertia-native/bridge-components) | Ready-made bridge components to copy into your app |
| [demo-rails](https://github.com/inertia-native/demo-rails) | Web / Rails demo app |
| [demo-ios](https://github.com/inertia-native/demo-ios) | iOS Hotwire Native shell |
| [demo-android](https://github.com/inertia-native/demo-android) | Android Hotwire Native shell |

Next: [Quick start](/guide/quick-start).
