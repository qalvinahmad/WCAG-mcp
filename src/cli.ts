#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMcpServer } from './server.js';

const server = createMcpServer();
const transport = new StdioServerTransport();

server.connect(transport).catch((error: unknown) => {
  console.error('Failed to start the WCAG MCP server:', error);
  process.exitCode = 1;
});
