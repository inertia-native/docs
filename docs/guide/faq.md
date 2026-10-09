# FAQ

Answers to the questions people ask most before they try Inertia Native. Facts
about other projects come from their own sites and were checked in October
2026.

## How does it compare to other options?

Each of these tools gets an app into the App Store and Google Play. They differ
in where your screens come from and how much of your current app you reuse.
Inertia Native keeps your server and your Inertia pages as they are, loads them
in native screens, and works with any backend.

### Capacitor

[Capacitor](https://capacitorjs.com/docs) runs a web app inside a native
project, and plugins give your JavaScript access to native APIs. It bundles
your built web assets, starting from an `index.html`, into the app. Its
`server.url` option loads a remote site instead, but the
[config docs](https://capacitorjs.com/docs/config) say it's meant for live
reload and "not intended for use in production."

An Inertia app needs your server to answer every page visit, so it doesn't fit
the bundled model without changes. Inertia Native loads pages from your server,
and each visit opens a native screen.

### NativePHP Mobile

[NativePHP Mobile](https://nativephp.com/) runs your Laravel app on the phone
itself, with a PHP runtime embedded in the app, so the app needs no server.
Since version 4 it can turn Blade views into SwiftUI and Jetpack Compose views,
and it still supports showing HTML in a web view, which is where Inertia apps
run. Its core is free and MIT-licensed, and some plugins are paid.

Choose it when you want the app to work on the device without your server.
Inertia Native does the opposite: your Laravel app keeps running on your
server, and the phone shows its pages. Releasing a change means deploying your
server, not shipping a new app build.

### Ruby Native

[Ruby Native](https://rubynative.com/) is a paid service for Rails apps, built
on Hotwire Native. You add its gem and a configuration file, and its cloud
builds compile, sign, and submit the apps, so you don't need Xcode or Android
Studio. Its site says it works with any Rails frontend, Inertia included.
Plans start at $299 per app per year.

Inertia Native is free and open source, works with any backend, and gives you
the native projects as plain Xcode and Gradle code that you build yourself.

### React Native and Expo

[React Native](https://reactnative.dev/) renders React components to native
platform UI, and [Expo](https://docs.expo.dev/get-started/introduction/) is a
framework and set of tools around it. With either one you write a second app
with its own screens, which usually calls your backend through an API.

Pick React Native when most of your screens need to be fully native. Inertia
Native reuses the pages you already have, and you can still add native screens
and [bridge components](/components/overview) where they matter.

## Will Apple accept my app?

Apple reviews every app on its own, so nobody can promise approval. The
approach has a track record: 37signals builds its
[Basecamp](https://apps.apple.com/us/app/basecamp-project-management/id1015603248)
and [HEY](https://apps.apple.com/us/app/hey-email/id1506603805) apps on
[Turbo Native](https://dev.37signals.com/speeding-up-mobile-development-with-turbo/)
and [Strada](https://dev.37signals.com/announcing-strada/), the two libraries
that [became Hotwire Native](https://dev.37signals.com/announcing-hotwire-native/).
Both apps are in the App Store and Google Play.

The guideline to read is
[4.2 Minimum Functionality](https://developer.apple.com/app-store/review/guidelines/#minimum-functionality):
"Your app should include features, content, and UI that elevate it beyond a
repackaged website." Native navigation helps. So do hiding your site's own
navigation in the app (see [Feel native](/guide/feel-native)) and adding
native features where your users benefit from them.

## Does server-side rendering work?

Yes, with a guard. `initInertiaNative()` uses `window`, so if your entrypoint
also runs on the server, call it only in the browser:

```js
if (typeof window !== 'undefined') initInertiaNative()
```

Bridge components don't render on the server yet. `useBridgeComponent` reads
`window` while a component renders, in all three framework bindings, so a page
that uses a bridge component fails to render on the server.

## Which Inertia versions does it support?

Inertia Native needs Inertia 3 (`@inertiajs/core` 3.0 or later) with React,
Vue, or Svelte. Version 1.0 dropped support for Inertia 2. See
[Manual installation](/guide/installation#requirements) for the full list.

## Does it work offline? Does it support push notifications?

Neither is built in yet. The app loads every page from your server, so it
needs a network connection. The shells from `init` don't include push
notifications. Both are native features that you can add to the projects in
`ios/` and `android/` yourself.

## Do I need to know Swift or Kotlin?

Not to get started. `init` creates both native projects, and
`npm run ios` and `npm run android` build and run them. You open the native
code to change the app's name, icon, or URL, or to add a native component. The
[iOS](/native/ios) and [Android](/native/android) pages show where each of
those lives.
