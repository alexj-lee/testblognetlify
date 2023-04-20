import { getBlogpost } from '$lib/content';
import { error } from '@sveltejs/kit';
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ fetch, params }) {
	const { slug } = params;
	let data;
	try {
		console.log('ooooo');
		data = await getBlogpost(slug);
		console.log('in the loop');
		return new Response(JSON.stringify(data), {
			headers: {
				'Cache-Control': `public, max-age=3600`, // 1 hour
			}
		});
	} catch (err) {
		console.log("didn't find ", slug)
		console.error(err);
		throw error(404, err.message);
	}
}