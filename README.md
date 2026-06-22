![Spectre, a terminal-inspired theme for Astro.](./images/README.png)

Spectre is a terminal-inspired theme for Astro, built using TypeScript and Astro.

## Getting Started

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/louisescher/spectre/tree/master)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/louisescher/spectre/tree/master)

Alternatively, you can create a new Astro project with Spectre like this:

```bash
# npm
npm create astro@latest -- --template louisescher/spectre

# pnpm
pnpm create astro@latest --template louisescher/spectre

# yarn
yarn create astro --template louisescher/spectre
```

## Features

- 100 / 100 Lighthouse performance
- Responsive for all screen sizes
- Fully accessible
- Type-Safe
- Auto-generated sitemap
- Markdown / MDX Support
- Builds on content collections
- Search powered by [pagefind](https://pagefind.app)
- Comments powered by [giscus](https://giscus.app) (can be turned off, see below for details)
- More!

## Curious?

Head over to [the preview page](https://spectre.lou.gg) to find out more!

### Spectre Integration

If you want to know more about how the custom integration that is used in the `astro.config.ts` file works, head over to the [integration's own README](https://github.com/louisescher/spectre/tree/master/package)!

### Turning off giscus

There should be a file called astro.config.ts in the cloned/forked repository. Inside of that file, there's a defineConfig function, inside of which is an integrations array that contains the spectre integration along with its options. The live version has the giscus option on Line 47. Simply removing Lines 47 to 57 should disable giscus.
