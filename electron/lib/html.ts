import { load } from 'cheerio';

export interface HtmlEntity {
  title: string;
  seoMetas: Record<string, string>[];
  rawHtml: string;
}

export const marshalHtml = (html: string): HtmlEntity => {
  const $ = load(html);
  const title = $('title').text();
  const seoMetas: Record<string, string>[] = [];
  $('meta').each((_, el) => {
    const name = $(el).attr('name');
    const content = $(el).attr('content');
    if (name && content) {
      seoMetas.push({ name, content });
    }
  });
  return {
    title,
    seoMetas,
    rawHtml: html,
  };
};

export const unmarshalHtml = ({ title, seoMetas, rawHtml }: HtmlEntity): string => {
  const $ = load(rawHtml);
  $('title').text(title);
  seoMetas.forEach((meta) => {
    const findMeta = $(`meta[name="${meta.name}"]`);
    if (findMeta.length) {
      findMeta.attr('content', meta.content);
    } else {
      $('head').append(`<meta name="${meta.name}" content="${meta.content}">`);
    }
  });
  return $.html();
};
