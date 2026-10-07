# Introduction

[`inertia-native`](https://www.npmjs.com/package/inertia-native)
lets an [Inertia.js](https://inertiajs.com) application run inside
[Hotwire Native](https://native.hotwired.dev) (iOS & Android) and behave like a
native app.

::: info Unofficial
This is a community-built integration. It is **not** an official Inertia.js or
Hotwire project.
:::

## How it works

Hotwire Native injects a `turbo.js` script into every web view that expects a
`window.Turbo` object to drive. This package installs a small shim that maps the
native adapter protocol onto Inertia's router, so Inertia pages push, pop, and
restore as native screens — plus a web bridge so Inertia pages can use native
bridge components (submit buttons, menus, etc.).

In a regular browser it stays inert: with no native adapter connected, Inertia
navigates exactly as usual.

## Entry points

- **Framework-agnostic core** (`inertia-native`) — peer-depends on
  `@inertiajs/core`. Handles all navigation.
- **Bridge component bindings** — optional, each peer-depends on its framework
  and provides `useBridgeComponent`:
  - `inertia-native/react`
  - `inertia-native/vue`
  - `inertia-native/svelte`

## The ecosystem

| Repository | What it is |
| --- | --- |
| [inertia-native](https://github.com/inertia-native/inertia-native) | The npm package |
| [demo-rails](https://github.com/inertia-native/demo-rails) | Web / Rails demo app |
| [demo-ios](https://github.com/inertia-native/demo-ios) | iOS Hotwire Native shell |
| [demo-android](https://github.com/inertia-native/demo-android) | Android Hotwire Native shell |

Next: [Installation](/guide/installation).
