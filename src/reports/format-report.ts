export type AuditFinding = {
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  criteria: string;
  recommendation: string;
};

export function formatReport(findings: AuditFinding[]): string {
  if (findings.length === 0) {
    return 'No issues detected in the current audit scope.';
  }

  return findings
    .map((finding) => {
      return `- ${finding.title} [${finding.severity.toUpperCase()}] — ${finding.criteria}\n  Recommendation: ${finding.recommendation}`;
    })
    .join('\n');
}
