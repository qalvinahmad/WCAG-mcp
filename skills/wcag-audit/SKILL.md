---
name: wcag-audit
description: Audit and improve web accessibility using WCAG 2.2 Level A, AA, and AAA. Use when reviewing UI components, HTML, CSS, forms, keyboard navigation, screen reader support, accessibility bugs, or conformance requirements.
---

# WCAG Accessibility Audit

## Objective

Review web applications against WCAG 2.2 and provide actionable, evidence-based accessibility improvements. Prefer evidence from source code, browser inspection, and reproducible tests over assumptions.

## Ground rules

- Map conformance findings to the success criterion by number, name, and level. If an observation has no applicable criterion, label it as a usability recommendation rather than a WCAG failure.
- Separate the WCAG standard from laws and legal advice. Do not promise certification or claim that one WCAG version is legally required everywhere.
- Prefer native HTML semantics; use ARIA only when native elements do not express the required behavior, and implement the full keyboard and state contract for custom widgets.
- Report automated coverage and its limits. Neither a clean scan nor an accessibility overlay establishes conformance.
- Provide corrected code or a concrete remediation, not only a description of the problem.

## Audit workflow

1. Identify the target page, component, framework, and requested conformance level.
2. Default to WCAG 2.2 Level AA when no level is specified.
3. Review Perceivable, Operable, Understandable, and Robust requirements.
4. Inspect semantic HTML, accessible names, roles, states, keyboard interactions, focus order, and form errors.
5. Check text and non-text contrast where measurable, and inspect zoom, reflow, and pointer target sizes.
6. Use automated tools where appropriate.
7. Treat automated violations as confirmed only when tool output and the affected element support the finding.
8. Identify incomplete checks and criteria requiring manual or assistive technology testing.
9. Recommend fixes with code examples.
10. Re-test the affected behavior after changes.

## Conformance rules

- Level A includes Level A success criteria.
- Level AA includes all Level A and AA criteria.
- Level AAA includes all Level A, AA, and AAA criteria.
- Use WCAG 2.2 as the default standard.
- Do not infer compliance from automated scores alone.
- Do not mark untested criteria as passed.
- Explain applicable exceptions and testing limitations.
- An axe-core scan covers only detectable rules; a clean result is not proof of conformance.
- Keep confirmed automated violations separate from potential issues and manual review tasks.

## Finding format

For each finding, provide:

- Title and severity
- WCAG version and success criterion
- Conformance level
- User impact
- Affected component or source location
- Evidence and reproduction steps
- Recommended fix
- Verification method
- Test status: passed, failed, or needs manual review
- Evidence source: automated scan, code inspection, manual test, or assistive technology

If no WCAG criterion applies, identify the item as a usability recommendation. Do not invent a criterion mapping.

## Final report

Summarize:

- Confirmed failures
- Potential issues
- Manual testing requirements
- Fix recommendations
- Remaining risks

Never claim full WCAG conformance without adequate evaluation of all applicable success criteria. This skill and its tools do not provide legal certification.

## Toolkit tools

When available, use `audit_page` for a live URL and `audit_html` for a supplied HTML snippet. Use `inspect_accessibility_tree` as a supplemental browser view, `check_contrast` for opaque hex colors, and `search_criteria` for the included criteria catalog. The catalog is not exhaustive; consult the official [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/) for complete normative requirements.
