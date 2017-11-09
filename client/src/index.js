import React from 'react'
import ReactDOM from 'react-dom'
import './reset.css'
import './index.css'
import registerServiceWorker from './registerServiceWorker'
import App from './components/App'
import Maintenance from './components/Maintenance'
import api from './api'

api.isServerUp().then(isUp => {
  ReactDOM.render(
    isUp ? <App /> : <Maintenance />,
    document.getElementById('root')
  )
  registerServiceWorker()
})
