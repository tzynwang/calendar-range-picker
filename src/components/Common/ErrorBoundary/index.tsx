import React, { memo } from 'react'

import { Props, State } from './types'

const INITIAL_STATE: State = {
  hasError: false,
  errorMessage: null,
  callStack: null
}

class ErrorBoundary extends React.Component<Props, State> {
  state: State = INITIAL_STATE

  static getDerivedStateFromError(error: Error) {
    const errorMessage = error.message ? error.message : String(error)

    const callStack = error.stack
      ? error.stack.split('\n').slice(1).join('\n')
      : null

    return {
      callStack,
      errorMessage,
      hasError: true
    }
  }

  render() {
    const { children } = this.props
    const { hasError, errorMessage, callStack } = this.state

    if (hasError) {
      return (
        <main>
          <h1>Oops: {errorMessage}</h1>
          <pre>{callStack}</pre>
        </main>
      )
    }

    return children
  }
}

export default memo(ErrorBoundary)
