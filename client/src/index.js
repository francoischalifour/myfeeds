import React from 'react'
import ReactDOM from 'react-dom'
import './reset.css'
import './index.css'
import registerServiceWorker from './registerServiceWorker'
import App from './components/App'

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
