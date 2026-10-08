# iOS

`npx inertia-native init` creates an `ios/` directory with a small Hotwire
Native iOS app. This page explains its files, how to run it on a simulator and
on your iPhone, and how to change it later. If you haven't run `init` yet,
start with the [quick start](/guide/quick-start).

## Requirements

You need a Mac with Xcode to build the app:

- Xcode 16 or later.
- The app runs on iOS 17 and later.
- Hotwire Native iOS 1.3.1. Xcode downloads it with Swift Package Manager on
  the first build.

## What `init` creates

The project is plain Swift with no generated code, so you can read and change
every file:

```text
ios/
├── App.xcodeproj               Xcode project: target "App", scheme "App"
└── App/
    ├── AppConfig.swift         the URL the app loads
    ├── AppDelegate.swift       Hotwire Native setup: path configuration,
    │                           bridge components, options
    ├── SceneDelegate.swift     opens your URL on launch, handles failed pages
    ├── path-configuration.json bundled navigation rules
    ├── Bridge/                 native halves of the alert, button, form,
    │                           menu, and overflow-menu components
    ├── Assets.xcassets         app icon and accent color
    └── Info.plist              allows plain HTTP to local network addresses
```

`AppDelegate.swift` also sets two options: the back button shows only an
arrow, and every modal gets a **Done** button.

## Run on the simulator

Run this from your app's root, with your dev server running:

```bash
npm run ios
```

It builds the app into `ios/build`, picks the simulator that's already
running or the newest iPhone, opens the Simulator app, then installs and
launches your app. It warns you if your dev server doesn't answer.

To pick a simulator, pass its name after `--`:

```bash
npm run ios -- --device "iPhone 16 Pro"
```

`xcrun simctl list devices available` lists the names you can use.

You can also run from Xcode. Open `ios/App.xcodeproj`, choose a simulator in
the run destination menu at the top of the window, and press **Run** (⌘R).

The simulator shares your Mac's network, so `http://localhost:8000` or
`http://localhost:3000` reaches your dev server without changes.

## Run on your iPhone

`npm run ios` only targets simulators, so use Xcode for a real device. Follow
these steps:

1. Connect your iPhone to your Mac with a cable.
2. Open `ios/App.xcodeproj` in Xcode.
3. Select the **App** target, open **Signing & Capabilities**, and choose your
   **Team**. The project ships without a team, so Xcode can't sign the app
   until you pick one. If Xcode says the bundle ID isn't available, change it
   to one that's yours, like `com.yourname.acmeshop`.
4. On the iPhone, turn on **Developer Mode** in **Settings** > **Privacy &
   Security**.
5. Point the app at your Mac and start your server for the network, as
   described below.
6. Choose your iPhone in the run destination menu and press **Run**.

On the phone, `localhost` means the phone itself. Use your Mac's address on
your Wi-Fi network instead, for example `http://192.168.1.20:8000`. Find it in
**System Settings** > **Wi-Fi** > **Details**, or run
`ipconfig getifaddr en0`. Put it in `ios/App/AppConfig.swift`:

```swift
static let baseURL = URL(string: "http://192.168.1.20:8000")!
```

The app's `Info.plist` sets `NSAllowsLocalNetworking`, which lets iOS load
plain HTTP from local network addresses like this one.

Your server must accept connections from the network, and the page's scripts
must come from an address the phone can reach. A setup that loads scripts from
the Vite dev server at `localhost` leaves the page blank on the phone, and
Laravel works that way. The reliable option is to run your app without the
Vite dev server:

::: code-group

```bash [Laravel]
npm run build
php artisan serve --host=0.0.0.0
```

```bash [Rails]
# Rails builds the assets when the Vite dev server isn't running.
bin/rails server -b 0.0.0.0
```

:::

<!-- TODO: document a Vite dev server setup that keeps hot reload on a real device (server.host + server.hmr.host, Vite CORS) after testing it -->
<!-- TODO: confirm whether iOS asks for Local Network permission when the app loads a LAN dev server -->

## Change the name, bundle ID, or URL

`init` wrote your answers into a few places. Change them there:

| What | Where |
| --- | --- |
| Name under the icon | Xcode: **App** target > **General** > **Display Name** |
| Bundle ID | Xcode: **App** target > **General** > **Bundle Identifier** |
| URL the app loads | `baseURL` in `ios/App/AppConfig.swift` |

Xcode saves the name and bundle ID in `ios/App.xcodeproj/project.pbxproj`. The
project, target, and scheme stay named `App`.

Before you ship, point release builds at your production site. Debug builds
can keep your dev server:

```swift
// ios/App/AppConfig.swift
#if DEBUG
static let baseURL = URL(string: "http://localhost:8000")!
#else
static let baseURL = URL(string: "https://acme.example")!
#endif
```

You can also run `npx inertia-native init ios --force` with new values. It
recreates `ios/` from scratch, so it deletes any changes you made there.

## Path configuration

Path configuration is the set of rules that decides how each URL opens, for
example as a modal. [How it works](/guide/how-it-works#path-configuration)
explains the format.

The app reads it from two places:

1. `ios/App/path-configuration.json`, bundled in the app.
2. `/inertia-native/path-configuration/ios_v1.json` on your server, if you
   serve it.

When the app starts, it applies the bundled file, then the copy it saved from
your server last time, then downloads a fresh copy. A downloaded copy replaces
the bundled rules completely. If the download fails, for example with a 404,
the app keeps what it has.

### Serve it from your app

Serving the file lets you change navigation with a deploy instead of an app
update. Add a route that returns the same JSON as the bundled file:

::: code-group

```php [Laravel]
// routes/web.php
Route::get('/inertia-native/path-configuration/ios_v1.json', fn () => [
    'rules' => [
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
get "inertia-native/path-configuration/ios_v1", to: "path_configurations#ios"

# app/controllers/path_configurations_controller.rb
# ActionController::Base skips your app-wide filters, such as sign-in checks.
class PathConfigurationsController < ActionController::Base
  def ios
    render json: {
      settings: {},
      rules: [
        { patterns: ["/new$", "/edit$"], properties: { context: "modal", pull_to_refresh_enabled: false } },
        { patterns: ["^/$"], properties: { presentation: "clear_all" } }
      ]
    }
  end
end
```

:::

Keep these points in mind:

- **Include every rule.** The server copy replaces the bundled file, so start
  from a copy of it.
- **Keep the route public.** The app downloads the file on launch, before
  anyone signs in.
- **Leave out `settings` in PHP.** PHP turns an empty array into `[]` instead
  of `{}`. The key is optional, so skip it unless you have settings to send.
- **Relaunch to see changes.** The app downloads the file when it starts.

## Bridge components

The native halves of bridge components live in `ios/App/Bridge/`, and
`AppDelegate.swift` registers them at launch:

```swift
Hotwire.registerBridgeComponents([
    AlertComponent.self,
    ButtonComponent.self,
    FormComponent.self,
    MenuComponent.self,
    OverflowMenuComponent.self,
])
```

To add a component, put its Swift file in `ios/App/Bridge/` and add it to this
list. Xcode picks up new files in the `App` folder without extra steps. See
[Bridge components](/components/overview) for the web side.

## Debugging

Debug builds make the web view inspectable. Open Safari on your Mac, turn on
**Show features for web developers** in **Settings** > **Advanced**, then pick
the simulator or iPhone from the **Develop** menu. Hotwire Native's own logs
show up in Xcode's console in debug builds.

To log the messages between your page and the app, turn on `debug` in your
entrypoint. See [Debugging](/guide/navigation#debugging).

## Handle failed pages

When a page fails to load, `SceneDelegate.swift` shows Hotwire Native's error
screen with a **Retry** button. To handle a case yourself, such as sending a
401 to your sign-in page, edit `visitableDidFailRequest` there.
