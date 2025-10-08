'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component to catch and handle React errors.
 *
 * Features:
 * - Catches errors in child components
 * - Displays fallback UI when error occurs
 * - Logs errors to console (prepared for future logging service)
 * - Optional custom error handler
 * - Reset capability to retry rendering
 *
 * Usage:
 * ```tsx
 * import { ErrorBoundary } from '@/next/components/errorBoundary';
 * import { ErrorFallback } from '@/next/components/errorFallback';
 *
 * <ErrorBoundary fallback={<ErrorFallback />}>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 *
 * With custom error handler:
 * ```tsx
 * <ErrorBoundary
 *   fallback={<ErrorFallback />}
 *   onError={(error, errorInfo) => {
 *     // Send to logging service
 *     console.error('Error caught:', error, errorInfo);
 *   }}
 * >
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise use default
      if (this.props.fallback) {
        // Clone fallback element and pass reset function if it accepts onReset prop
        if (React.isValidElement(this.props.fallback)) {
          return React.cloneElement(this.props.fallback as React.ReactElement<any>, {
            onReset: this.resetErrorBoundary,
            error: this.state.error,
          });
        }
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex items-center justify-center min-h-[400px] p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Etwas ist schiefgelaufen</h2>
            <p className="text-gray-600 mb-4">Ein unerwarteter Fehler ist aufgetreten.</p>
            <button
              onClick={this.resetErrorBoundary}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Erneut versuchen
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
