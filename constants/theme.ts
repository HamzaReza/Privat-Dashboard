// Design tokens — mirrors privat & privat-business design system
// Adapted for Next.js / Tailwind CSS v4 web usage

export const Colors = {
  light: {
    // Primary brand — gold
    primary: "#D4AF37",
    primaryLight: "#E8C468",
    primaryDark: "#B8941F",

    // Backgrounds
    background: "#FAF8F3",
    surface: "#FFFFFF",
    surfaceAlt: "#F3F0E8",
    surfaceElevated: "#FFFFFF",

    // Text
    text: "#1A1A1A",
    textSecondary: "#6B6B6B",
    textTertiary: "#9B9B9B",
    textInverse: "#FFFFFF",

    // Borders
    border: "#E0DDD5",
    borderLight: "#EFEEE9",

    // Status
    success: "#4CAF50",
    successBg: "#F0FAF0",
    warning: "#FF9800",
    warningBg: "#FFF8EE",
    error: "#F44336",
    errorBg: "#FFF0EF",
    info: "#2196F3",
    infoBg: "#EEF6FF",

    // Icon & tabs
    icon: "#4A4A4A",
    tabIconDefault: "#9B9B9B",
    tabIconSelected: "#D4AF37",

    // Category card backgrounds
    categoryBg1: "#C5D5D8",
    categoryBg2: "#8B7355",
    categoryBg3: "#A8AFA0",
    categoryBg4: "#989A95",
    categoryBg5: "#D4D0C8",
    categoryBg6: "#C9B8A0",
    categoryBg7: "#B8B5AC",
    categoryBg8: "#3D5A5C",

    // Glass effects
    glassOverlay: "rgba(28, 28, 30, 0.72)",
    glassBorder: "rgba(255, 255, 255, 0.12)",

    // Shadows
    shadow: "rgba(0, 0, 0, 0.08)",
    shadowMedium: "rgba(0, 0, 0, 0.12)",
    shadowStrong: "rgba(0, 0, 0, 0.2)",
  },
  dark: {
    // Primary brand — gold (unchanged)
    primary: "#D4AF37",
    primaryLight: "#E8C468",
    primaryDark: "#B8941F",

    // Backgrounds
    background: "#0A0A0A",
    surface: "#111111",
    surfaceAlt: "#1A1A1A",
    surfaceElevated: "#1E1E1E",

    // Text
    text: "#F5F5F5",
    textSecondary: "#A0A0A0",
    textTertiary: "#6B6B6B",
    textInverse: "#1A1A1A",

    // Borders
    border: "#2A2A2A",
    borderLight: "#222222",

    // Status
    success: "#4CAF50",
    successBg: "#0D1F0E",
    warning: "#FF9800",
    warningBg: "#1F160A",
    error: "#F44336",
    errorBg: "#1F0C0B",
    info: "#2196F3",
    infoBg: "#0A1420",

    // Icon & tabs
    icon: "#B0B0B0",
    tabIconDefault: "#6B6B6B",
    tabIconSelected: "#D4AF37",

    // Category card backgrounds (decorative — same)
    categoryBg1: "#C5D5D8",
    categoryBg2: "#8B7355",
    categoryBg3: "#A8AFA0",
    categoryBg4: "#989A95",
    categoryBg5: "#D4D0C8",
    categoryBg6: "#C9B8A0",
    categoryBg7: "#B8B5AC",
    categoryBg8: "#3D5A5C",

    // Glass effects
    glassOverlay: "rgba(28, 28, 30, 0.85)",
    glassBorder: "rgba(255, 255, 255, 0.08)",

    // Shadows
    shadow: "rgba(0, 0, 0, 0.3)",
    shadowMedium: "rgba(0, 0, 0, 0.4)",
    shadowStrong: "rgba(0, 0, 0, 0.6)",
  },
};

export const Typography = {
  fontFamily: {
    sans: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
  },
  fontSize: {
    xs: "0.75rem",     // 12px
    sm: "0.875rem",    // 14px
    base: "1rem",      // 16px
    lg: "1.125rem",    // 18px
    xl: "1.25rem",     // 20px
    "2xl": "1.5rem",   // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem",  // 36px
  },
  fontWeight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeight: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.75",
  },
};

export const Spacing = {
  xs: "0.25rem",  // 4px
  sm: "0.5rem",   // 8px
  md: "1rem",     // 16px
  lg: "1.5rem",   // 24px
  xl: "2rem",     // 32px
  "2xl": "3rem",  // 48px
  "3xl": "4rem",  // 64px
};

export const BorderRadius = {
  sm: "0.5rem",  // 8px
  md: "1rem",    // 16px
  lg: "1.5rem",  // 24px
  xl: "2rem",    // 32px
  full: "9999px",
};

export const Shadows = {
  sm: "0 1px 2px rgba(0,0,0,0.05)",
  md: "0 2px 4px rgba(0,0,0,0.08)",
  lg: "0 4px 8px rgba(0,0,0,0.12)",
  xl: "0 8px 16px rgba(0,0,0,0.16)",
};

export const StatusColors = {
  active: "#4CAF50",
  inactive: "#9B9B9B",
  pending: "#FF9800",
  cancelled: "#F44336",
  expired: "#F44336",
  trial: "#2196F3",
};
