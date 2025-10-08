/**
 * Color utility functions for generating theme color shades
 */

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to hex color
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Lighten a color by mixing it with white
 * @param rgb - RGB color values
 * @param amount - Amount to lighten (0-1, where 1 is full white)
 */
function lighten(rgb: { r: number; g: number; b: number }, amount: number): { r: number; g: number; b: number } {
  return {
    r: rgb.r + (255 - rgb.r) * amount,
    g: rgb.g + (255 - rgb.g) * amount,
    b: rgb.b + (255 - rgb.b) * amount,
  };
}

/**
 * Darken a color by mixing it with black
 * @param rgb - RGB color values
 * @param amount - Amount to darken (0-1, where 1 is full black)
 */
function darken(rgb: { r: number; g: number; b: number }, amount: number): { r: number; g: number; b: number } {
  return {
    r: rgb.r * (1 - amount),
    g: rgb.g * (1 - amount),
    b: rgb.b * (1 - amount),
  };
}

/**
 * Generate a color palette from a base hex color
 * Creates shades from 50 (lightest) to 950 (darkest) similar to Tailwind's color system
 *
 * @param hex - Base hex color (e.g., "#10b981")
 * @returns Object with keys 50, 100, 200, ..., 900, 950 mapping to hex colors
 */
export function generateColorShades(hex: string): Record<number, string> {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    // Fallback to green if invalid hex
    return generateColorShades('#10b981');
  }

  // Tailwind-like shade generation
  // Base color (500) is the input
  // Lighter shades (50-400) mix with white
  // Darker shades (600-950) mix with black

  const l50 = lighten(rgb, 0.95);
  const l100 = lighten(rgb, 0.9);
  const l200 = lighten(rgb, 0.75);
  const l300 = lighten(rgb, 0.5);
  const l400 = lighten(rgb, 0.25);
  const d600 = darken(rgb, 0.2);
  const d700 = darken(rgb, 0.4);
  const d800 = darken(rgb, 0.6);
  const d900 = darken(rgb, 0.75);
  const d950 = darken(rgb, 0.9);

  const shades = {
    50: rgbToHex(l50.r, l50.g, l50.b),
    100: rgbToHex(l100.r, l100.g, l100.b),
    200: rgbToHex(l200.r, l200.g, l200.b),
    300: rgbToHex(l300.r, l300.g, l300.b),
    400: rgbToHex(l400.r, l400.g, l400.b),
    500: hex, // Base color
    600: rgbToHex(d600.r, d600.g, d600.b),
    700: rgbToHex(d700.r, d700.g, d700.b),
    800: rgbToHex(d800.r, d800.g, d800.b),
    900: rgbToHex(d900.r, d900.g, d900.b),
    950: rgbToHex(d950.r, d950.g, d950.b),
  };

  return shades;
}

/**
 * Get contrast text color (black or white) for a given background color
 * Useful for ensuring readability
 */
export function getContrastColor(hex: string): 'black' | 'white' {
  const rgb = hexToRgb(hex);
  if (!rgb) return 'black';

  // Calculate relative luminance (WCAG formula)
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  return luminance > 0.5 ? 'black' : 'white';
}
