export const themes = {
  light: {
    bg: '#F9FAFB',
    sidebar: '#FFFFFF',
    card: '#FFFFFF',
    panel: '#FFFFFF',
    border: '#E5E7EB',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    accent: '#2BB3A3',
    accentHover: '#249A8C',
    premium: '#FF9900',
    premiumHover: '#E68A00',
    hover: '#F3F4F6',
    input: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.05)',
  },
  dark: {
    bg: '#0B1220',
    sidebar: '#0F172A',
    card: '#111827',
    panel: '#111827',
    border: '#1F2937',
    textPrimary: '#E5E7EB',
    textSecondary: '#9CA3AF',
    accent: '#2BB3A3',
    accentHover: '#249A8C',
    premium: '#FF9900',
    premiumHover: '#E68A00',
    hover: '#1F2937',
    input: '#1F2937',
    shadow: 'rgba(0, 0, 0, 0.3)',
  }
};

export type Theme = 'light' | 'dark';

export const getSystemTheme = (): Theme => {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem('terra-theme') as Theme;
  return stored || getSystemTheme();
};

export const setStoredTheme = (theme: Theme) => {
  localStorage.setItem('terra-theme', theme);
};
