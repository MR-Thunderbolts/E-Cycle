import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * ErrorBoundary component to catch and handle React errors gracefully
 * Prevents the entire app from crashing when a component error occurs
 */
export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null
        });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-background dark:bg-dark-bg p-8 text-center">
                    <div className="bg-white dark:bg-dark-surface rounded-[40px] p-12 max-w-md shadow-xl">
                        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-rounded text-red-500 dark:text-red-400 text-5xl">
                                error
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold text-text dark:text-dark-text mb-4">
                            Algo salió mal
                        </h1>

                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Lo sentimos, ocurrió un error inesperado. Por favor, intenta nuevamente.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 mb-6 text-left">
                                <p className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={this.handleReset}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-full transition-colors"
                        >
                            Volver al inicio
                        </button>
                    </div>
                </div>
            );
        }

        return (this.props as Props).children;
    }
}
