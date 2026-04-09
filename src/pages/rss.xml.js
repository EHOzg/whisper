import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const archive = await getCollection('archive');
  return rss({
    title: 'Whisper // EHO',
    description: 'A quiet container for digital shadows.',
    site: context.site,
    items: archive.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/archive/${post.id}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
