# Phase 1 Infrastructure - Usage Guide

This document provides examples and best practices for using the infrastructure components implemented in Phase 1.

## Components Overview

### 1. Toast Notifications (Sonner)

**Location:** `src/next/components/ToastProvider.tsx`

**Integration:** Already integrated in main app layout (`src/app/(pages)/layout.tsx`)

**Usage:**

```tsx
import { toast } from 'sonner';

// Success notification
toast.success('Noten erfolgreich gespeichert');

// Error notification
toast.error('Fehler beim Laden der Daten');

// Info notification
toast.info('Datei wird heruntergeladen...');

// Promise toast (for async operations)
const saveData = async () => {
  // ... your async code
};

toast.promise(saveData(), {
  loading: 'Wird gespeichert...',
  success: 'Erfolgreich gespeichert',
  error: 'Fehler beim Speichern',
});

// Custom duration
toast.success('Nachricht', { duration: 5000 });
```

**Features:**
- Auto-dismisses after 4 seconds (configurable)
- Position: bottom-right
- Close button included
- Rich colors for different types

---

### 2. Confirmation Dialog

**Location:** `src/next/components/ConfirmDialog.tsx`

**Usage:**

```tsx
import { ConfirmDialog } from '@/next/components/ConfirmDialog';
import { useState } from 'react';

function YourComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    // Perform delete action
    console.log('Deleted!');
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Löschen
      </button>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Eintrag löschen?"
        message="Möchten Sie diesen Eintrag wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
        confirmText="Löschen"
        cancelText="Abbrechen"
        variant="danger"
      />
    </>
  );
}
```

**Variants:**
- `danger` (red) - For destructive actions
- `warning` (yellow) - For potentially risky actions
- `info` (blue) - For informational confirmations

**Features:**
- Native HTML dialog element
- Accessible (ARIA labels, ESC to close)
- Backdrop click to close
- Focus trap
- Keyboard navigation

---

### 3. Error Boundary

**Location:** `src/next/components/ErrorBoundary.tsx`

**Integration:** Already integrated in internal area layout (`src/app/(pages)/intern/layout.tsx`)

**Usage (for additional boundaries):**

```tsx
import { ErrorBoundary } from '@/next/components/ErrorBoundary';
import { ErrorFallback } from '@/next/components/ErrorFallback';

function Page() {
  return (
    <ErrorBoundary
      fallback={
        <ErrorFallback
          title="Fehler beim Laden der Noten"
          message="Die Notendatenbank konnte nicht geladen werden."
          showErrorDetails={process.env.NODE_ENV === 'development'}
        />
      }
      onError={(error, errorInfo) => {
        // Optional: Send to logging service
        console.error('Error:', error, errorInfo);
      }}
    >
      <YourComponent />
    </ErrorBoundary>
  );
}
```

**Features:**
- Catches React errors in child components
- Displays fallback UI
- Logs errors to console
- Optional custom error handler
- Reset/retry capability

---

### 4. Error Fallback

**Location:** `src/next/components/ErrorFallback.tsx`

**Usage:**

```tsx
import { ErrorFallback } from '@/next/components/ErrorFallback';

// Default usage
<ErrorFallback />

// Custom message
<ErrorFallback
  title="Fehler beim Laden"
  message="Die Daten konnten nicht geladen werden."
/>

// Show error details (development only)
<ErrorFallback
  showErrorDetails={process.env.NODE_ENV === 'development'}
/>
```

**Props:**
- `error` - The error object (auto-passed by ErrorBoundary)
- `onReset` - Reset function (auto-passed by ErrorBoundary)
- `title` - Custom title
- `message` - Custom message
- `showErrorDetails` - Show stack trace (for development)

---

### 5. Empty State

**Location:** `src/next/components/EmptyState.tsx`

**Usage:**

```tsx
import { EmptyState } from '@/next/components/EmptyState';

// No search results
<EmptyState
  variant="no-results"
  icon="search"
  heading="Keine Ergebnisse"
  message="Keine Noten gefunden, die Ihrer Suche entsprechen."
/>

// Empty list with action
<EmptyState
  variant="no-data"
  icon="music"
  heading="Noch keine Noten vorhanden"
  message="Erstellen Sie Ihren ersten Eintrag."
  action={{
    label: 'Eintrag anlegen',
    onClick: () => router.push('/intern/ndb/new')
  }}
/>

// Error state
<EmptyState
  variant="error"
  icon="alert-circle"
  heading="Fehler beim Laden"
  message="Die Daten konnten nicht geladen werden."
  action={{
    label: 'Erneut versuchen',
    onClick: () => refetch()
  }}
/>

// Custom content
<EmptyState
  icon="folder"
  heading="Keine Setlists"
  message="Erstellen Sie Ihre erste Setlist."
>
  <div className="mt-4">
    {/* Custom content */}
  </div>
</EmptyState>
```

**Variants:**
- `no-results` - For search with no results (gray)
- `no-data` - For empty lists (blue)
- `error` - For error states (red)

**Icons:**
- `search`, `file`, `music`, `folder`, `alert-circle`, `info`

---

### 6. User Preferences System

**Location:**
- Utilities: `src/next/ndb/utils/preferences.ts`
- Hooks: `src/next/ndb/hooks/useUserPreference.ts`

**Architecture:**
- **Primary storage:** Payload Preferences API (syncs across devices)
- **Cache layer:** localStorage (fast reads, offline fallback)
- **Flow:** Load from Payload → cache to localStorage → immediate localStorage updates + async Payload saves

#### Single Preference Hook

```tsx
import { useUserPreference } from '@/next/ndb/hooks/useUserPreference';

function Component() {
  const [columnPrefs, setColumnPrefs, isLoading] = useUserPreference(
    'ndb_column_preferences',
    {
      title: true,
      composer: true,
      arranger: true,
    }
  );

  // Update preference
  const toggleColumn = (column: string) => {
    setColumnPrefs({
      ...columnPrefs,
      [column]: !columnPrefs[column],
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={columnPrefs.title}
          onChange={() => toggleColumn('title')}
        />
        Titel
      </label>
      {/* More checkboxes... */}
    </div>
  );
}
```

#### Multiple Preferences Hook

```tsx
import { useUserPreferences } from '@/next/ndb/hooks/useUserPreference';

function Component() {
  const [prefs, updatePrefs, isLoading] = useUserPreferences({
    ndb_column_preferences: { title: true, composer: true },
    ndb_active_filters: {},
  });

  // Access values
  const columns = prefs.ndb_column_preferences;
  const filters = prefs.ndb_active_filters;

  // Update single preference
  updatePrefs('ndb_column_preferences', newColumns);

  // Update multiple preferences at once
  updatePrefs({
    ndb_column_preferences: newColumns,
    ndb_active_filters: newFilters,
  });

  return <div>{/* ... */}</div>;
}
```

#### Server-Side Preference Functions

```tsx
// In a server component or server action
import {
  getUserPreference,
  setUserPreference,
  getUserPreferences,
  setUserPreferences,
  deleteUserPreference,
  clearUserPreferences,
} from '@/next/ndb/utils/preferences';

// Get single preference
const value = await getUserPreference(userId, 'ndb_column_preferences');

// Set single preference
await setUserPreference(userId, 'ndb_column_preferences', { title: true });

// Get multiple preferences
const prefs = await getUserPreferences(userId, [
  'ndb_column_preferences',
  'ndb_active_filters',
]);

// Set multiple preferences
await setUserPreferences(userId, {
  ndb_column_preferences: { title: true },
  ndb_active_filters: {},
});

// Delete preference
await deleteUserPreference(userId, 'ndb_column_preferences');

// Clear all preferences
await clearUserPreferences(userId);
```

**Logged-out Users:**
- Preferences are stored in localStorage only
- No sync across devices
- Automatically switches to Payload when user logs in

**Standard Preference Keys:**
- `ndb_column_preferences` - Table column visibility configuration
- `ndb_active_filters` - Active filter state

---

## Best Practices

### Toast Notifications

1. **Use appropriate types:**
   - `success` for completed actions
   - `error` for failures
   - `info` for informational messages
   - `promise` for async operations

2. **Keep messages concise:**
   - Bad: "Die Noten wurden erfolgreich in die Datenbank gespeichert und sind jetzt verfügbar"
   - Good: "Noten erfolgreich gespeichert"

3. **Use promise toasts for async operations:**
   ```tsx
   toast.promise(deleteScore(id), {
     loading: 'Wird gelöscht...',
     success: 'Erfolgreich gelöscht',
     error: 'Fehler beim Löschen',
   });
   ```

### Confirmation Dialogs

1. **Use for destructive actions:**
   - Deleting data
   - Overwriting changes
   - Irreversible operations

2. **Be specific in messages:**
   - Bad: "Sind Sie sicher?"
   - Good: "Möchten Sie diese Setlist wirklich löschen? Alle zugehörigen Besetzungen gehen verloren."

3. **Choose appropriate variants:**
   - `danger` for delete operations
   - `warning` for potentially risky changes
   - `info` for non-destructive confirmations

### Error Boundaries

1. **Wrap key sections:**
   - File upload components
   - Data-heavy tables
   - Complex forms
   - Third-party components

2. **Provide context-specific fallbacks:**
   ```tsx
   <ErrorBoundary
     fallback={
       <ErrorFallback
         title="Fehler beim Laden der Tabelle"
         message="Die Notentabelle konnte nicht geladen werden."
       />
     }
   >
     <ScoresTable />
   </ErrorBoundary>
   ```

3. **Add custom error handlers for logging:**
   ```tsx
   <ErrorBoundary
     onError={(error, errorInfo) => {
       // Send to Sentry, LogRocket, etc.
       logError(error, errorInfo);
     }}
   >
     {children}
   </ErrorBoundary>
   ```

### Empty States

1. **Always provide an action when possible:**
   - Empty list → "Create first item"
   - No search results → "Clear filters"
   - Error → "Try again"

2. **Use appropriate variants:**
   - `no-results` after a search/filter
   - `no-data` for truly empty collections
   - `error` for failed data loads

3. **Be helpful:**
   - Bad: "Keine Daten"
   - Good: "Noch keine Setlists vorhanden. Erstellen Sie Ihre erste Setlist, um loszulegen."

### User Preferences

1. **Use descriptive keys:**
   - Prefix with module: `ndb_*`
   - Use snake_case: `ndb_column_preferences`
   - Be specific: `ndb_scores_table_columns` not `columns`

2. **Provide sensible defaults:**
   ```tsx
   const [prefs, setPrefs] = useUserPreference('ndb_columns', {
     title: true,
     composer: true,
     // Always show important columns by default
   });
   ```

3. **Handle loading state:**
   ```tsx
   const [prefs, setPrefs, isLoading] = useUserPreference('key', defaultValue);

   if (isLoading) {
     return <LoadingSpinner />;
   }
   ```

4. **Batch updates when possible:**
   ```tsx
   // Good: Single update
   updatePrefs({
     ndb_column_preferences: newColumns,
     ndb_active_filters: newFilters,
   });

   // Bad: Multiple updates
   updatePrefs('ndb_column_preferences', newColumns);
   updatePrefs('ndb_active_filters', newFilters);
   ```

---

## Next Steps

Phase 1 infrastructure is complete and ready to use. These components will be leveraged in:

- **Phase 2:** Advanced Table Filtering (column configuration, filters)
- **Phase 3:** Setlist Management (delete confirmations, empty states)
- **Phase 4:** Player Allocations (toasts for save operations)
- **Phase 5:** Payload Integration (error boundaries, confirmations)

All future features should utilize these infrastructure components for consistent UX.
