const tocLinks = document.querySelectorAll<HTMLAnchorElement>(".toc-li a");
const headings = document.querySelectorAll<HTMLElement>(
	"#_top, article h1, article h2, article h3, article h4",
);
const tocMap = new Map<Element, HTMLElement>();

// Map TOC links to their corresponding headings
for (const link of tocLinks) {
	const id = link.href.split("#")[1];
	const heading = document.getElementById(id);
	if (heading) tocMap.set(heading, link as HTMLElement);
}

function checkVisibility(el: HTMLElement) {
	const rect = el.getBoundingClientRect();
	const viewHeight = Math.max(
		document.documentElement.clientHeight,
		window.innerHeight,
	);
	return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

const observer = new IntersectionObserver(
	() => {
		let visible: HTMLElement | null = null;

		for (const heading of headings) {
			// check if this specific heading is visible on the screen
			const isVisible = checkVisibility(heading);

			const link = tocMap.get(heading);

			if (!isVisible) {
				continue;
			}

			if (link) link.classList.add("active");

			if (!visible) {
				visible = heading;
			}

			break;
		}

		if (visible) {
			for (const key of tocMap.keys()) {
				if (key !== visible) {
					const link = tocMap.get(key);
					if (link) link.classList.remove("active");
				}
			}
		}
	},
	{ threshold: 0, root: null, rootMargin: "0px" },
);

// Observe all headings
for (const heading of headings) {
	observer.observe(heading);
}
