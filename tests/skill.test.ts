import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const skillUrl = new URL('../skills/wcag-audit/SKILL.md', import.meta.url);
const skill = readFileSync(skillUrl, 'utf8');

describe('WCAG audit skill', () => {
  it('has the required skill metadata and audit boundaries', () => {
    expect(skill).toMatch(/^---\nname: wcag-audit\n/);
    expect(skill).toContain('Do not infer compliance from automated scores alone.');
    expect(skill).toContain('do not provide legal certification');
  });

  it('includes all three level reference documents', () => {
    for (const level of ['a', 'aa', 'aaa']) {
      const reference = new URL(`../skills/wcag-audit/references/wcag-22-level-${level}.md`, import.meta.url);
      expect(readFileSync(reference, 'utf8')).toContain('WCAG 2.2');
    }
  });
});
