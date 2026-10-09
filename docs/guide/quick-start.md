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

## 1. Run `init`

Run this in your app's root, the directory with `package.json`:

```bash
npx inertia-native init
```

It asks a few questions. Press Enter to accept each default:

- **Platforms**: iOS, Android, or both.
- **App name**: the name under the app icon. The default comes from your
  directory name.
- **Bundle ID**: the app's unique ID, written like a reversed domain name
  (`com.acme.shop`). The App Store and Google Play use it to tell apps apart.
  The default `com.example.…` is fine for trying things out.
- **Dev server URL**: the address the app loads. Use the same URL you open in
  your browser during development.
- **Vite host**, if you build for Android: whether `init` may change one line
  of your Vite config so that Android can load your scripts.
  [Step 2](#_2-start-your-dev-server) explains why.

Then it changes your project. The output looks like this, with the defaults
accepted:

::: code-group

```text [Laravel]
$ npx inertia-native init
? Platforms [both/ios/android] (both) ›
✓ Found entrypoint resources/js/app.tsx
? App name (Acme Shop) ›
? Bundle ID (com.example.acmeshop) ›
? Dev server URL (http://localhost:8000) ›
? Set server.host to 127.0.0.1 in vite.config.ts, so Android can load scripts from Vite? (Y/n) ›
› npm install inertia-native
✓ Added inertia-native to package.json (npm)
✓ Patched resources/js/app.tsx
✓ Set server.host to 127.0.0.1 in vite.config.ts
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
? Set server.host to 127.0.0.1 in vite.config.ts, so Android can load scripts from Vite? (Y/n) ›
› npm install inertia-native
✓ Added inertia-native to package.json (npm)
✓ Patched app/javascript/entrypoints/inertia.tsx
✓ Set server.host to 127.0.0.1 in vite.config.ts
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

If you build for Android, `init` asked to change one line of your Vite config.
The Laravel and Rails starter kits serve scripts from `http://[::1]:5173`, an
IPv6 address that Android can't reach. The change makes Vite listen on
`127.0.0.1` instead:

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

If you answered no, or `init` couldn't change your config safely, make the
change by hand. `init` printed the line to add, and `npm run android` checks
for it and prints the line again if it's missing. iOS works either way.

Rails apps on `vite_rails` (the ones with `config/vite.json`) don't need this
change, so `init` doesn't ask. Rails serves their scripts from its own
address.

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

`npm run ios` builds the app, installs it on the simulator that's running, and
opens it. `npm run android` does the same on the emulator or phone that's
connected. On Android it also runs `adb reverse` for your dev server's ports,
so `localhost` on the device reaches your computer. The first build downloads
Hotwire Native and the other dependencies, so it takes longer than the ones
after it.

If nothing is running, `npm run ios` asks which iPhone simulator to start and
selects the newest one. `npm run android` starts your emulator, or asks which
one when you have several. If more than one simulator or device is running,
it asks which one to use. To see them all, add `--list`:

```bash
npm run ios -- --list
npm run android -- --list
```

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

`init` made up to five changes. You can make them by hand instead if you
prefer to see each step.

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

### The Vite host

If you build for Android and answered yes, `init` set `server.host` to
`127.0.0.1` in your Vite config, as shown in
[step 2](#_2-start-your-dev-server). It adds the line to your `server` options,
or adds `server` if your config doesn't have it, and keeps your quotes and
indentation.

`init` leaves the file alone when it already sets `server.host`, or when it
can't tell where the line goes, for example when `defineConfig` gets a function
with a body. Then it prints the line for you to add.

### The native projects

`init` created two native projects next to your app code:

- `ios/`: an Xcode project. To run it from Xcode instead of the script, run
  `npx inertia-native open ios`, pick a simulator at the top of the window,
  and press **Run**.
- `android/`: a Gradle project. To run it from Android Studio instead of the
  script, run `npx inertia-native open android`, pick an emulator, and press
  **Run**. You also need to
  [forward your dev server's ports](/native/android#run-from-android-studio)
  once per emulator boot. `open android` prints the commands for it.

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
| `--yes` | Accept every default without asking, including the Vite host change for Android. |

`init` only asks questions in an interactive terminal. Elsewhere it uses the
flags and defaults.

## Next steps

- [Feel native](/guide/feel-native): hide web-only parts, close modals after
  forms, and add native buttons.
- [How it works](/guide/how-it-works): what the native app does and what your
  web app does.
