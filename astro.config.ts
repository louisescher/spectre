import { defineConfig } from 'astro/config';

import expressiveCode from 'astro-expressive-code';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import spectre from './package/src';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://duplicake.fyi',
  output: 'static',
  integrations: [
    expressiveCode(),
    mdx(),
    sitemap(),
    spectre({
      name: 'Duplicake',
      openGraph: {
        home: {
          title: 'Hompage',
          description: 'The homepage of my website.'
        },
        blog: {
          title: 'Blog',
          description: 'My Blog where I dump random stuff.'
        },
        projects: {
          title: 'Projects'
        }
      },
      giscus: {
        repository: 'SomeRandomCpu/website-spectre',
        repositoryId: 'R_kgDONlh9tw',
        category: 'General',
        categoryId: 'DIC_kwDONlh9t84CltGC',
        mapping: 'pathname',
        strict: true,
        reactionsEnabled: true,
        emitMetadata: false,
        lang: 'en',
      }
    })
  ],
  adapter: node({
    mode: 'standalone'
  })
});