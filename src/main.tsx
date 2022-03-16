import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import "sweetalert2/dist/sweetalert2.min.css"
import App from './App'
import List from './posts/List'

ReactDOM.render(
  <React.StrictMode>
    <List />
  </React.StrictMode>,
  document.getElementById('root')
)
