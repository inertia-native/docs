import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Inertia × Hotwire Native',
  description:
    'Drive Inertia.js navigation and bridge components from Hotwire Native (iOS & Android).',
  cleanUrls: true,
  lastUpdated: true,

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'API', link: '/reference/api' },
      {
        text: 'Links',
        items: [
          { text: 'npm package', link: 'https://www.npmjs.com/package/inertia-native' },
          { text: 'Web demo', link: 'https://github.com/inertia-native/demo-rails' },
          { text: 'iOS demo', link: 'https://github.com/inertia-native/demo-ios' },
          { text: 'Android demo', link: 'https://github.com/inertia-native/demo-android' },
        ],
      },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/guide/introduction' },
          { text: 'Installation', link: '/guide/installation' },
          { text: 'Navigation', link: '/guide/navigation' },
        ],
      },
      {
        text: 'Bridge components',
        items: [
          { text: 'Overview', link: '/components/overview' },
          { text: 'Alert', link: '/components/alert' },
          { text: 'Button', link: '/components/button' },
        ],
      },
      {
        text: 'Native apps',
        items: [
          { text: 'iOS', link: '/native/ios' },
          { text: 'Android', link: '/native/android' },
        ],
      },
      {
        text: 'Reference',
        items: [{ text: 'API', link: '/reference/api' }],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/inertia-native/inertia-native' },
    ],

    editLink: {
      pattern: 'https://github.com/inertia-native/docs/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    search: { provider: 'local' },
  },
})
