const tintColorLight = '#6366f1'; // Indigo 500
const tintColorDark = '#818cf8'; // Indigo 400

export const Colors = {
  light: {
    text: '#0f172a',
    textSecondary: '#64748b',
    background: '#f8fafc',
    card: '#ffffff',
    border: '#e2e8f0',
    tint: tintColorLight,
    tabIconDefault: '#94a3b8',
    tabIconSelected: tintColorLight,
    priority: {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#10b981',
    },
    success: '#10b981',
    danger: '#ef4444',
  },
  dark: {
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    background: '#0f172a',
    card: '#1e293b',
    border: '#334155',
    tint: tintColorDark,
    tabIconDefault: '#64748b',
    tabIconSelected: tintColorDark,
    priority: {
      high: '#f87171',
      medium: '#fbbf24',
      low: '#34d399',
    },
    success: '#34d399',
    danger: '#f87171',
  },
};
