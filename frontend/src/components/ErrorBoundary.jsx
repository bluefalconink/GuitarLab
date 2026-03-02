import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * React Error Boundary — catches render errors and shows a friendly fallback
 * instead of a blank screen.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gsb-dark flex items-center justify-center p-6">
          <div className="bg-gsb-surface rounded-2xl p-8 max-w-md w-full text-center">
            <AlertTriangle className="mx-auto mb-4 text-gsb-accent" size={48} />
            <h2 className="text-xl font-bold text-gray-100 mb-2">Something went wrong</h2>
            <p className="text-gray-400 text-sm mb-6">
              GuitarLab hit an unexpected error. Don't worry — your guitar is still in tune!
            </p>
            <button
              onClick={this.handleReset}
              className="px-6 py-2.5 bg-gsb-gold text-gsb-dark rounded-xl font-semibold
                         hover:bg-gsb-gold/90 transition-colors"
            >
              Try Again
            </button>
            {this.state.error && (
              <pre className="mt-4 text-xs text-left text-red-400 bg-gsb-darker rounded-lg p-3 overflow-x-auto">
                {this.state.error.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
