'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.reportError(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    if (hasError && resetOnPropsChange && resetKeys) {
      const hasResetKeyChanged = resetKeys.some((key, index) => 
        key !== prevProps.resetKeys?.[index]
      );

      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  
  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    try {
      if (typeof window !== 'undefined' && 'Sentry' in window) {
        const Sentry = (window as { Sentry: { captureException: (error: Error, options: unknown) => void } }).Sentry;
        Sentry.captureException(error, {
          contexts: {
            react: {
              componentStack: errorInfo.componentStack,
            },
          },
          tags: {
            errorBoundary: true,
            errorId: this.state.errorId,
          },
        });
      }

      // Google Analytics отключен для избежания ошибок
      // if (typeof window !== 'undefined' && 'gtag' in window) {
      //   const gtag = (window as { gtag: (...args: unknown[]) => void }).gtag;
      //   gtag('event', 'exception', {
      //     description: error.message,
      //     fatal: false,
      //     custom_map: {
      //       errorId: this.state.errorId,
      //     },
      //   });
      // }
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    });
  };

  private handleRetry = () => {
    this.resetErrorBoundary();
  };

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  private handleCopyError = async () => {
    if (!this.state.error || !this.state.errorInfo) return;

    const errorDetails = {
      message: this.state.error.message,
      stack: this.state.error.stack,
      componentStack: this.state.errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
      alert('Информация об ошибке скопирована в буфер обмена');
    } catch (err) {
      console.error('Failed to copy error details:', err);
      alert('Не удалось скопировать информацию об ошибке');
    }
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, className = '' } = this.props;

    if (hasError && error) {
      if (fallback) {
        return fallback(error, errorInfo!);
      }

      return (
        <div className={`error-boundary ${className}`}>
          <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="h-8 w-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>

                <h2 className="mt-6 text-2xl font-bold text-gray-900">
                  Что-то пошло не так
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  Произошла непредвиденная ошибка. Мы уже работаем над её исправлением.
                </p>

                <div className="mt-4 p-3 bg-gray-100 rounded-md">
                  <p className="text-xs text-gray-500">
                    ID ошибки: <code className="font-mono">{this.state.errorId}</code>
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={this.handleRetry}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Попробовать снова
                  </button>

                  <button
                    onClick={this.handleReload}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Перезагрузить страницу
                  </button>

                  <button
                    onClick={this.handleCopyError}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Скопировать информацию об ошибке
                  </button>
                </div>

                {typeof window !== 'undefined' && window.location.hostname === 'localhost' && errorInfo && (
                  <details className="mt-6 text-left">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                      Детали ошибки (только для разработки)
                    </summary>
                    <div className="mt-2 p-3 bg-gray-100 rounded-md">
                      <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-40">
                        {error.stack}
                        {'\n\n'}
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  </details>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
}
