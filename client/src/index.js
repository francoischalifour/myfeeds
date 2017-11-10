import React from 'react'
import ReactDOM from 'react-dom'
import './reset.css'
import './index.css'
import registerServiceWorker from './registerServiceWorker'
import api from 'api'
import App from 'components/App'
import Maintenance from 'scenes/Maintenance'

api.isServerUp().then(isUp => {
  ReactDOM.render(
    isUp ? <App /> : <Maintenance />,
    document.getElementById('root')
  )
  registerServiceWorker()
})
