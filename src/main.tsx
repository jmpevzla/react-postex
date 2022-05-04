import React from 'react'
import { render } from 'react-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { HelmetProvider } from 'react-helmet-async'
import 'sweetalert2/dist/sweetalert2.min.css'
import './config/axios'
import './index.css'
import App from './App'
import UserProvider from './contexts/userContext'
import HelmetComp from '@/components/HelmetComp'
import ThemeProvider from './contexts/themeContext'

const queryClient = new QueryClient()

render(
  <React.StrictMode>
    <HelmetProvider>
      <HelmetComp title='App' />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
, document.getElementById('root'))