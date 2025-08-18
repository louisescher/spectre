interface OpenGraphInfo {
  /**
   * The title of the page.
   */
  title: string;
  /**
   * The description of the page.
   */
  description?: string;
}

interface OpenGraph {
  /*
   * Data for the home page.
   */
  home: OpenGraphInfo;
  /**
   * Data for the blog page.
   */
  blog: OpenGraphInfo;
  /**
   * Data for the projects page.
   */
  projects: OpenGraphInfo;
}

interface GiscusOptions {
  /**
   * The repository to use.
   */
  repository: string;
  /**
   * The repository ID.
   */
  repositoryId: string;
  /**
   * The category to use.
   */
  category: string;
  /**
   * The category ID.
   */
  categoryId: string;
  /**
   * The mapping to use.
   */
  mapping: string;
  /**
   * Whether to use strict mode.
   */
  strict: boolean;
  /**
   * Whether to enable reactions.
   */
  reactionsEnabled: boolean;
  /**
   * Whether to emit metadata.
   */
  emitMetadata: boolean;
  /**
   * The theme to use.
   */
  theme: string;
  /**
   * The language to use.
   */
  lang: string;
  /**
   * Where the comments input should be placed. Default is `below`.
   */
  commentsInput: 'bottom' | 'top';
}

declare module 'spectre:globals' {
  /**
   * The name that should be displayed on the main page.
   */
  export const name: string;
  /**
   * The theme color of the site.
   */
  export const themeColor: string;
  /**
   * The Twitter handle of the site.
   */
  export const twitterHandle: string;
  /**
   * Open Graph meta tags for various pages.
   */
  export const openGraph: OpenGraph;
  /**
   * Options for giscus.
   */
  export const giscus: false | GiscusOptions;
}