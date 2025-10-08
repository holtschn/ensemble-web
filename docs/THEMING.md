# Theming System Documentation

## Overview

The application uses a dynamic theming system that allows users to customize the brand visualization through Payload CMS settings. The theme is built on Tailwind CSS 4.0 with CSS custom properties for runtime color generation.

## Architecture

### Core Components

1. **Payload Settings** (`src/payload/globals/Settings.ts`)
   - Stores theme configuration (fontFamily, highlightColor)
   - Accessible through Payload admin panel
   - Defaults: Lexend font, #10b981 (emerald) highlight color

2. **Color Generation** (`src/next/utils/colors.ts`)
   - Generates 11 color shades (50-950) from hex color
   - Uses HSL color space for consistent brightness levels
   - Supports lightening and darkening operations

3. **Theme Provider** (`src/next/components/ThemeProvider.tsx`)
   - Server component that injects CSS variables
   - Fetches settings from Payload
   - Generates primary color shades dynamically
   - Wraps application layout

4. **Global Styles** (`src/app/(pages)/globals.css`)
   - Defines semantic color palettes
   - Component classes for consistent styling
   - Theme-aware with CSS custom properties

## Configuration

### Payload Settings

Edit theme configuration in Payload admin at `/admin/globals/settings`:

- **Font Family**: Choose between Lexend (modern sans-serif) or Lekton (monospace)
- **Highlight Color**: Hex color code (e.g., #10b981) for primary theme color

### Color Palettes

The system uses semantic color names:

- **Primary** (`--color-primary-*`): Dynamic brand color from settings
- **Neutral** (`--color-neutral-*`): Gray scale for text and borders
- **Danger** (`--color-danger-*`): Red for errors and destructive actions
- **Success** (`--color-success-*`): Green for success states
- **Amber** (`--color-amber-*`): Yellow-orange for warnings

Each palette has 11 shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

## Component Classes

### Buttons

#### Button Variants
```html
<!-- Primary: Highlight color background, high contrast -->
<button class="btn-primary">Save</button>

<!-- Secondary: Neutral gray background -->
<button class="btn-secondary">Cancel</button>

<!-- Ghost: Transparent background, hover effect -->
<button class="btn-ghost">Reset</button>

<!-- Danger: Red background for destructive actions -->
<button class="btn-danger">Delete</button>
```

#### Button Sizes
```html
<button class="btn-primary btn-sm">Small</button>
<button class="btn-primary btn-md">Medium</button>
<button class="btn-primary btn-lg">Large</button>
```

### Form Inputs

```html
<!-- Text input -->
<input class="input" type="text" />

<!-- Input with error state -->
<input class="input input-error" type="text" />

<!-- Input label -->
<label class="input-label">Name</label>

<!-- Helper text -->
<p class="input-helper">Enter your full name</p>

<!-- Error message -->
<p class="input-error-text">This field is required</p>
```

### Tables

```html
<table class="table">
  <thead>
    <tr class="table-header">
      <th class="table-cell">Name</th>
      <th class="table-cell">Email</th>
    </tr>
  </thead>
  <tbody>
    <tr class="table-row">
      <td class="table-cell">John Doe</td>
      <td class="table-cell">john@example.com</td>
    </tr>
  </tbody>
</table>
```

### Cards

```html
<!-- Basic card -->
<div class="card">
  <h2 class="card-header">Title</h2>
  <div class="card-body">Content</div>
</div>
```

### Badges

```html
<span class="badge">New</span>
<span class="badge-primary">Featured</span>
<span class="badge-success">Active</span>
<span class="badge-danger">Urgent</span>
```

### Links

```html
<a href="#" class="link">Regular Link</a>
<a href="#" class="link-muted">Muted Link</a>
```

## Dynamic Theming

### Using CSS Custom Properties

Components can reference dynamic colors using CSS variables:

```tsx
// Radio button with dynamic accent color
<input
  type="radio"
  className="w-4 h-4 border-neutral-300 focus:ring-2"
  style={{ accentColor: 'var(--color-primary-500)' }}
/>
```

### Color Variables

Access theme colors in inline styles or custom CSS:

```css
/* Primary colors (dynamic from settings) */
var(--color-primary-50)   /* Lightest */
var(--color-primary-500)  /* Base color */
var(--color-primary-950)  /* Darkest */

/* Neutral colors (static gray scale) */
var(--color-neutral-50)
var(--color-neutral-500)
var(--color-neutral-950)

/* Semantic colors */
var(--color-danger-600)
var(--color-success-600)
var(--color-amber-600)
```

## Migration Guide

### From Inline Tailwind to Theme Classes

#### Before (Inline Styles)
```tsx
<button className="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-md">
  Save
</button>
```

#### After (Theme Classes)
```tsx
<button className="btn-primary btn-md">
  Save
</button>
```

### Color Mapping

| Old Class | New Class |
|-----------|-----------|
| `text-gray-*` | `text-neutral-*` |
| `bg-gray-*` | `bg-neutral-*` |
| `border-gray-*` | `border-neutral-*` |
| `text-blue-*` | `text-primary-*` |
| `bg-blue-*` | `bg-primary-*` |
| `border-blue-*` | `border-primary-*` |
| `text-green-*` | `text-success-*` |
| `bg-green-*` | `bg-success-*` |
| `text-red-*` | `text-danger-*` |
| `bg-red-*` | `bg-danger-*` |

### Common Patterns

#### Input Fields
```tsx
// Before
<input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

// After
<input className="input" />
```

#### Checkboxes/Radio Buttons
```tsx
// Before
<input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />

// After
<input
  type="checkbox"
  className="w-4 h-4 border-neutral-300 rounded focus:ring-2"
  style={{ accentColor: 'var(--color-primary-500)' }}
/>
```

#### Error Messages
```tsx
// Before
<p className="mt-1 text-sm text-red-600">This field is required</p>

// After
<p className="input-error-text">This field is required</p>
```

## Best Practices

### 1. Use Semantic Classes

Prefer semantic component classes over inline Tailwind utilities:

✅ Good:
```tsx
<button className="btn-primary">Save</button>
```

❌ Avoid:
```tsx
<button className="bg-primary-100 text-primary-800 hover:bg-primary-200 px-4 py-2 rounded-md">
  Save
</button>
```

### 2. Use Neutral for Grayscale

Always use `neutral-*` instead of `gray-*`:

✅ Good:
```tsx
<p className="text-neutral-600">Description text</p>
```

❌ Avoid:
```tsx
<p className="text-gray-600">Description text</p>
```

### 3. Use Primary for Brand Colors

Use `primary-*` for brand-related elements:

✅ Good:
```tsx
<div className="border-l-4 border-primary-500">Featured</div>
```

❌ Avoid:
```tsx
<div className="border-l-4 border-blue-500">Featured</div>
```

### 4. Leverage CSS Variables for Dynamic Colors

For elements that need dynamic theming (like form controls):

```tsx
<input
  type="checkbox"
  style={{ accentColor: 'var(--color-primary-500)' }}
/>
```

### 5. Maintain Consistency

Use the provided component classes consistently across the application:
- Buttons: Always use `btn-*` classes
- Inputs: Always use `input` class
- Tables: Always use `table`, `table-header`, `table-row`, `table-cell`

## Extending the Theme

### Adding New Component Classes

Edit `src/app/(pages)/globals.css` to add new component classes:

```css
@layer components {
  .my-custom-component {
    @apply rounded-lg shadow-md;
    background-color: var(--color-primary-50);
    border: 1px solid var(--color-primary-200);
  }
}
```

### Adding New Color Palettes

To add a new semantic color palette:

1. Define colors in `@theme` block in globals.css:
   ```css
   @theme {
     --color-info-50: #eff6ff;
     --color-info-500: #3b82f6;
     --color-info-950: #172554;
     /* Add all 11 shades */
   }
   ```

2. Use in component classes:
   ```css
   .badge-info {
     @apply px-2 py-1 rounded-full text-xs font-medium;
     background-color: var(--color-info-100);
     color: var(--color-info-800);
   }
   ```

## Technical Details

### Server-Side Theme Injection

The ThemeProvider is a Server Component that:
1. Fetches theme settings from Payload
2. Generates color shades using HSL transformations
3. Injects CSS variables into the component tree
4. Updates automatically when settings change

### Color Generation Algorithm

The color generation uses HSL color space for better perceptual uniformity:

1. Convert hex to RGB to HSL
2. Generate lighter shades by increasing lightness
3. Generate darker shades by decreasing lightness
4. Maintain consistent saturation for brand identity
5. Convert back to hex for CSS variables

### Tailwind CSS 4.0 Limitations

**Important**: Tailwind CSS 4.0 does not allow `@apply` to reference other custom classes. This means you cannot do:

```css
/* ❌ This will NOT work */
.btn {
  @apply px-4 py-2 rounded-md;
}

.btn-primary {
  @apply btn bg-primary-100;
}
```

Instead, use this pattern:

```css
/* ✅ This works */
.btn-primary, .btn-secondary {
  @apply px-4 py-2 rounded-md;
}

.btn-primary {
  background-color: var(--color-primary-100);
  color: var(--color-primary-800);
}
```

## Troubleshooting

### Colors Not Updating

If theme colors don't update after changing settings:
1. Clear Next.js cache: `rm -rf .next`
2. Restart dev server: `npm run dev`
3. Verify settings are saved in Payload admin

### Build Errors with @apply

If you get errors like "Cannot apply unknown utility class":
- Don't use `@apply` to reference other custom classes
- Duplicate utility classes or use direct CSS properties

### TypeScript Errors with Settings

If you get "settings.theme is possibly undefined":
- Always use optional chaining: `settings.theme?.highlightColor`
- Provide fallback values: `settings.theme?.highlightColor || '#10b981'`

## Future Enhancements

Potential improvements to the theming system:

1. **Multiple Brand Presets**: Define multiple pre-configured themes
2. **Dark Mode**: Add dark mode support with theme switching
3. **Color Contrast Validation**: Ensure WCAG compliance
4. **Theme Preview**: Live preview in Payload admin
5. **CSS Variable Export**: Export theme as CSS file
6. **Component Storybook**: Visual component library

## Summary

The theming system provides:
- ✅ User-configurable brand colors through Payload CMS
- ✅ Consistent component styling with semantic classes
- ✅ Dynamic color generation from a single hex value
- ✅ Reduced code duplication with component classes
- ✅ Type-safe integration with TypeScript
- ✅ Server-side rendering support
- ✅ Easy maintenance and extension

For questions or issues, refer to the main project documentation in `CLAUDE.md`.
