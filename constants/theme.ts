/**
 * PlayForge Design System - Cyber-Forge Aesthetic
 * Matches the Stitch project design tokens exactly.
 */

export const Colors = {
  // Surface hierarchy (dark-mode only)
  background: '#131313',
  surface: '#131313',
  surfaceDim: '#131313',
  surfaceBright: '#393939',
  surfaceContainerLowest: '#0e0e0e',
  surfaceContainerLow: '#1c1b1b',
  surfaceContainer: '#201f1f',
  surfaceContainerHigh: '#2a2a2a',
  surfaceContainerHighest: '#353534',

  // On-surface
  onSurface: '#e5e2e1',
  onSurfaceVariant: '#ddc1b3',

  // Primary (Neon Orange)
  primary: '#ffb68d',
  primaryContainer: '#ff8a3d',
  onPrimary: '#532200',
  onPrimaryContainer: '#682d00',
  inversePrimary: '#9a4600',

  // Secondary (Cyber Green)
  secondary: '#c5ffca',
  secondaryContainer: '#02f477',
  onSecondary: '#003916',
  onSecondaryContainer: '#006a30',

  // Tertiary (Purple)
  tertiary: '#deb7ff',
  tertiaryContainer: '#c990ff',
  onTertiary: '#4a007f',
  onTertiaryContainer: '#5d009e',

  // Error
  error: '#ffb4ab',
  errorContainer: '#93000a',
  onError: '#690005',
  onErrorContainer: '#ffdad6',

  // Outline
  outline: '#a58c7f',
  outlineVariant: '#564338',

  // Surface tint
  surfaceTint: '#ffb68d',
  surfaceVariant: '#353534',

  // Inverse
  inverseSurface: '#e5e2e1',
  inverseOnSurface: '#313030',

  // Fixed
  primaryFixed: '#ffdbc9',
  primaryFixedDim: '#ffb68d',
  onPrimaryFixed: '#321200',
  onPrimaryFixedVariant: '#763300',
  secondaryFixed: '#64ff91',
  secondaryFixedDim: '#00e46e',
  onSecondaryFixed: '#00210a',
  onSecondaryFixedVariant: '#005323',
  tertiaryFixed: '#f0dbff',
  tertiaryFixedDim: '#deb7ff',
  onTertiaryFixed: '#2c0050',
  onTertiaryFixedVariant: '#670fac',

  // Semantic shorthand
  textPrimary: '#e5e2e1',
  textSecondary: '#a0a0a0',
  textMuted: '#6b6b6b',
  neonOrange: '#ff8a3d',
  cyberGreen: '#29ff80',
  deepOrange: '#D35400',
  cardBorder: '#2a2a2a',
  tabBarBg: 'rgba(28, 27, 27, 0.85)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  containerMargin: 20,
  gutter: 16,
};

export const Radii = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Typography = {
  displayLg: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 36,
    lineHeight: 43,
    letterSpacing: -0.72,
  },
  headlineMd: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 24,
    lineHeight: 31,
  },
  headlineSm: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 20,
    lineHeight: 28,
  },
  bodyLg: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 16,
    lineHeight: 26,
  },
  bodyMd: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
    lineHeight: 21,
  },
  bodySm: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    lineHeight: 18,
  },
  labelMono: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 0.6,
  },
  labelMonoSm: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
  },
} as const;
