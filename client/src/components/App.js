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

const isConnected = isLoggedIn()

const App = () => (
  <Router>
    <div>
      <Header isLoggedIn={isConnected} />

      <Switch>
        <Route
          exact
          path="/"
          render={() => (isConnected ? <Timeline /> : <Login />)}
        />

        {isConnected && [
          <Route path="/@:username" component={Profile} key="Profile" />,
          <Route path="/posts/:postid" component={Post} key="Post" />,
          <Route path="/hashtag/:hashtag" component={Hashtag} key="Hashtag" />,
          <Route path="/search" component={Search} key="Search" />,
          <Route exact path="/settings" component={Settings} key="Settings" />,
          <Route exact path="/logout" component={Logout} key="Logout" />,
        ]}

        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </div>
  </Router>
)

export default App
