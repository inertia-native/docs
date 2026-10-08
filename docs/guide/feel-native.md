# Feel native

After the [quick start](/guide/quick-start), your app runs in a native shell
but still looks like a website in places. This page covers the changes that
make the biggest difference: hiding web-only parts, closing a modal after a
form, and adding a native button.

## Tell the app apart from a browser

Hotwire Native adds its name to the web view's user agent on both platforms.
iOS requests contain `Hotwire Native iOS;` and Android requests contain
`Hotwire Native Android;`. Check for `Hotwire Native` and you cover both.

Your server sees the user agent on every request, including Inertia's own
requests. The simplest setup checks it there and shares the result with every
page as an Inertia prop:

::: code-group

```php [Laravel]
// app/Http/Middleware/HandleInertiaRequests.php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'nativeApp' => str_contains($request->userAgent() ?? '', 'Hotwire Native'),
    ];
}
```

```ruby [Rails]
# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  inertia_share do
    { nativeApp: native_app? }
  end

  private

  def native_app?
    request.user_agent.to_s.include?("Hotwire Native")
  end
end
```

:::

In JavaScript that runs outside a component, read the user agent directly:

```js
const isNativeApp =
  typeof navigator !== 'undefined' && navigator.userAgent.includes('Hotwire Native')
```

The `typeof` check keeps the line safe during server-side rendering, where
`navigator` may not exist.

::: warning Don't check `window.webkit`
`window.webkit.messageHandlers` comes from WKWebView, the web view on iOS.
Android's web view doesn't have it, so a check like
`window.webkit?.messageHandlers?.turbo` is false on Android. Use the user
agent instead.
:::

## Hide web-only parts

In the app, the shell already shows a navigation bar with the page title and a
back button. Your site's own header, back links, and footer now repeat it.
Hide them when `nativeApp` is true:

::: code-group

```jsx [React]
import { usePage } from '@inertiajs/react'

export default function Layout({ children }) {
  const { nativeApp } = usePage().props

  return (
    <>
      {!nativeApp && <SiteHeader />}
      <main>{children}</main>
      {!nativeApp && <SiteFooter />}
    </>
  )
}
```

```vue [Vue]
<script setup>
import { usePage } from '@inertiajs/vue3'

const page = usePage()
</script>

<template>
  <SiteHeader v-if="!page.props.nativeApp" />
  <main><slot /></main>
  <SiteFooter v-if="!page.props.nativeApp" />
</template>
```

```svelte [Svelte]
<script>
  import { page } from '@inertiajs/svelte'

  let { children } = $props()
</script>

{#if !page.props.nativeApp}
  <SiteHeader />
{/if}
<main>{@render children()}</main>
{#if !page.props.nativeApp}
  <SiteFooter />
{/if}
```

:::

The server sends the prop with the page, so the header doesn't flash on screen
while the page loads.

### Page titles

The native navigation bar shows the page's `<title>`, the same one you set with
Inertia's `<Head>`. If your `createInertiaApp` adds your app's name to every
title, the bar shows `Posts - Acme Shop` on every screen. Drop the suffix in
the app:

```js
createInertiaApp({
  title: (title) => (isNativeApp ? title : `${title} - Acme Shop`),
  // …
})
```

## Close a modal after a form

In the shells from `init`, a page whose URL ends in `/new` or `/edit` opens as
a modal. After the form saves, you want the modal to close and show the screen
underneath. A redirect can't do this: Inertia follows a redirect inside its own
request, so the shell never sees it.

Instead, answer the form with a historical location. Hotwire Native reserves
three paths for this, and the shell handles them itself. Your server doesn't
need routes for them. `/recede_historical_location` closes the modal, or goes
back one screen when there's no modal.

Send it as an Inertia location visit, and only to the app. Browsers get your
usual redirect:

::: code-group

```php [Laravel]
// app/Http/Controllers/PostController.php
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

public function store(Request $request)
{
    Post::create($request->validate([
        'title' => ['required', 'string', 'max:255'],
    ]));

    if (str_contains($request->userAgent() ?? '', 'Hotwire Native')) {
        return Inertia::location('/recede_historical_location');
    }

    return redirect()->route('posts.index');
}
```

```ruby [Rails]
# app/controllers/posts_controller.rb
def create
  @post = Post.new(post_params)

  if @post.save
    return inertia_location("/recede_historical_location") if native_app?

    redirect_to posts_path
  else
    redirect_to new_post_path, inertia: { errors: @post.errors }
  end
end
```

:::

`inertia-native` hands the location visit to the shell, and the shell closes
the modal. Validation errors still go back to the form, so they show up inside
the modal as usual.

To close the modal and also reload the screen under it, so a list shows the
new post, answer with `/refresh_historical_location` instead.
[Historical locations](/guide/navigation#historical-locations) lists all three
paths and has a ready-made Rails helper.

<!-- TODO: confirm on Android that recede from a modal pops only the modal when the screen under it isn't the first one. NavigatorRule routes the modal result's POP again in the main stack (hotwire-native-android 1.3.1, NavigatorRule.kt newPresentation). -->

## Add a native button

A native button sits in the navigation bar, next to the title, where native
apps put actions like **Save** or **Edit**. The [Button](/components/button)
component adds one from your page and calls your code when someone taps it. In
a browser it renders your normal button instead.

The shells from `init` already include the native half of this component, and
of the [Alert](/components/alert) component. You only copy the web half into
your app.

## Next steps

- [Navigation](/guide/navigation): how every kind of Inertia visit maps to
  native screens.
- [Bridge components](/components/overview): how to build your own native
  components.
