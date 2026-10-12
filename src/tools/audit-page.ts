import { AxeBuilder } from '@axe-core/playwright';
import { chromium, type Page } from 'playwright';

export type AuditLevel = 'A' | 'AA' | 'AAA';

export type AuditPageOptions = {
  level?: AuditLevel;
  timeout?: number;
};

export type AuditPageResult = {
  url: string;
  standard: 'WCAG 2.2';
  level: AuditLevel;
  automatedStatus: 'violations_found' | 'no_violations_detected';
  summary: {
    violations: number;
    affectedNodes: number;
    passedRules: number;
    needsReviewRules: number;
  };
  violations: Array<{
    id: string;
    impact: string | null;
    description: string;
    help: string;
    helpUrl: string;
    wcagTags: string[];
    nodes: Array<{
      target: string[];
      html: string;
      failureSummary: string | null;
    }>;
  }>;
  needsManualReview: Array<{
    id: string;
    description: string;
    help: string;
    helpUrl: string;
    nodes: number;
  }>;
  limitation: string;
};

const WCAG_TAGS: Record<AuditLevel, string[]> = {
  A: ['wcag2a', 'wcag21a', 'wcag22aa'],
  AA: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
  AAA: ['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag21aaa', 'wcag22aa'],
};

type AxeResults = Awaited<ReturnType<AxeBuilder['analyze']>>;

export async function auditPage(
  url: string,
  options: AuditPageOptions = {},
): Promise<AuditPageResult> {
  const level = options.level ?? 'AA';
  const parsedUrl = new URL(url);

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error('Only http and https URLs can be audited.');
  }

  const timeout = options.timeout ?? 30_000;
  if (!Number.isInteger(timeout) || timeout < 1_000 || timeout > 120_000) {
    throw new Error('Audit timeout must be an integer between 1000 and 120000 milliseconds.');
  }

  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(parsedUrl.href, { waitUntil: 'domcontentloaded', timeout });
    const results = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS[level])
      .analyze();

    return normalizeAxeResults(results, parsedUrl.href, level);
  } finally {
    await browser.close();
  }
}

export async function scanPageContent(
  page: Page,
  source: string,
  level: AuditLevel = 'AA',
): Promise<AuditPageResult> {
  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS[level])
    .analyze();

  return normalizeAxeResults(results, source, level);
}

export function normalizeAxeResults(
  results: AxeResults,
  url: string,
  level: AuditLevel,
): AuditPageResult {
  const violations = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact ?? null,
    description: violation.description,
    help: violation.help,
    helpUrl: violation.helpUrl,
    wcagTags: violation.tags.filter((tag) => tag.startsWith('wcag')),
    nodes: violation.nodes.map((node) => ({
      target: node.target.map(String),
      html: node.html,
      failureSummary: node.failureSummary ?? null,
    })),
  }));
  const needsManualReview = results.incomplete.map((item) => ({
    id: item.id,
    description: item.description,
    help: item.help,
    helpUrl: item.helpUrl,
    nodes: item.nodes.length,
  }));

  return {
    url,
    standard: 'WCAG 2.2',
    level,
    automatedStatus: violations.length > 0 ? 'violations_found' : 'no_violations_detected',
    summary: {
      violations: violations.length,
      affectedNodes: violations.reduce((total, violation) => total + violation.nodes.length, 0),
      passedRules: results.passes.length,
      needsReviewRules: needsManualReview.length,
    },
    violations,
    needsManualReview,
    limitation: 'Automated results cover only detectable rules. Axe tag scopes do not map perfectly to standalone WCAG 2.2 conformance levels. Review incomplete checks and perform manual and assistive-technology testing before making conformance claims.',
  };
}
