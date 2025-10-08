import React from 'react';

import { getSettings } from '@/next/utils/settings';
import { generateColorShades } from '@/next/utils/colors';

/**
 * ThemeProvider component that injects CSS custom properties for dynamic theming
 * based on Payload Settings configuration.
 *
 * This component generates color shades from the configured highlight color and
 * makes them available throughout the application via CSS variables.
 */
export async function ThemeProvider({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const highlightColor = settings.theme?.highlightColor || '#10b981';

  // Generate color shades (50-950) from base highlight color
  const colorShades = generateColorShades(highlightColor);

  // Build CSS custom properties object
  const cssVariables: Record<string, string> = {};
  Object.entries(colorShades).forEach(([shade, color]) => {
    cssVariables[`--color-primary-${shade}`] = color;
  });

  return (
    <div style={cssVariables as React.CSSProperties}>
      {children}
    </div>
  );
}
