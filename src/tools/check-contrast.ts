export type ContrastResult = {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  passesAAForLargeText: boolean;
  level: 'Pass' | 'Fail';
};

export function checkContrast(
  foreground: string,
  background: string,
): ContrastResult {
  const fg = normalizeHex(foreground);
  const bg = normalizeHex(background);

  if (!fg || !bg) {
    throw new Error('Both foreground and background colors must be valid hex values.');
  }

  const contrastRatio = getContrastRatio(fg, bg);

  return {
    ratio: Number(contrastRatio.toFixed(2)),
    passesAA: contrastRatio >= 4.5,
    passesAAA: contrastRatio >= 7,
    passesAAForLargeText: contrastRatio >= 3,
    level: contrastRatio >= 4.5 ? 'Pass' : 'Fail',
  };
}

function normalizeHex(value: string): string | null {
  const trimmed = value.trim();
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed) || /^#[0-9a-fA-F]{6}$/.test(trimmed)) {
    const hex = trimmed.replace('#', '');
    if (hex.length === 3) {
      return '#' + hex.split('').map((char) => char + char).join('');
    }
    return '#' + hex;
  }

  return null;
}

function getContrastRatio(foreground: string, background: string): number {
  const fgLuminosity = getRelativeLuminance(foreground);
  const bgLuminosity = getRelativeLuminance(background);
  const lighter = Math.max(fgLuminosity, bgLuminosity);
  const darker = Math.min(fgLuminosity, bgLuminosity);

  return (lighter + 0.05) / (darker + 0.05);
}

function getRelativeLuminance(hexColor: string): number {
  const channels = hexColor
    .replace('#', '')
    .match(/.{1,2}/g)
    ?.map((segment) => parseInt(segment, 16) / 255) ?? [0, 0, 0];

  const adjusted = channels.map((channel) => {
    if (channel <= 0.04045) {
      return channel / 12.92;
    }
    return ((channel + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * adjusted[0] + 0.7152 * adjusted[1] + 0.0722 * adjusted[2];
}
