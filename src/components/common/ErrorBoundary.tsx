import React from 'react'

type ErrorBoundaryProps = {
  children: React.ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'Unexpected UI error',
    }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an exception', error, errorInfo)
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto my-16 w-full max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-2xl font-semibold text-red-700">Something went wrong</h2>
          <p className="mt-3 text-sm text-red-600">{this.state.message}</p>
          <button
            className="mt-6 rounded-xl bg-primary-600 px-4 py-2 text-white"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

