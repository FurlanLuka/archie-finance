import React from 'react';

interface ErrorBoundaryState {
  error: any;
  errorInfo: any;
}

export class ErrorBoundary extends React.Component<
  unknown,
  ErrorBoundaryState
> {
  constructor(props: Record<string, unknown>) {
    super(props);

    this.state = { error: null, errorInfo: null };
  }

  override componentDidCatch(error: any, errorInfo: any) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  override render() {
    if (this.state.error) {
      return (
        <div className="generic-error-box">
          <h1>Something went wrong...</h1>
        </div>
      );
    }

    return this.props.children;
  }
}
