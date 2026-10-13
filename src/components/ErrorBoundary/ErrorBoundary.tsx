import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

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
                <div
                    role="alert"
                    style={{
                        minHeight: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 24,
                        background: 'var(--surface-page)',
                        fontFamily: 'var(--font-sans)',
                    }}
                >
                    <div className="ec-prompt" style={{ width: '100%', maxWidth: 400 }}>
                        <div className="ec-iconbox ec-iconbox--xl ec-iconbox--danger">
                            <Icon name="error" filled />
                        </div>
                        <h1 className="ec-prompt__title">Algo salió mal</h1>
                        <p className="ec-prompt__desc">Lo sentimos, ocurrió un error inesperado. Por favor, intenta nuevamente.</p>
                        {import.meta.env.DEV && this.state.error && (
                            <pre
                                style={{
                                    margin: 0,
                                    width: '100%',
                                    padding: 12,
                                    borderRadius: 12,
                                    background: 'var(--surface-inset)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: 12,
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-all',
                                    textAlign: 'left',
                                }}
                            >
                                {this.state.error.toString()}
                            </pre>
                        )}
                        <Button size="lg" fullWidth onClick={this.handleReset}>
                            Volver al inicio
                        </Button>
                    </div>
                </div>
            );
        }

        return (this.props as Props).children;
    }
}
