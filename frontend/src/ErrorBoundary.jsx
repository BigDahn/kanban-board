import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.log(error);
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      // Render any custom fallback UI
      console.log(this.state.hasError);
      return (
        this.props.fallback || (
          <div className="max-w-screen bg-primary-400 dark:bg-secondary-100 min-h-screen mx-auto flex justify-center items-center flex-col gap-[3em] font-plus-jakarta-sans">
            <h1 className="text-white capitalize dark:text-black font-semibold text-[24px]">
              Something went wrong.
            </h1>
            <button
              onClick={this.resetError}
              className="text-white bg-primary-100 h-[50px] w-[170px] cursor-pointer rounded-sm"
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
