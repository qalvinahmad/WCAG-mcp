import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { auditHtml } from './tools/audit-html.js';
import { auditPage } from './tools/audit-page.js';
import { checkContrast } from './tools/check-contrast.js';
import { formatReport } from './reports/format-report.js';
import { inspectAccessibilityTree } from './tools/inspect-accessibility-tree.js';
import { searchCriteria } from './tools/search-criteria.js';

const levelSchema = z.enum(['A', 'AA', 'AAA']).default('AA');

function toToolResult(value: unknown) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }],
  };
}

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: 'wcag-accessibility-toolkit',
    version: '0.1.0',
  });

  server.registerTool(
    'audit_page',
    {
      description: 'Run an automated WCAG 2.2 accessibility scan on a page using Playwright and axe-core. Results do not establish full conformance.',
      inputSchema: {
        url: z.string().url(),
        level: levelSchema,
        timeout: z.number().int().min(1_000).max(120_000).optional(),
      },
    },
    async ({ url, level, timeout }) =>
      toToolResult(await auditPage(url, { level, timeout })),
  );

  server.registerTool(
    'audit_html',
    {
      description: 'Run axe-core against a supplied HTML snippet in an isolated browser context with network requests blocked.',
      inputSchema: {
        html: z.string().min(1).max(1_000_000),
        level: levelSchema,
      },
    },
    async ({ html, level }) =>
      toToolResult(await auditHtml(html, { level })),
  );

  server.registerTool(
    'inspect_accessibility_tree',
    {
      description: 'Return a Playwright ARIA snapshot of a page for accessibility inspection.',
      inputSchema: { url: z.string().url() },
    },
    async ({ url }) => toToolResult(await inspectAccessibilityTree(url)),
  );

  server.registerTool(
    'check_contrast',
    {
      description: 'Calculate WCAG contrast ratios for opaque #RGB or #RRGGBB colors.',
      inputSchema: {
        foreground: z.string(),
        background: z.string(),
      },
    },
    async ({ foreground, background }) =>
      toToolResult(checkContrast(foreground, background)),
  );

  server.registerTool(
    'search_criteria',
    {
      description: 'Search the toolkit’s illustrative WCAG 2.2 criteria catalog by ID, level, or keyword.',
      inputSchema: { query: z.string().default('') },
    },
    async ({ query }) =>
      toToolResult({ criteria: searchCriteria(query), catalogIsComplete: false }),
  );

  server.registerTool(
    'generate_report',
    {
      description: 'Format supplied accessibility findings into a concise report.',
      inputSchema: {
        findings: z.array(z.object({
          title: z.string(),
          severity: z.enum(['critical', 'high', 'medium', 'low']),
          criteria: z.string(),
          recommendation: z.string(),
        })),
      },
    },
    async ({ findings }) => toToolResult({ report: formatReport(findings) }),
  );

  return server;
}
