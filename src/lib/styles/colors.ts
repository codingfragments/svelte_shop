// Catppuccin Macchiato Color Palette
export const colors = {
  // Base colors
  base: '#24273a',
  mantle: '#1e2030',
  crust: '#181926',
  
  // Surface colors
  surface0: '#363a4f',
  surface1: '#494d64',
  surface2: '#5b6078',
  
  // Overlay colors
  overlay0: '#6e738d',
  overlay1: '#8087a2',
  overlay2: '#939ab7',
  
  // Text colors
  subtext0: '#a5adcb',
  subtext1: '#b8c0e0',
  text: '#cad3f5',
  
  // Accent colors
  rosewater: '#f4dbd6',
  flamingo: '#f0c6c6',
  pink: '#f5bde6',
  mauve: '#c6a0f6',
  red: '#ed8796',
  maroon: '#ee99a0',
  peach: '#f5a97f',
  yellow: '#eed49f',
  green: '#a6da95',
  teal: '#8bd5ca',
  sky: '#91d7e3',
  sapphire: '#7dc4e4',
  blue: '#8aadf4',
  lavender: '#b7bdf8'
} as const;

// Theme configuration for components
export const theme = {
  // Background variants
  bg: {
    primary: colors.base,
    secondary: colors.mantle,
    tertiary: colors.crust,
    elevated: colors.surface0,
    card: colors.surface1,
    hover: colors.surface2
  },
  
  // Text variants
  text: {
    primary: colors.text,
    secondary: colors.subtext1,
    muted: colors.subtext0,
    accent: colors.mauve,
    error: colors.red,
    success: colors.green,
    warning: colors.yellow
  },
  
  // Border variants
  border: {
    default: colors.overlay0,
    hover: colors.overlay1,
    focus: colors.mauve,
    success: colors.green,
    error: colors.red
  },
  
  // Brand colors
  brand: {
    primary: colors.mauve,
    secondary: colors.lavender,
    accent: colors.pink,
    highlight: colors.peach
  }
} as const;