# Quick start

This guide takes an Inertia app you already have and runs it as a native iOS
and Android app in a simulator. It works with any backend. The examples show
Laravel and Rails, and the tabs show where the two differ.

You don't need to know Hotwire Native, Swift, or Kotlin to follow along.
[How it works](/guide/how-it-works) explains the moving parts once you've seen
them run.

## Before you start

You need an Inertia app and the tools for the platforms you want to build:

- An Inertia.js app on Inertia 3 or later, with React, Vue, or Svelte.
- For iOS: a Mac with Xcode 16 or later.
- For Android: Android Studio with at least one emulator. Android Studio
  calls an emulator an Android Virtual Device (AVD), and you create one in its
  **Device Manager**.

You can skip the tools for a platform you don't build.

<!-- TODO: confirm the minimum Android Studio version for AGP 9.2.1 -->

## 1. Run `init`

Run this in your app's root, the directory with `package.json`:

```bash
npx inertia-native init
```

<!-- TODO: confirm the first inertia-native version that ships `init` and `run` -->

It asks a few questions. Press Enter to accept each default:

- **Platforms**: iOS, Android, or both.
- **App name**: the name under the app icon. The default comes from your
  directory name.
- **Bundle ID**: the app's unique ID, written like a reversed domain name
  (`com.acme.shop`). The App Store and Google Play use it to tell apps apart.
  The default `com.example.…` is fine for trying things out.
- **Dev server URL**: the address the app loads. Use the same URL you open in
  your browser during development.

Then it changes four things in your project. The output looks like this, with
the defaults accepted:

::: code-group

```text [Laravel]
$ npx inertia-native init
? Platforms [both/ios/android] (both) ›
✓ Found entrypoint resources/js/app.tsx
? App name (Acme Shop) ›
? Bundle ID (com.example.acmeshop) ›
? Dev server URL (http://localhost:8000) ›
› npm install inertia-native
✓ Added inertia-native to package.json (npm)
✓ Patched resources/js/app.tsx
✓ Created ios/ and android/
✓ Added "ios" and "android" scripts to package.json

Next: start your dev server (composer run dev), then run: npm run ios (or npm run android)
```

```text [Rails]
$ npx inertia-native init
? Platforms [both/ios/android] (both) ›
✓ Found entrypoint app/javascript/entrypoints/inertia.tsx
? App name (Acme Shop) ›
? Bundle ID (com.example.acmeshop) ›
? Dev server URL (http://localhost:3000) ›
› npm install inertia-native
✓ Added inertia-native to package.json (npm)
✓ Patched app/javascript/entrypoints/inertia.tsx
✓ Created ios/ and android/
✓ Added "ios" and "android" scripts to package.json

Next: start your dev server (bin/dev), then run: npm run ios (or npm run android)
```

:::

`init` finds your Inertia entrypoint by looking for `createInertiaApp(` in the
usual places. It picks `http://localhost:8000` when it finds `artisan` and
`http://localhost:3000` otherwise. If your app runs somewhere else, type that
URL at the prompt.

`init` uses the package manager your lockfile belongs to, so its hints may say
`pnpm run ios` or `yarn run ios` instead of `npm run ios`.

`init` is safe to run again: it skips anything that's already done. See
[What `init` did](#what-init-did) for the details, or
[`init` options](#init-options) to run it without questions.

## 2. Start your dev server

If you plan to run on Android, change one line of your Vite config first. The
Laravel and Rails starter kits serve scripts from `http://[::1]:5173`, an IPv6
address that Android can't reach. Make Vite listen on `127.0.0.1` instead:

::: code-group

```ts [Laravel]
// vite.config.ts
export default defineConfig({
    // …
    server: {
        host: '127.0.0.1', // [!code ++]
        // …
    },
})
```

```ts [Rails]
// vite.config.ts
export default defineConfig(({ command }) => ({
  server: { host: "127.0.0.1" }, // [!code ++]
  // …
}))
```

:::

`npm run android` checks for this and prints the line to add if it's missing.
iOS works either way.

Now start your app the way you always do:

::: code-group

```bash [Laravel]
composer run dev
```

```bash [Rails]
bin/dev
```

:::

Open the dev server URL in your browser to check that the app is up. The
native app loads the same URL, so it needs the server running.

## 3. Run the app

In a second terminal, run the platform you want:

```bash
npm run ios
npm run android
```

`npm run ios` builds the app, starts an iPhone simulator, installs the app,
and opens it. `npm run android` builds the app, starts your first emulator if
no device is connected, installs the app, and opens it. On Android it also
runs `adb reverse` for your dev server's ports, so `localhost` on the device
reaches your computer. The first build downloads Hotwire Native and the other
dependencies, so it takes longer than the ones after it.

You should see your home page on a native screen. Try these:

- Tap a link. A new screen slides in, with a native back button.
- Go back with the back button or a swipe from the left edge.
- Open a page whose URL ends in `/new` or `/edit`. It opens as a modal: a
  screen that slides up from the bottom.
- Pull the page down to reload it.

If Android shows **Error loading page**, see
[the checklist](/native/android#error-loading-page-on-the-emulator).

::: tip Laravel starter kit: stuck on "Email verification"?
The starter kit asks new users to verify their email. In development it
doesn't send the email: it writes the link to `storage/logs/laravel.log`, and
the app has no address bar to open it. Use an account that's already verified
instead. `php artisan db:seed` creates `test@example.com` with the password
`password`. To verify an account you've already registered, run this and then
pull down to reload the page:

```bash
php artisan tinker --execute="App\Models\User::where('email', 'you@example.com')->update(['email_verified_at' => now()])"
```

:::

To run on your own phone, see [iOS](/native/ios#run-on-your-iphone) and
[Android](/native/android#run-on-your-phone).

## 4. Make it feel native

Your app runs, but it still shows web parts that a native app doesn't need,
such as your site's top navigation bar. [Feel native](/guide/feel-native)
shows how to hide them, close a modal after a form, and add a native button.

## What `init` did

`init` made four changes. You can make them by hand instead if you prefer to
see each step.

### The package and two lines of JavaScript

`init` added the `inertia-native` package with your package manager, then
added two lines to your Inertia entrypoint:

::: code-group

```js [Laravel]
// resources/js/app.tsx (or app.ts, app.js)
import { createInertiaApp } from '@inertiajs/react'
import { initInertiaNative } from 'inertia-native' // [!code ++]

initInertiaNative() // [!code ++]

createInertiaApp({
  // …
})
```

```js [Rails]
// app/javascript/entrypoints/inertia.tsx (or app/frontend/entrypoints/…)
import { createInertiaApp } from '@inertiajs/react'
import { initInertiaNative } from 'inertia-native' // [!code ++]

initInertiaNative() // [!code ++]

createInertiaApp({
  // …
})
```

:::

The call must come before `createInertiaApp`. In a regular browser it does
nothing, so your website keeps working as before. The
[installation page](/guide/installation) covers the options it takes.

If `init` can't find your entrypoint, or finds a file it can't safely change,
it prints these two lines for you to add yourself.

### The native projects

`init` created two native projects next to your app code:

- `ios/`: an Xcode project. Without the script, open `ios/App.xcodeproj` in
  Xcode, pick a simulator at the top of the window, and press **Run**.
- `android/`: a Gradle project. Without the script, open the `android/`
  directory in Android Studio, pick an emulator, and press **Run**. You also
  need to [forward your dev server's ports](/native/android#run-from-android-studio)
  once per emulator boot.

Both are small and readable. [iOS](/native/ios) and [Android](/native/android)
explain each file and how to change the name, bundle ID, and URL later.

### The scripts

`init` added two scripts to `package.json`, unless you already had scripts
with those names:

```json
{
  "scripts": {
    "ios": "inertia-native run ios",
    "android": "inertia-native run android"
  }
}
```

`run` warns you if your dev server doesn't answer, and tells you how to fix a
missing Xcode, Android SDK, or JDK. The native pages list its options.

## `init` options

Pass flags to skip the questions, for example in a script:

```bash
npx inertia-native init ios --name "Acme Shop" --bundle-id com.acme.shop --url http://localhost:8000
```

| Option | What it does |
| --- | --- |
| `ios`, `android`, `both` | Which native projects to create. Default: ask, or both. |
| `--name` | Name under the app icon. Default: your directory name, title-cased (`acme-shop` becomes `Acme Shop`). |
| `--bundle-id` | iOS bundle ID and Android application ID. Default: `com.example.` plus the name in lowercase letters and digits. |
| `--url` | URL the app loads. Default: `http://localhost:8000` if `artisan` exists, otherwise `http://localhost:3000`. |
| `--entrypoint` | Path to your Inertia entrypoint, if `init` picks the wrong file. |
| `--skip-install` | Don't add the npm package. |
| `--force` | Replace existing `ios/` and `android/` directories. This deletes changes you made in them. |
| `--yes` | Accept every default without asking. |

`init` only asks questions in an interactive terminal. Elsewhere it uses the
flags and defaults.

## Next steps

- [Feel native](/guide/feel-native): hide web-only parts, close modals after
  forms, and add native buttons.
- [How it works](/guide/how-it-works): what the native app does and what your
  web app does.
