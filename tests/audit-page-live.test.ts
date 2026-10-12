import { createServer } from 'node:http';
import { describe, expect, it } from 'vitest';
import { auditPage } from '../src/tools/audit-page.js';

describe('auditPage', () => {
  it('reports axe-core violations from a live URL', async () => {
    const fixture = createServer((_request, response) => {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<!doctype html><html lang="en"><head><title>Fixture</title></head><body><main><button></button></main></body></html>');
    });

    await new Promise<void>((resolve, reject) => {
      fixture.once('error', reject);
      fixture.listen(0, '127.0.0.1', resolve);
    });

    const address = fixture.address();
    if (!address || typeof address === 'string') {
      fixture.close();
      throw new Error('The HTTP fixture did not bind to a TCP port.');
    }

    try {
      const result = await auditPage(`http://127.0.0.1:${address.port}`);

      expect(result.automatedStatus).toBe('violations_found');
      expect(result.violations.some((violation) => violation.id === 'button-name')).toBe(true);
    } finally {
      await new Promise<void>((resolve, reject) => {
        fixture.close((error) => error ? reject(error) : resolve());
      });
    }
  }, 30_000);
});
