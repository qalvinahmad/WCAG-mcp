import { chromium } from 'playwright';
import {
  type AuditLevel,
  type AuditPageResult,
  scanPageContent,
} from './audit-page.js';

export async function auditHtml(
  html: string,
  options: { level?: AuditLevel } = {},
): Promise<AuditPageResult> {
  if (html.trim().length === 0) {
    throw new Error('HTML input must not be empty.');
  }
  if (Buffer.byteLength(html, 'utf8') > 1_000_000) {
    throw new Error('HTML input must be no larger than 1 MB.');
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ serviceWorkers: 'block' });
    const page = await context.newPage();
    await page.route('**/*', (route) => route.abort());
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 10_000 });

    return await scanPageContent(page, 'HTML snippet', options.level ?? 'AA');
  } finally {
    await browser.close();
  }
}
