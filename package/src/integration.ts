import type { AstroIntegration } from "astro";
import { z } from "astro/zod";
import { viteVirtualModulePluginBuilder } from "./utils/virtual-module-plugin-builder";

const openGraphOptionsSchema = z.object({
	/**
	 * The title of the page.
	 */
	title: z.string(),
	/**
	 * The description of the page. Optional.
	 */
	description: z.string().optional(),
});

const giscusMappingSchema = z.union([
	z.literal("pathname"),
	z.literal("url"),
	z.literal("title"),
	z.literal("og:title"),
	z.literal("specific"),
	z.literal("number"),
]);

const giscusObjectSchema = z
	.object({
		/**
		 * The repository name.
		 */
		repository: z.string(),
		/**
		 * The repository's ID.
		 */
		repositoryId: z.string(),
		/**
		 * The category of the repository.
		 */
		category: z.string(),
		/**
		 * The category's ID.
		 */
		categoryId: z.string(),
		/**
		 * The mapping of the comments.
		 */
		mapping: giscusMappingSchema,
		/**
		 * The term to use for the comments.
		 */
		term: z.string().optional(),
		/**
		 * Whether the comments are strict.
		 */
		strict: z.boolean(),
		/**
		 * Whether reactions are enabled.
		 */
		reactionsEnabled: z.boolean(),
		/**
		 * Whether metadata should be emitted.
		 */
		emitMetadata: z.boolean(),
		/**
		 * The theme to use for the comments. Defaults to `https://spectre.louisescher.dev/styles/giscus`.
		 */
		theme: z.string().optional(),
		/**
		 * The language to use for the comments.
		 */
		lang: z.string(),
		/**
		 * Where the comments input should be placed. Default is `bottom`.
		 */
		commentsInput: z.union([z.literal("bottom"), z.literal("top")]).optional(),
	})
	.refine((data) => {
		if (data.mapping === "specific" || data.mapping === "number") {
			return !!data.term;
		}

		return true;
	})
	.optional();

export const optionsSchema = z.object({
	/**
	 * The name that should be displayed on the main page.
	 */
	name: z.string(),
	/**
	 * The theme color of the site. Optional. Defaults to `#8c5cf5`.
	 */
	themeColor: z.string().optional(),
	/**
	 * The Twitter handle of the site. Used for Twitter meta tags. Optional.
	 */
	twitterHandle: z.string().optional(),
	/**
	 * Open Graph meta tags for various pages.
	 */
	openGraph: z.object({
		/**
		 * Open Graph meta tags for the home page.
		 */
		home: openGraphOptionsSchema,
		/**
		 * Open Graph meta tags for the blog page.
		 */
		blog: openGraphOptionsSchema,
		/**
		 * Open Graph meta tags for the projects page.
		 */
		projects: openGraphOptionsSchema,
	}),
	/**
	 * All of this information can be find on [giscus' config page](https://giscus.app) under "Enable giscus" after entering all information.
	 */
	giscus: z.union([z.literal(false), giscusObjectSchema]),
});

export type GiscusMapping = z.infer<typeof giscusMappingSchema>;

export default function integration(
	options: z.infer<typeof optionsSchema>,
): AstroIntegration {
	if (typeof options.giscus === "object") {
		const giscusOpts = (options.giscus as z.infer<typeof giscusObjectSchema>)!;
		const likelyUntouchedConfig = Object.keys(giscusOpts).every((key) => {
			const item = giscusOpts[key as keyof typeof giscusOpts];

			return typeof item === "undefined" || item === false;
		});

		if (likelyUntouchedConfig) {
			throw new Error(
				"\n\nERROR: It seems you have not updated the preset Giscus configuration for comments! Please change the settings in your astro.config.mjs by adding a .env with the required variables, adding the strings right in your configuration or removing the `giscus` option altogether.\n\n",
			);
		}
	}

	const validatedOptions = optionsSchema.parse(options);

	const globals = viteVirtualModulePluginBuilder(
		"spectre:globals",
		"spectre-theme-globals",
		`
    export const name = ${JSON.stringify(validatedOptions.name)};
    export const themeColor = ${JSON.stringify(validatedOptions.themeColor ?? "#8c5cf5")};
    export const twitterHandle = ${JSON.stringify(validatedOptions.twitterHandle)};
    export const openGraph = {
      home: ${JSON.stringify(validatedOptions.openGraph.home)},
      blog: ${JSON.stringify(validatedOptions.openGraph.blog)},
      projects: ${JSON.stringify(validatedOptions.openGraph.projects)},
    };
    export const giscus = ${validatedOptions.giscus ? JSON.stringify(validatedOptions.giscus) : "false"};
  `,
	);

	return {
		name: "spectre-theme",
		hooks: {
			"astro:config:setup": ({ updateConfig }) => {
				updateConfig({
					vite: {
						plugins: [globals()],
					},
				});
			},
		},
	};
}
