import React from 'react'
import { render } from 'react-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { HelmetProvider } from 'react-helmet-async'
import './config/axios'
import 'sweetalert2/dist/sweetalert2.min.css'
import './index.css'
import App from './App'
import UserProvider from './contexts/userContext'
import HelmetComp from '@/components/HelmetComp'

const queryClient = new QueryClient()

render(
  <React.StrictMode>
    <HelmetProvider>
      <HelmetComp title='App' />
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <App />
        </UserProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
, document.getElementById('root'))