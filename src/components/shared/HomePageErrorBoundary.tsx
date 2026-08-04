'use client';

import React, { ReactNode, ReactElement } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ERROR BOUNDARY - Catches component crashes and displays graceful fallback
 * Prevents one broken component from crashing the entire page
 */
export class HomePageErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging
    console.error(`[${this.props.name || 'Section'}] Error:`, error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full py-12 px-4 bg-muted rounded-lg border border-destructive/50">
          <div className="container mx-auto text-center">
            <p className="text-destructive font-semibold mb-2">
              ⚠️ Something went wrong loading this section
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {this.state.error?.message || 'Please refresh the page'}
            </p>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left text-xs">
                <summary className="cursor-pointer font-mono text-muted-foreground">
                  Developer Info
                </summary>
                <pre className="mt-2 p-2 bg-background rounded overflow-auto text-destructive">
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
