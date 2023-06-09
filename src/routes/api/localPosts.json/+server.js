import { slugFromPath } from '$lib/content.js';
import { json } from '@sveltejs/kit';
///import { compile } from 'mdsvex';

// /** @type {import('@sveltejs/kit').RequestHandler} */
// export async function GET({ url }) {
// 	/** const modules = import.meta.glob('/content/*.{md,svx,svelte.md}'); */
// 	const modules = import.meta.glob('/src/routes/content/*.{md,svx,svelte.md}', { eager: true });

// 	const postPromises = [];

// 	for (let [path, resolver] of Object.entries(modules)) {
// 		const slug = slugFromPath(path);
// 		const promise = resolver().then((post) => ({
// 			slug,
// 			...post.metadata
// 		}));

// 		postPromises.push(promise);
// 	}

// 	const posts = await Promise.all(postPromises);
// 	// const publishedPosts = posts.filter((post) => post.published)

// 	// publishedPosts.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));

// 	return json(posts);
// }



import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import remarkAbbr from 'remark-abbr';
import rehypeAutoLink from 'remark-autolink-headings';
import remarkMath from 'remark-math';

const remarkPlugins = [
	remarkAbbr,
	remarkMath,
];
const rehypePlugins = [
	//rehypeStringify,
	rehypeSlug,
	[
		rehypeAutoLink,
		{
			behavior: 'wrap',
			properties: { class: 'hover:text-yellow-100 no-underline' }
		}
	],
	rehypeKatex
];

export async function GET({ url }) {
	const modules = import.meta.glob('/src/routes/content/*.{md,svx,svelte.md}');
	const iterablePostFiles = Object.entries(modules);

	const allPosts = await Promise.all(
		iterablePostFiles.map(async ([path, resolver]) => {
			const resolvedPost = await resolver();
			//const body = resolvedPost.default.render(); // this is the compiled HTML
			const slug = slugFromPath(path);
			//const md = compile(body.html, { remarkPlugins, rehypePlugins }).code;

			return {
				// meta: resolvedPost.metadata,
				slug: slug,
				...resolvedPost.metadata,
				// body: body,
				// md: { md }
			};
		})
	);

	const sortedPosts = allPosts.sort((a, b) => {
		return new Date(b.meta.date) > new Date(a.meta.date);
	})

	return json(sortedPosts);

};

