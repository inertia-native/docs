# Feel native

After the [quick start](/guide/quick-start), your app runs in a native shell
but still looks like a website in places. This page covers the changes that
make the biggest difference: hiding web-only parts, closing the sidebar,
starting fresh after logging in, closing a modal after a form, and adding a
native button.

The examples use the Laravel and Rails React starter kits, and the tabs show
where the two differ.

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

In JavaScript that runs outside a component, read the user agent directly.
Put the check in a module, so you can import it wherever you need it:

::: code-group

```ts [Laravel]
// resources/js/lib/native.ts
export const isNativeApp =
    typeof navigator !== 'undefined' &&
    navigator.userAgent.includes('Hotwire Native');
```

```ts [Rails]
// app/javascript/lib/native.ts
export const isNativeApp =
  typeof navigator !== "undefined" &&
  navigator.userAgent.includes("Hotwire Native")
```

:::

The `typeof` check keeps the line safe during server-side rendering, where
`navigator` may not exist.

For CSS, add a class to the `<html>` element. Do it in an inline script in
your root template's `<head>`, so the class is there before the page first
appears:

::: code-group

```blade [Laravel]
{{-- resources/views/app.blade.php, inside <head> --}}
<script>
    if (navigator.userAgent.includes('Hotwire Native')) {
        document.documentElement.classList.add('native-app');
    }
</script>
```

```erb [Rails]
<%# app/views/layouts/application.html.erb, inside <head> %>
<script>
  if (navigator.userAgent.includes("Hotwire Native")) {
    document.documentElement.classList.add("native-app")
  }
</script>
```

:::

A selector that starts with `.native-app` now matches only in the app. React
doesn't render `<html>`, so the class is safe with server-side rendering too.

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
Inertia's `<Head>`. The starter kits add two things around it. Their
`createInertiaApp` adds the app's name to every title, so the bar reads
`Dashboard - Laravel`. And the header at the top of the page shows the title
again as breadcrumbs.

Drop the app's name in the app:

::: code-group

```tsx [Laravel]
// resources/js/app.tsx
import { isNativeApp } from '@/lib/native';

createInertiaApp({
    title: (title) =>
        title ? (isNativeApp ? title : `${title} - ${appName}`) : appName,
    // …
});
```

```tsx [Rails]
// app/javascript/entrypoints/inertia.tsx
import { isNativeApp } from "@/lib/native"

createInertiaApp({
  title: (title) =>
    title ? (isNativeApp ? title : `${title} - ${appName}`) : appName,
  // …
})
```

:::

Then hide the breadcrumbs with the `native-app` class. The kits build them
with shadcn/ui's `Breadcrumb`, which marks itself with
`data-slot="breadcrumb"`:

::: code-group

```css [Laravel]
/* resources/css/app.css */
.native-app [data-slot='breadcrumb'] {
    display: none;
}
```

```css [Rails]
/* app/javascript/entrypoints/application.css */
.native-app [data-slot="breadcrumb"] {
  display: none;
}
```

:::

The header keeps its sidebar button, which is how you reach the menu in the
app.

## Close the sidebar when a link opens

On a phone, the starter kits show the sidebar as a sheet over the page. In the
Laravel kit, the sheet stays open when you tap a link in it: the next screen
opens with the sheet still on top, and it's still open when you go back.

The shell shows each screen in the same web view, and the Laravel kit keeps
its sidebar layout between pages, so the open sheet comes along. Close it as
soon as a visit starts:

```tsx
// resources/js/components/app-sidebar.tsx
import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import { isNativeApp } from '@/lib/native';

export function AppSidebar() {
    const { setOpenMobile } = useSidebar();

    useEffect(() => {
        if (!isNativeApp) {
            return;
        }

        return router.on('before', (event) => {
            if (!event.detail.visit.async) {
                setOpenMobile(false);
            }
        });
    }, [setOpenMobile]);

    // …
}
```

Inertia fires `before` when you tap a link, before the shell opens the next
screen. Polls and partial reloads are `async` visits that update the current
page, so they leave the sheet alone. In a browser the sheet behaves as before.

The Rails kit renders its layout inside each page, so its sheet already closes
on the next screen.

## Start fresh after logging in

After you log in, the dashboard shows up on the login screen, and Back takes
you to the screens from before you logged in. Two things cause this. By
default, a form's result stays on the form's screen, so the shell doesn't
learn that you're on the dashboard now. And when it does, it opens the
dashboard on top of the login screen.

First, have `inertia-native` hand the page a form lands on to the shell, as a
new visit. [Form redirects](/guide/navigation#form-redirects) explains the
option:

::: code-group

```tsx [Laravel]
// resources/js/app.tsx
initInertiaNative({ proposeFormRedirects: true });
```

```tsx [Rails]
// app/javascript/entrypoints/inertia.tsx
initInertiaNative({ proposeFormRedirects: true })
```

:::

Then make the dashboard the first screen, with nothing to go back to. That's
the `replace_root` presentation. In `ios/App/path-configuration.json` and
`android/app/src/main/assets/json/path-configuration.json`, replace the
`^/$` rule with this one:

::: code-group

```json [Laravel]
{
  "patterns": ["^/$", "^/dashboard$"],
  "properties": {
    "presentation": "replace_root"
  }
}
```

```json [Rails]
{
  "patterns": ["^/$", "^/dashboard$", "^/sign_in$"],
  "properties": {
    "presentation": "replace_root"
  }
}
```

:::

The home page `/` moves to the new rule too. Its old presentation,
`clear_all`, goes back to the first screen, and once you've logged in, that's
the dashboard.

The rule also handles logging out. The Laravel kit logs you out to `/`. The
Rails kit logs you out to `/sign_in`, so its rule lists that page as well. As
a side effect, the **Log in** link on the Rails kit's welcome page also opens
the login screen as the first screen, without a Back button.

The app reads these files when it's built, so run `npm run ios` and
`npm run android` again. If you also
[serve the path configuration](/guide/how-it-works#where-it-lives) from your
app, change the rule there too, because the server's copy replaces the bundled
file.

## Close a modal after a form

In the shells from `init`, a page whose URL ends in `/new` or `/edit` opens as
a modal. After the form saves, you want the modal to close and show the screen
underneath. A redirect can't do this: Inertia follows a redirect inside its own
request, so by default the shell never sees it. With `proposeFormRedirects`,
the shell sees the page the form lands on, but it opens that page as a new
visit instead of going back to the screen underneath.

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
