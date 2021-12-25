import React, { ErrorInfo } from "react";

export class WrapperErrorCatch extends React.Component<Record<string, unknown>, { error: string; stack: string; hasError: boolean }> {
  state = {
    stack: "",
    error: "",
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({
      error: error.message,
      stack: info.componentStack,
    });
  }

  render(): React.ReactNode {
    if (this.state.hasError)
      return (
        <pre>
          <p style={{ color: "red", whiteSpace: "pre-wrap" }}>{this.state.error}</p>
          {this.state.stack}
        </pre>
      );
    return this.props.children;
  }
}