# WCAG Accessibility Toolkit

WCAG 2.2 accessibility guidance and an MCP server that scans live pages and HTML snippets with Playwright and axe-core. Level AA is the default. Automated scans report detectable violations and checks needing review; they do not establish full WCAG conformance.

## Features

- `audit_page`: run axe-core on an HTTP(S) page using Playwright.
- `audit_html`: scan supplied HTML in a browser context with external network requests blocked.
- `inspect_accessibility_tree`: return a Playwright ARIA snapshot for a URL.
- `check_contrast`: calculate WCAG contrast ratios for opaque hex colors.
- `search_criteria`: search the included WCAG quick-reference catalog.
- `generate_report`: format supplied findings for an audit summary.
- `skills/wcag-audit`: audit workflow and guidance for AI coding agents.

The audit output includes rule IDs, impact, affected selectors and DOM snippets, automated status, and axe-core's incomplete checks for manual review. Axe tag scopes are useful filters but do not map perfectly to standalone WCAG 2.2 conformance levels. A no-violations result is not a conformance claim.

## Requirements and setup

- Node.js 20 or newer
- Chromium browser installed for Playwright

```sh
npm install
npx playwright install chromium
npm run build
npm test
```

Start the MCP server over stdio:

```sh
npm start
```

Example MCP client configuration:

```json
{
  "mcpServers": {
    "wcag-accessibility-toolkit": {
      "command": "node",
      "args": ["/absolute/path/to/WCAG-mcp/dist/src/cli.js"]
    }
  }
}
```

## MCP tool examples

`audit_page` accepts a URL and optional level (`A`, `AA`, or `AAA`) and timeout in milliseconds. It uses axe-core tags for the selected level and returns violations plus checks requiring manual review.

`audit_html` accepts an HTML string and optional level. The input is limited to 1 MB and network requests are blocked while it is evaluated.

`inspect_accessibility_tree` accepts a URL and returns a browser ARIA snapshot. It is a debugging aid, not a screen-reader simulation.

`check_contrast` accepts `foreground` and `background` as opaque `#RGB` or `#RRGGBB` values. Transparent colors are rejected because their effective color depends on the composited background.

`search_criteria` accepts a criterion ID, level, or search phrase. The local catalog is illustrative, not the full WCAG success-criteria database; see the official [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/).

`generate_report` accepts findings and returns a concise text report.

## Audit limitations

axe-core detects a useful subset of accessibility issues. It cannot verify all WCAG success criteria or judge context-dependent content such as whether alternative text is meaningful. Review incomplete results, test keyboard and screen-reader behavior, and evaluate applicable criteria manually. The selected level scopes axe rule tags; it is not an exhaustive criterion-level conformance filter. Do not claim 100% WCAG compliance based on automated results alone.

## Reference projects

This implementation was informed by the criterion-based workflow and skill structure in [digital-accessibility-skill](https://github.com/Gabriel-Dalton/digital-accessibility-skill), the WCAG 2.2 review boundaries in [wcag-ai-skill](https://github.com/Raze-Systems/wcag-ai-skill), the normalized audit output and Playwright/axe integration described by [accessibility-mcp](https://github.com/Duds/accessibility-mcp), and the focused scan-tool approach in [playwright-accessibility-mcp-server](https://github.com/deepakkamboj/playwright-accessibility-mcp-server). The project integrates [axe-core](https://github.com/dequelabs/axe-core) as its scanning engine. These projects are references; their source files are not copied into this repository.

## License

MIT
