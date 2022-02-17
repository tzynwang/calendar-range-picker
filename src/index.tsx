import React from 'react'
import ReactDOM from 'react-dom'

import App from '@Components/App'
import ErrorBoundary from '@Components/Common/ErrorBoundary'

import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
)
