# How it works

This page explains Hotwire Native for Inertia developers who haven't used it.
It covers what the native app does, what your web app does, and the two
Hotwire ideas you'll meet in the rest of these docs: path configuration and
bridge components.

## The mental model

Think of the native app as a picture frame and your web app as the picture.
The frame is a real iOS or Android app. It owns the parts around the page:
the navigation bar, the back button, modals, and error screens. Your server
still renders every page, the same way it does for a browser.

Each time you visit a new page, the frame opens a new native screen and shows
the page inside it. Going back closes that screen. That's why the app feels
native even though every page is your own Inertia page.

[Hotwire Native](https://native.hotwired.dev) is the open-source framework that
provides the frame. 37signals makes it. It replaced Turbo Native and Strada,
the two libraries 37signals built its own mobile apps on.

## What happens when you tap a link

Hotwire Native was built for Turbo, the page-navigation library that ships
with Rails. Each time the app loads one of your pages, it adds a small script
that expects to find Turbo there. `inertia-native` stands in for Turbo and
translates between that script and Inertia's router.

Here is a link tap, step by step:

```text
 You tap <Link href="/posts/1">
        │
        ▼
 inertia-native stops Inertia from changing the current page
 and asks the native app to visit /posts/1
        │
        ▼
 The app checks its path configuration:
 open /posts/1 as a new screen, or as a modal?
        │
        ▼
 The app opens a new native screen
 and loads /posts/1 into it
```

In a regular browser no native app is listening, so `inertia-native` does
nothing and Inertia navigates as usual. The same JavaScript bundle serves both.

[Navigation](/guide/navigation) lists every kind of visit and how it maps to
native screens.

## What the native app does and what your web app does

These docs call the native app the shell, because it holds your web app but
has little content of its own. Here is how the work splits between the two:

| The native shell | Your web app |
| --- | --- |
| Starts at your URL | Renders every page, as it does for a browser |
| Shows each page in a web view, the browser engine an app can embed | Decides what's on each page |
| Opens screens and modals, and draws the back button | Handles links, forms, validation, and sign-in |
| Shows the page's `<title>` in the navigation bar | Sets that title, for example with Inertia's `<Head>` |
| Shows native error screens and pull to refresh | Returns errors as usual |

Most changes you make happen on the web side and reach users when you deploy.
You only touch the shell for things like the app name, its icon, or a new
native component.

## Path configuration

Path configuration is a JSON file of rules that tells the shell how to open
each URL. Each rule has a list of URL patterns and the properties to apply
when a URL matches. These are the shared rules in the shells that `init`
creates:

```json
{
  "settings": {},
  "rules": [
    {
      "patterns": ["/new$", "/edit$"],
      "properties": {
        "context": "modal",
        "pull_to_refresh_enabled": false
      }
    },
    {
      "patterns": ["^/$"],
      "properties": {
        "presentation": "clear_all"
      }
    }
  ]
}
```

Read it like this. A URL ending in `/new` or `/edit` opens as a modal, with
pull to refresh turned off. The home page `/` clears the navigation history,
so going home doesn't stack one more screen on top. The patterns are regular
expressions matched against the URL's path. When several rules match, the app
combines their properties, and a later rule wins over an earlier one.

The Android file starts with one more rule. It tells Android which kind of
native screen shows web pages. You don't need to change it.

### Where it lives

The shell reads path configuration from two places:

- **A file bundled in the app.** It's `ios/App/path-configuration.json` and
  `android/app/src/main/assets/json/path-configuration.json`. The app uses
  this file from the first launch.
- **A copy on your server, if you serve one.** When the app starts, it
  downloads `/inertia-native/path-configuration/ios_v1.json` or
  `/inertia-native/path-configuration/android_v1.json` from your app's URL.
  If the download works, its rules replace the bundled ones, and the app keeps
  a copy for the next launch. If your server doesn't have that route, the app
  keeps using the bundled file.

Serving the file lets you change navigation by deploying your web app, without
shipping an app update. [iOS](/native/ios#path-configuration) and
[Android](/native/android#path-configuration) show a Laravel and a Rails route
that serve it.

## Bridge components

A bridge component lets a web page ask the shell for a piece of native UI, such
as a button in the navigation bar, and hear back when someone uses it. Each
component has a web half in your JavaScript and a native half in the shell,
and when the native half is missing the web half renders your normal web
markup instead.

[Bridge components](/components/overview) covers how to use them, and the
shells from `init` already include the native halves of the ready-made ones.

## Next steps

- [Feel native](/guide/feel-native): hide web-only parts and close modals
  after forms.
- [Navigation](/guide/navigation): every kind of Inertia visit and how it maps
  to native screens.
