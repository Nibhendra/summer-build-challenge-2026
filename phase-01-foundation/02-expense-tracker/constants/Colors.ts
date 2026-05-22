// ─────────────────────────────────────────────────────────────
//  Theme definitions — dark (default) + light
// ─────────────────────────────────────────────────────────────

export type ThemeColors = {
  background: string;
  surface: string;
  card: string;
  cardElevated: string;

  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  accentLight: string;

  gradientHero:   [string, string];
  gradientPurple: [string, string];
  gradientGreen:  [string, string];
  gradientOrange: [string, string];
  gradientPink:   [string, string];
  gradientBlue:   [string, string];
  gradientGold:   [string, string];

  textPrimary:   string;
  textSecondary: string;
  textMuted:     string;
  textInverse:   string;

  cash:    string;
  upi:     string;
  payCard: string;
  other:   string;

  catFood:          string;
  catTransport:     string;
  catShopping:      string;
  catEntertainment: string;
  catHealth:        string;
  catEducation:     string;
  catUtilities:     string;
  catRent:          string;
  catGroceries:     string;
  catOther:         string;

  success: string;
  warning: string;
  danger:  string;
  info:    string;

  chartColors: string[];
  border:      string;
  borderLight: string;
  overlay:     string;
};

export const darkColors: ThemeColors = {
  background:   '#0D0D1A',
  surface:      '#13132B',
  card:         '#1A1A35',
  cardElevated: '#21214A',

  primary:      '#7C6EF6',
  primaryLight: '#A89BFF',
  primaryDark:  '#5A4ECC',
  accent:       '#00E5C0',
  accentLight:  '#00FFDB',

  gradientHero:   ['#7C6EF6', '#00E5C0'],
  gradientPurple: ['#7C6EF6', '#B06EF6'],
  gradientGreen:  ['#00E5C0', '#00B4D8'],
  gradientOrange: ['#FF9A3C', '#FF6B6B'],
  gradientPink:   ['#FF6B9D', '#C44DFF'],
  gradientBlue:   ['#4FACFE', '#00F2FE'],
  gradientGold:   ['#F7971E', '#FFD200'],

  textPrimary:   '#FFFFFF',
  textSecondary: '#9B9BC2',
  textMuted:     '#5A5A80',
  textInverse:   '#0D0D1A',

  cash:    '#00E5C0',
  upi:     '#7C6EF6',
  payCard: '#FF9A3C',
  other:   '#64748B',

  catFood:          '#FF6B6B',
  catTransport:     '#4FACFE',
  catShopping:      '#FF6B9D',
  catEntertainment: '#C44DFF',
  catHealth:        '#00E5C0',
  catEducation:     '#FFD200',
  catUtilities:     '#00B4D8',
  catRent:          '#7C6EF6',
  catGroceries:     '#6BCB77',
  catOther:         '#9B9BC2',

  success: '#00E5C0',
  warning: '#FFD200',
  danger:  '#FF4757',
  info:    '#4FACFE',

  chartColors: ['#7C6EF6', '#00E5C0', '#FF9A3C', '#FF4757', '#6BCB77', '#4FACFE', '#FF6B9D', '#C44DFF', '#00B4D8', '#FFD200'],
  border:      '#21214A',
  borderLight: '#2D2D5A',
  overlay:     'rgba(0,0,0,0.7)',
};

export const lightColors: ThemeColors = {
  background:   '#F0F0FA',
  surface:      '#FFFFFF',
  card:         '#FFFFFF',
  cardElevated: '#F5F5FF',

  primary:      '#6C5CE7',
  primaryLight: '#8B7CF6',
  primaryDark:  '#4E3DC8',
  accent:       '#00C9A7',
  accentLight:  '#00E5C0',

  gradientHero:   ['#6C5CE7', '#00C9A7'],
  gradientPurple: ['#6C5CE7', '#A855F7'],
  gradientGreen:  ['#00C9A7', '#0891B2'],
  gradientOrange: ['#F97316', '#EF4444'],
  gradientPink:   ['#EC4899', '#A855F7'],
  gradientBlue:   ['#3B82F6', '#06B6D4'],
  gradientGold:   ['#F59E0B', '#EAB308'],

  textPrimary:   '#1A1A2E',
  textSecondary: '#4A4A6A',
  textMuted:     '#8888AA',
  textInverse:   '#FFFFFF',

  cash:    '#00C9A7',
  upi:     '#6C5CE7',
  payCard: '#F97316',
  other:   '#64748B',

  catFood:          '#EF4444',
  catTransport:     '#3B82F6',
  catShopping:      '#EC4899',
  catEntertainment: '#A855F7',
  catHealth:        '#00C9A7',
  catEducation:     '#F59E0B',
  catUtilities:     '#0891B2',
  catRent:          '#6C5CE7',
  catGroceries:     '#22C55E',
  catOther:         '#64748B',

  success: '#00C9A7',
  warning: '#F59E0B',
  danger:  '#EF4444',
  info:    '#3B82F6',

  chartColors: ['#6C5CE7', '#00C9A7', '#F97316', '#EF4444', '#22C55E', '#3B82F6', '#EC4899', '#A855F7', '#0891B2', '#F59E0B'],
  border:      '#E2E2F0',
  borderLight: '#EBEBF8',
  overlay:     'rgba(0,0,0,0.4)',
};

export default darkColors;
