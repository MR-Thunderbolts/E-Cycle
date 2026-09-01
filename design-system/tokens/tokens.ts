/**
 * E-Cycle Design System - Design Tokens
 * 
 * Central source of truth for design tokens used throughout the application.
 */

export const COLORS = {
  // Brand Primary
  primary: {
    DEFAULT: '#004D40', // Deep Forest Teal
    dark: '#00382E',    // Darker Container Teal
    light: '#00695C',   // Lighter Teal
    surface: '#D0EBE8', // Mint Tint for containers/cards
    surfaceLight: '#E0F2F1',
  },

  // Brand Accent
  accent: {
    DEFAULT: '#1DE9B6', // Bright Mint / Neon Aqua
    glow: 'rgba(29, 233, 182, 0.4)',
  },

  // Brand Secondary
  secondary: {
    DEFAULT: '#A6F8F2', // Soft Cyan
    light: '#E0FBF9',
  },

  // Neutrals - Light Mode
  light: {
    background: '#F5F8F8',
    surface: '#FFFFFF',
    surfaceSubtle: '#F8FAFC',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
  },

  // Neutrals - Dark Mode
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    surfaceSubtle: '#252525',
    border: '#2D2D2D',
    borderLight: '#383838',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
  },

  // Feedback & Semantic Colors
  semantic: {
    success: '#10B981',
    successBg: '#ECFDF5',
    warning: '#F59E0B',
    warningBg: '#FEF3C7',
    error: '#EF4444',
    errorBg: '#FEF2F2',
    info: '#3B82F6',
    infoBg: '#EFF6FF',
    points: '#F59E0B',
    pointsGold: '#FFC107',
  },

  // Gamification Level Tokens
  levels: {
    Descubridor: {
      name: 'Descubridor',
      theme: 'slate',
      main: '#64748B',
      accent: '#94A3B8',
      lightBg: '#F1F5F9',
      darkBg: 'rgba(100, 116, 139, 0.15)',
      border: '#CBD5E1',
      badge: 'bg-slate-600 text-white',
      multiplier: 1.0,
      pointsThreshold: 0,
      achievementsThreshold: 0,
    },
    Ensamblador: {
      name: 'Ensamblador',
      theme: 'teal',
      main: '#004D40',
      accent: '#1DE9B6',
      lightBg: '#D0EBE8',
      darkBg: 'rgba(0, 77, 64, 0.25)',
      border: '#99F6E4',
      badge: 'bg-primary text-white',
      multiplier: 1.2,
      pointsThreshold: 1000,
      achievementsThreshold: 2,
    },
    Recolector: {
      name: 'Recolector',
      theme: 'amber',
      main: '#D97706',
      accent: '#F59E0B',
      lightBg: '#FEF3C7',
      darkBg: 'rgba(217, 119, 6, 0.2)',
      border: '#FDE68A',
      badge: 'bg-amber-500 text-white',
      multiplier: 1.5,
      pointsThreshold: 2500,
      achievementsThreshold: 3,
    },
    Reactivador: {
      name: 'Reactivador',
      theme: 'indigo',
      main: '#4F46E5',
      accent: '#6366F1',
      lightBg: '#EEF2FF',
      darkBg: 'rgba(79, 70, 229, 0.2)',
      border: '#C7D2FE',
      badge: 'bg-indigo-600 text-white',
      multiplier: 2.0,
      pointsThreshold: 5000,
      achievementsThreshold: 4,
    },
  },
} as const;

export const TYPOGRAPHY = {
  fontFamily: {
    sans: ['"Plus Jakarta Sans"', 'sans-serif'],
  },
  fontSize: {
    '2xs': '0.625rem',  // 10px
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
} as const;

export const SPACING = {
  containerMax: '430px', // Mobile viewport constraint
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    card: '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.02)',
    floating: '0 10px 25px -5px rgba(0, 77, 64, 0.2), 0 8px 10px -6px rgba(0, 77, 64, 0.1)',
    glow: '0 0 20px rgba(29, 233, 182, 0.35)',
  },
} as const;

export const ANIMATIONS = {
  spring: {
    type: 'spring',
    damping: 25,
    stiffness: 300,
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;
