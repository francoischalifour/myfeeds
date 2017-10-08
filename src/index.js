import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './reset.css'
import './index.css'
import registerServiceWorker from './registerServiceWorker'
import { getUserById } from './api/users'
import { getCurrentUserId } from './utils'
import App from './App'
import Login from './Login'
import Header from './Header'
import Settings from './Settings'
import Profile from './Profile'
import Hashtag from './Hashtag'

const isLoggedIn = !!getUserById(getCurrentUserId())

ReactDOM.render(
  <Router>
    <div>
      <Header />

      <Route exact path="/" render={() => (isLoggedIn ? <App /> : <Login />)} />
      <Route exact path="/settings" component={Settings} />
      <Route path="/@:username" component={Profile} />
      <Route path="/hashtag/:hashtag" component={Hashtag} />
    </div>
  </Router>,
  document.getElementById('root')
)
registerServiceWorker()
