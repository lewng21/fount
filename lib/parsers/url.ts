import * as cheerio from 'cheerio'

export async function parseUrl(url: string): Promise<{ text: string; title: string }> {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Fount/1.0)' },
    signal: AbortSignal.timeout(10000),
  })

  if (!response.ok) throw new Error(`Failed to fetch URL: ${response.status}`)

  const html = await response.text()
  const $ = cheerio.load(html)

  const title = $('title').first().text().trim() || url

  // Remove non-content elements
  $('script, style, nav, footer, header, aside, .sidebar, .nav, .menu, .ad, iframe').remove()

  // Prefer article content
  const article = $('article, main, [role="main"], .content, .post, .entry').first()
  const text = (article.length ? article : $('body')).text()

  return {
    title,
    text: text.replace(/\s+/g, ' ').trim(),
  }
}
