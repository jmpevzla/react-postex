import React from 'react'
import ReactDOM from 'react-dom'
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'

import './index.css'
import "sweetalert2/dist/sweetalert2.min.css"
import App from './App'

// Create a client
const queryClient = new QueryClient()

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
