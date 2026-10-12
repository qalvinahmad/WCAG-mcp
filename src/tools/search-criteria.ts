export type CriteriaRecord = {
  id: string;
  title: string;
  level: 'A' | 'AA' | 'AAA';
  summary: string;
};

const criteriaCatalog: CriteriaRecord[] = [
  {
    id: '1.1.1',
    title: 'Non-text Content',
    level: 'A',
    summary: 'Provide text alternatives for non-text content so it can be understood by assistive technologies.',
  },
  {
    id: '1.4.3',
    title: 'Contrast (Minimum)',
    level: 'AA',
    summary: 'Text and images of text should have sufficient contrast against their backgrounds.',
  },
  {
    id: '2.1.1',
    title: 'Keyboard',
    level: 'A',
    summary: 'All functionality should be available using a keyboard interface without traps.',
  },
  {
    id: '2.4.7',
    title: 'Focus Visible',
    level: 'AA',
    summary: 'Keyboard focus must be visible to users navigating the interface.',
  },
  {
    id: '4.1.3',
    title: 'Status Messages',
    level: 'AA',
    summary: 'Status updates should be communicated to assistive technology without requiring focus changes.',
  },
];

export function searchCriteria(query: string): CriteriaRecord[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return criteriaCatalog;
  }

  return criteriaCatalog.filter((criterion) => {
    return [
      criterion.id,
      criterion.title,
      criterion.level,
      criterion.summary,
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalized);
  });
}
