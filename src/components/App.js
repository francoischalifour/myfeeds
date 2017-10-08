import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { getUserById } from '../api/users'
import { getCurrentUserId } from '../utils'
import Home from './Home'
import Login from './Login'
import Header from './Header'
import Settings from './Settings'
import Profile from './Profile'
import Hashtag from './Hashtag'

const isLoggedIn = !!getUserById(getCurrentUserId())

const App = () => (
  <Router>
    <div>
      <Header />

      <Route
        exact
        path="/"
        render={() => (isLoggedIn ? <Home /> : <Login />)}
      />
      <Route exact path="/settings" component={Settings} />
      <Route path="/@:username" component={Profile} />
      <Route path="/hashtag/:hashtag" component={Hashtag} />
    </div>
  </Router>
)

export default App
