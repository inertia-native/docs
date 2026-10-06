# inertia-native-docs

Documentation site for
[`inertia-native`](https://github.com/inertia-native/inertia-native) —
running Inertia.js apps inside Hotwire Native (iOS & Android).

Built with [VitePress](https://vitepress.dev). Published to
[inertia-native.dev](https://inertia-native.dev).

## Component registry submodule

Component pages embed their source straight from the
[bridge-components](https://github.com/inertia-native/bridge-components)
registry, vendored at `vendor/hotwire-bridge-components`. The build fails without
it, so clone with submodules:

```bash
git clone --recurse-submodules https://github.com/inertia-native/docs.git

# already cloned?
git submodule update --init
```

To show newer component sources, move the submodule up and commit the new
pointer:

```bash
git submodule update --remote vendor/hotwire-bridge-components
```

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # output: docs/.vitepress/dist
npm run preview  # serve the production build
```

## Deploy

Any static host works (Cloudflare Pages / Vercel / Netlify / GitHub Pages).
Build settings:

- **Build command:** `npm run build`
- **Output directory:** `docs/.vitepress/dist`
- **Custom domain:** `inertia-native.dev` (`.dev` is HTTPS-only via HSTS preload —
  every host above provisions TLS automatically)
