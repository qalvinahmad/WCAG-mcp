import { describe, expect, it } from 'vitest';
import { searchCriteria } from '../src/tools/search-criteria.js';

describe('searchCriteria', () => {
  it('searches by criterion ID and title', () => {
    expect(searchCriteria('1.4.3').map(({ title }) => title)).toContain('Contrast (Minimum)');
    expect(searchCriteria('keyboard').map(({ id }) => id)).toContain('2.1.1');
  });
});

describe('auditHtml', () => {
  it('reports detectable accessibility violations from HTML', async () => {
    const { auditHtml } = await import('../src/tools/audit-html.js');
    const result = await auditHtml('<main><button></button></main>');

    expect(result.automatedStatus).toBe('violations_found');
    expect(result.violations.some((violation) => violation.id === 'button-name')).toBe(true);
    expect(result.limitation).toContain('manual');
  }, 30_000);

  it('rejects empty HTML', async () => {
    const { auditHtml } = await import('../src/tools/audit-html.js');

    await expect(auditHtml('  ')).rejects.toThrow('must not be empty');
  });
});
