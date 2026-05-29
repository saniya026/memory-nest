/**
 * Occasion theme tokens for the memory designing page.
 * CSS variables are applied on the page wrapper when an occasion is selected.
 */

export const DEFAULT_OCCASION_ID = 'neutral';

/** Maps theme id → value stored on the order */
export const OCCASION_ORDER_VALUES = {
  neutral: 'Custom',
  birthday: 'Birthday',
  anniversary: 'Anniversary',
  wedding: 'Wedding',
  graduation: 'Graduation',
  'baby-shower': 'Baby Shower',
  valentines: "Valentine's Day",
  mothers: "Mother's Day",
  fathers: "Father's Day",
};

export const OCCASION_THEMES = {
  neutral: {
    id: 'neutral',
    label: 'Select Occasion',
    icon: '✨',
    primary: '#9CA3AF',
    secondary: '#FFFFFF',
    accent: '#E5E7EB',
    bg: '#FAFAFA',
    surface: 'rgba(255,255,255,0.92)',
    text: '#374151',
    textMuted: '#6B7280',
    border: 'rgba(0,0,0,0.08)',
    vibe: 'Pick an occasion to preview your page theme',
    pattern: 'dots',
  },
  birthday: {
    id: 'birthday',
    label: 'Birthday',
    icon: '🎂',
    primary: '#FF6B6B',
    secondary: '#FFE66D',
    accent: '#4ECDC4',
    bg: '#FFF5F5',
    surface: 'rgba(255,255,255,0.9)',
    text: '#2D3436',
    textMuted: '#636E72',
    border: 'rgba(255,107,107,0.35)',
    vibe: 'Fun, colorful, celebratory',
    pattern: 'confetti',
  },
  anniversary: {
    id: 'anniversary',
    label: 'Anniversary',
    icon: '💑',
    primary: '#C9A96E',
    secondary: '#FFF5E6',
    accent: '#8B0000',
    bg: '#FFF9F0',
    surface: 'rgba(255,245,230,0.95)',
    text: '#3D2914',
    textMuted: '#6B5344',
    border: 'rgba(201,169,110,0.45)',
    vibe: 'Elegant, romantic, warm',
    pattern: 'hearts',
  },
  wedding: {
    id: 'wedding',
    label: 'Wedding',
    icon: '💍',
    primary: '#D4AF87',
    secondary: '#F8F4F0',
    accent: '#FFFFFF',
    bg: '#F8F4F0',
    surface: 'rgba(255,255,255,0.95)',
    text: '#4A4035',
    textMuted: '#7A6F63',
    border: 'rgba(212,175,135,0.5)',
    vibe: 'Soft, luxurious, timeless',
    pattern: 'lace',
  },
  graduation: {
    id: 'graduation',
    label: 'Graduation',
    icon: '🎓',
    primary: '#1A237E',
    secondary: '#FFD700',
    accent: '#FFFFFF',
    bg: '#E8EAF6',
    surface: 'rgba(255,255,255,0.92)',
    text: '#1A237E',
    textMuted: '#3949AB',
    border: 'rgba(26,35,126,0.25)',
    vibe: 'Proud, achievement, formal',
    pattern: 'lines',
  },
  'baby-shower': {
    id: 'baby-shower',
    label: 'Baby Shower',
    icon: '🍼',
    primary: '#AED6F1',
    secondary: '#FDFEFE',
    accent: '#A9DFBF',
    bg: '#EBF5FB',
    surface: 'rgba(253,254,254,0.95)',
    text: '#2C3E50',
    textMuted: '#5D6D7E',
    border: 'rgba(174,214,241,0.6)',
    vibe: 'Soft, gentle, innocent',
    pattern: 'bubbles',
  },
  valentines: {
    id: 'valentines',
    label: "Valentine's Day",
    icon: '❤️',
    primary: '#E91E63',
    secondary: '#FCE4EC',
    accent: '#FF80AB',
    bg: '#FCE4EC',
    surface: 'rgba(255,255,255,0.9)',
    text: '#880E4F',
    textMuted: '#AD1457',
    border: 'rgba(233,30,99,0.35)',
    vibe: 'Romantic, passionate, loving',
    pattern: 'hearts',
  },
  mothers: {
    id: 'mothers',
    label: "Mother's Day",
    icon: '🌸',
    primary: '#F48FB1',
    secondary: '#FFF9C4',
    accent: '#A5D6A7',
    bg: '#FFF8F8',
    surface: 'rgba(255,255,255,0.92)',
    text: '#4A148C',
    textMuted: '#7B1FA2',
    border: 'rgba(244,143,177,0.45)',
    vibe: 'Warm, gentle, floral',
    pattern: 'floral',
  },
  fathers: {
    id: 'fathers',
    label: "Father's Day",
    icon: '👨',
    primary: '#1565C0',
    secondary: '#F5F5F5',
    accent: '#FFA726',
    bg: '#E3F2FD',
    surface: 'rgba(255,255,255,0.92)',
    text: '#0D47A1',
    textMuted: '#1565C0',
    border: 'rgba(21,101,192,0.3)',
    vibe: 'Strong, warm, dependable',
    pattern: 'lines',
  },
};

export const OCCASION_LIST = Object.values(OCCASION_THEMES).filter((t) => t.id !== 'neutral');

/** Build inline CSS variables for the design page wrapper */
export function getOccasionCssVars(theme) {
  return {
    '--occ-primary': theme.primary,
    '--occ-secondary': theme.secondary,
    '--occ-accent': theme.accent,
    '--occ-bg': theme.bg,
    '--occ-surface': theme.surface,
    '--occ-text': theme.text,
    '--occ-text-muted': theme.textMuted,
    '--occ-border': theme.border,
  };
}

export function getThemeById(id) {
  return OCCASION_THEMES[id] || OCCASION_THEMES[DEFAULT_OCCASION_ID];
}

/** Relative luminance — pick readable text on custom backgrounds */
function luminance(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  const [lr, lg, lb] = [r, g, b].map((v) =>
    v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

/**
 * Build a full occasion theme from customer-defined name + colors.
 * Used for "Add Your Own Occasion" flow.
 */
export function buildCustomOccasionTheme({ id, name, primary, secondary, presetLabel }) {
  const darkBg = luminance(secondary) < 0.5;
  return {
    id,
    label: name.trim(),
    icon: '🎉',
    primary,
    secondary,
    accent: primary,
    bg: secondary,
    surface: darkBg ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.92)',
    text: darkBg ? '#F9FAFB' : '#1F2937',
    textMuted: darkBg ? '#D1D5DB' : '#6B7280',
    border: `${primary}66`,
    vibe: presetLabel ? `${presetLabel} · Your special day` : 'Your custom celebration',
    pattern: 'dots',
    isCustom: true,
    colorPresetLabel: presetLabel || '',
    customColors: { primary, secondary },
  };
}

export function createCustomOccasionId() {
  return `custom-${Date.now()}`;
}
