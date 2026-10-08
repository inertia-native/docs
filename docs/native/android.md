# Android

`npx inertia-native init` creates an `android/` directory with a small Hotwire
Native Android app. This page explains its files, how to run it on an emulator
and on your phone, and how to change it later. If you haven't run `init` yet,
start with the [quick start](/guide/quick-start).

## Requirements

You need Android Studio to build and run the app:

- Android Studio with at least one emulator. Create one in its **Device
  Manager**. Android Studio also installs the Android SDK and comes with a JDK.
- The app runs on Android 9 (API level 28) and later.
- Hotwire Native Android 1.3.1. Gradle downloads it on the first build.

<!-- TODO: confirm the minimum Android Studio version for AGP 9.2.1 / Gradle 9.4.1 -->

## What `init` creates

The project is plain Kotlin with no generated code, so you can read and change
every file:

```text
android/
├── app/
│   ├── build.gradle.kts            app ID, the URL the app loads, SDK versions
│   └── src/
│       ├── main/
│       │   ├── AndroidManifest.xml
│       │   ├── assets/json/
│       │   │   └── path-configuration.json   bundled navigation rules
│       │   ├── kotlin/dev/inertianative/app/
│       │   │   ├── MainApplication.kt  Hotwire Native setup: path
│       │   │   │                       configuration, bridge components
│       │   │   ├── MainActivity.kt     opens your URL on launch
│       │   │   ├── WebFragment.kt      the screen that shows a web page
│       │   │   ├── Urls.kt             the URL, adjusted for the emulator
│       │   │   └── bridge/             native halves of the alert, button,
│       │   │                           form, menu, and overflow-menu components
│       │   └── res/values/strings.xml  app name
│       └── debug/res/xml/
│           └── network_security_config.xml   plain HTTP to your computer,
│                                             debug builds only
├── gradle/libs.versions.toml       dependency versions, including Hotwire Native
└── gradlew                         Gradle wrapper
```

The Kotlin package stays `dev.inertianative.app` in every app. Your app's
identity is its application ID, which `init` sets from your bundle ID. You
don't need to rename the package.

`WebFragment.kt` adds a spinner to the toolbar while a form submits.

## Run on the emulator

Run this from your app's root, with your dev server running:

```bash
npm run android
```

It builds and installs a debug build with Gradle, starts your first emulator
if none is running, waits for it to boot, and launches your app. It warns you
if your dev server doesn't answer.

To pick an emulator, pass its name after `--`:

```bash
npm run android -- --avd Pixel_9
```

`emulator -list-avds` prints the names you can use. The `emulator` tool is in
the Android SDK's `emulator` directory.

You can also run from Android Studio. Open the `android/` directory, wait for
Gradle to finish syncing, choose an emulator in the toolbar, and press
**Run**.

### How the emulator reaches your computer

Inside the emulator, `localhost` is the emulator itself. Your computer is
`10.0.2.2`. In debug builds, `Urls.kt` rewrites a `localhost` or `127.0.0.1`
URL to `10.0.2.2`, so `http://localhost:8000` works without changes.

Android blocks plain HTTP by default. In debug builds,
`network_security_config.xml` allows it for `10.0.2.2`, `localhost`, and
`127.0.0.1` only. Release builds keep Android's default and need HTTPS.

### Blank screen on the emulator

If the app opens but the page stays blank or unstyled, the page's scripts and
styles probably didn't load. The app rewrites your URL, but it can't rewrite
the addresses inside your page. A layout that loads scripts from the Vite dev
server at a `localhost` address points the emulator at itself. Laravel works
this way: its pages load scripts from the address in `public/hot`, such as
`http://[::1]:5173`.

To check, open `chrome://inspect` in Chrome on your computer, find the app's
web view, and look for failed script requests. Debug builds make the web view
inspectable.

The reliable fix is to run your app without the Vite dev server, so the
scripts come from your app's own address:

::: code-group

```bash [Laravel]
npm run build
php artisan serve
```

```bash [Rails]
# Rails builds the assets when the Vite dev server isn't running.
bin/rails server
```

:::

You lose hot reload while you test this way. Run `npm run dev` again when you
go back to the browser.

<!-- TODO: verify the Laravel + emulator + Vite dev server case end to end, and document a setup that keeps hot reload (for example `adb reverse tcp:5173 tcp:5173`, which only helps if the hot file uses localhost or 127.0.0.1, not [::1]) -->

## Run on your phone

Connect your phone over USB, then make it reach your computer either over
Wi-Fi or through the USB cable. Start by turning on USB debugging:

1. On the phone, open **Settings** > **About phone** and tap **Build number**
   seven times. This turns on **Developer options**.
2. In **Developer options**, turn on **USB debugging**.
3. Connect the phone with a cable and accept the prompt on the phone.

With the phone connected, `npm run android` installs the app on it instead of
starting an emulator. You can also choose the phone in Android Studio's
toolbar and press **Run**.

On the phone, `localhost` means the phone itself, and the `10.0.2.2` rewrite
only works on the emulator. Pick one of the two options below.

### Option 1: over Wi-Fi

Use your computer's address on your Wi-Fi network, for example
`192.168.1.20`. On a Mac, run `ipconfig getifaddr en0` to find it.

1. Set the URL in `android/app/build.gradle.kts`:

   ```kotlin
   buildConfigField("String", "BASE_URL", "\"http://192.168.1.20:8000\"")
   ```

2. Allow plain HTTP to that address in
   `android/app/src/debug/res/xml/network_security_config.xml`. Without this
   line, Android blocks the request:

   ```xml
   <domain includeSubdomains="false">192.168.1.20</domain>
   ```

3. Start your server so it accepts connections from the network. The same
   Vite caveat applies as on the emulator, so run it without the Vite dev
   server:

   ::: code-group

   ```bash [Laravel]
   npm run build
   php artisan serve --host=0.0.0.0
   ```

   ```bash [Rails]
   bin/rails server -b 0.0.0.0
   ```

   :::

### Option 2: through the USB cable

`adb reverse` forwards a port on the phone to the same port on your computer.
`adb` comes with the Android SDK, in its `platform-tools` directory. Use the
port your dev server listens on:

```bash
adb reverse tcp:8000 tcp:8000
```

Now `localhost:8000` on the phone reaches your computer. Keep the `localhost`
URL, but turn off the emulator rewrite in
`android/app/src/main/kotlin/dev/inertianative/app/Urls.kt`:

```kotlin
val base: String = BuildConfig.BASE_URL
```

The forward lasts until you unplug the phone, so run `adb reverse` again after
you reconnect. The Vite caveat applies here too: if your page loads scripts
from the Vite dev server, build the assets and run your app without it.

## Change the name, bundle ID, or URL

`init` wrote your answers into a few places. Change them there:

| What | Where |
| --- | --- |
| Name under the icon | `app_name` in `android/app/src/main/res/values/strings.xml` |
| Application ID (bundle ID) | `applicationId` in `android/app/build.gradle.kts` |
| URL the app loads | `BASE_URL` in `android/app/build.gradle.kts` |

`init` also put the name in `android/settings.gradle.kts`. That's only the
Gradle project's name, and users don't see it.

Before you ship, point release builds at your production site. Set the URL per
build type in `android/app/build.gradle.kts`. A value in a build type wins over
the one in `defaultConfig`:

```kotlin
buildTypes {
    debug {
        buildConfigField("String", "BASE_URL", "\"http://localhost:8000\"")
    }
    release {
        buildConfigField("String", "BASE_URL", "\"https://acme.example\"")
        // keep the existing release settings
    }
}
```

You can also run `npx inertia-native init android --force` with new values. It
recreates `android/` from scratch, so it deletes any changes you made there.

## Path configuration

Path configuration is the set of rules that decides how each URL opens, for
example as a modal. [How it works](/guide/how-it-works#path-configuration)
explains the format.

The app reads it from two places:

1. `android/app/src/main/assets/json/path-configuration.json`, bundled in the
   app.
2. `/inertia-native/path-configuration/android_v1.json` on your server, if you
   serve it.

When the app starts, it applies the copy it saved from your server last time,
or the bundled file if it has no saved copy. Then it downloads a fresh copy. A
downloaded copy replaces the bundled rules completely. If the download fails,
for example with a 404, the app keeps what it has.

The Android file starts with a rule for every URL (`.*`). It tells the app to
show web pages in `WebFragment`, with pull to refresh turned on. Keep that rule
first.

### Serve it from your app

Serving the file lets you change navigation with a deploy instead of an app
update. Add a route that returns the same JSON as the bundled file:

::: code-group

```php [Laravel]
// routes/web.php
Route::get('/inertia-native/path-configuration/android_v1.json', fn () => [
    'rules' => [
        [
            'patterns' => ['.*'],
            'properties' => [
                'context' => 'default',
                'uri' => 'hotwire://fragment/web',
                'fallback_uri' => 'hotwire://fragment/web',
                'pull_to_refresh_enabled' => true,
            ],
        ],
        [
            'patterns' => ['/new$', '/edit$'],
            'properties' => ['context' => 'modal', 'pull_to_refresh_enabled' => false],
        ],
        [
            'patterns' => ['^/$'],
            'properties' => ['presentation' => 'clear_all'],
        ],
    ],
]);
```

```ruby [Rails]
# config/routes.rb
get "inertia-native/path-configuration/android_v1", to: "path_configurations#android"

# app/controllers/path_configurations_controller.rb
# ActionController::Base skips your app-wide filters, such as sign-in checks.
class PathConfigurationsController < ActionController::Base
  def android
    render json: {
      settings: {},
      rules: [
        {
          patterns: [".*"],
          properties: {
            context: "default",
            uri: "hotwire://fragment/web",
            fallback_uri: "hotwire://fragment/web",
            pull_to_refresh_enabled: true
          }
        },
        { patterns: ["/new$", "/edit$"], properties: { context: "modal", pull_to_refresh_enabled: false } },
        { patterns: ["^/$"], properties: { presentation: "clear_all" } }
      ]
    }
  end
end
```

:::

If you also serve the iOS file, add this action to the same controller. The
[iOS page](/native/ios#serve-it-from-your-app) has the other half.

Keep these points in mind:

- **Include every rule.** The server copy replaces the bundled file, so start
  from a copy of it.
- **Keep the route public.** The app downloads the file on launch, before
  anyone signs in.
- **Leave out `settings` in PHP.** PHP turns an empty array into `[]` instead
  of `{}`, and Android can't read `[]` there. The key is optional, so skip it
  unless you have settings to send.
- **Relaunch to see changes.** The app downloads the file when it starts.

## Bridge components

The native halves of bridge components live in
`android/app/src/main/kotlin/dev/inertianative/app/bridge/`, and
`MainApplication.kt` registers them at launch:

```kotlin
Hotwire.registerBridgeComponents(
    BridgeComponentFactory("alert", ::AlertComponent),
    BridgeComponentFactory("button", ::ButtonComponent),
    BridgeComponentFactory("form", ::FormComponent),
    BridgeComponentFactory("menu", ::MenuComponent),
    BridgeComponentFactory("overflow-menu", ::OverflowMenuComponent)
)
```

To add a component, put its Kotlin file in the `bridge/` directory and add it
to this list. Set the file's first line to
`package dev.inertianative.app.bridge`. If it uses resources, import
`dev.inertianative.app.R`. Components from the
[registry](https://github.com/inertia-native/bridge-components) mark both
lines for you to replace. See [Bridge components](/components/overview) for
the web side.

## Debugging

Debug builds make the web view inspectable. Open `chrome://inspect` in Chrome
on your computer and pick the app's web view. Hotwire Native's own logs show up
in Android Studio's **Logcat** in debug builds.

To log the messages between your page and the app, turn on `debug` in your
entrypoint. See [Debugging](/guide/navigation#debugging).
