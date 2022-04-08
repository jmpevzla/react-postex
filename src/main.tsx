import React from 'react'
import { render } from 'react-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import './config/axios'
import 'sweetalert2/dist/sweetalert2.min.css'
import App from './App'
import UserProvider from './contexts/userContext'

const queryClient = new QueryClient()

render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <App />
      </UserProvider>
    </QueryClientProvider>
  </React.StrictMode>
, document.getElementById('root'))