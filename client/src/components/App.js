import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import { isLoggedIn } from 'utils'
import Timeline from 'scenes/Timeline'
import Profile from 'scenes/Profile'
import Post from 'scenes/Post'
import Hashtag from 'scenes/Hashtag'
import Search from 'scenes/Search'
import Login from 'scenes/Login'
import Settings from 'scenes/Settings'
import Header from 'components/Header'
import Logout from 'components/Logout'

const App = () => (
  <Router>
    <div>
      <Header />

      <Switch>
        <Route
          exact
          path="/"
          render={() => (isLoggedIn() ? <Timeline /> : <Login />)}
        />
        <Route exact path="/settings" component={Settings} />
        <Route
          exact
          path="/logout"
          render={() => (isLoggedIn() ? <Logout /> : <Redirect to="/" />)}
        />
        <Route path="/@:username" component={Profile} />
        <Route path="/posts/:postid" component={Post} />
        <Route path="/hashtag/:hashtag" component={Hashtag} />
        <Route path="/search" component={Search} />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </div>
  </Router>
)

export default App
