# Navigation

Once [`initInertiaNative()`](/reference/api#initinertianative) is called, every
Inertia navigation is mapped onto the native navigation stack. You don't change
how you write Inertia links or visits — the shim translates them.

## What's handled

| Behavior | How it maps natively |
| --- | --- |
| Link tap (`<Link>` / `router.visit`) | Cancelled in the web view; the native side presents the destination (push / modal). |
| `replace: true` visits | Replaces the current native screen instead of pushing. |
| Back / restore | Restores the cached page from Inertia's history (no re-fetch); falls back to a fresh request if there's no cached entry. |
| Form submissions (non-GET) | Stay in the web view; the native side is notified via form-submission events. See [Form redirects](#form-redirects). |
| HTTP errors (404 / 500) & network failures | Surface the native error screen for the failed visit. |
| A non-Inertia page (e.g. a classic Turbo page) | Native reloads the screen, so the page loads as a full document. |
| Asset version mismatch (409) | Native reloads the screen. |
| `inertia_location` / `Inertia::location` | Handed to native, which decides where it opens — Safari, an in-app browser, a modal. |
| Pull-to-refresh | Treated as an in-place reload of the current URL. |

## Visits that stay on the page

Some visits update the current page rather than open a new one. These run in
the web view as usual and never reach native:

- partial reloads (`only`, `except`, `reset`) — including `router.reload`,
  `usePoll`, `<WhenVisible>`, `<InfiniteScroll>` and deferred props
- `async` visits, and visits with `preserveState: true` or `preserveUrl`
- visits to the current URL

Prefetches (`<Link prefetch>`, `router.prefetch`) are cancelled: the next
screen may load in another web view, so the prefetched response would be
wasted. Hotwire Native's own `turbo.js` disables prefetching for the same
reason.

## Modals

A visit presented as a modal is driven by your native path configuration
(Hotwire Native's `path-configuration` JSON), not by the package — the package
just proposes the visit and reports its lifecycle. See the native setup guides.

## Form redirects

By default a form's result stays in the web view the form was in, so a form in
a modal shows its result inside the modal. Pass `proposeFormRedirects: true` to
propose the page a form lands on to native instead, as Turbo does — your path
configuration then decides, e.g. dismissing the modal to show the result in the
main stack:

```js
initInertiaNative({ proposeFormRedirects: true })
```

A form that lands back on its own URL — validation errors — is not proposed.

## Historical locations

To dismiss a modal or pop a screen after a form, answer the form with one of
Hotwire Native's historical locations: `/recede_historical_location` (pop),
`/refresh_historical_location` (refresh) or `/resume_historical_location`
(stay). Native handles these paths itself; no path configuration is needed.

A plain redirect does not work with Inertia: Inertia follows it inside its own
request and native never sees it. Answer with an Inertia location visit
instead, which this package hands to native.

With [turbo-rails](https://github.com/hotwired/turbo-rails), its
`recede_or_redirect_to`, `refresh_or_redirect_to`, `resume_or_redirect_to` and
`*_or_redirect_back_or_to` helpers all go through one private method. Override
it in your `ApplicationController` to answer Inertia requests from the native
app with a location visit:

```ruby
private

def turbo_native_action_or_redirect(url, action, redirect_type, options = {})
  if turbo_native_app? && request.inertia?
    native_params = options.delete(:native_params) || {}
    inertia_location send("turbo_#{action}_historical_location_url", notice: options[:notice], **native_params)
  else
    super
  end
end
```

This overrides a private turbo-rails method, so check it when you upgrade
turbo-rails. Without turbo-rails, the demo app's
[`NativeSupport`](https://github.com/inertia-native/demo-rails/blob/main/app/controllers/concerns/native_support.rb)
concern has standalone versions of the three helpers.

These helpers are for form responses. A GET link that native opens as a new
screen would reload that screen rather than pop it.

## Debugging

Pass `debug: true` to `initInertiaNative()` to log the web ↔ native message flow
to the web view console. Attach Safari Web Inspector (iOS) or Chrome remote
inspect (Android) to read it. Messages are prefixed `[inertia-native]`.

```js
initInertiaNative({ debug: true })
```

Next: [Bridge components](/components/overview).
