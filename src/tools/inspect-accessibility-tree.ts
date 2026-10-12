import { chromium } from 'playwright';

export async function inspectAccessibilityTree(
  url: string,
): Promise<{ url: string; snapshot: string; limitation: string }> {
  const parsedUrl = new URL(url);
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error('Only http and https URLs can be inspected.');
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(parsedUrl.href, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    return {
      url: parsedUrl.href,
      snapshot: await page.locator('body').ariaSnapshot(),
      limitation: 'The ARIA snapshot is an inspection aid, not a substitute for testing with assistive technology.',
    };
  } finally {
    await browser.close();
  }
}
