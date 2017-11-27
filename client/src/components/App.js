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
import Settings from 'scenes/Settings'
import Moments from 'scenes/Moments'
import Login from 'scenes/Login'
import Signup from 'scenes/Signup'
import Navbar from 'components/Navbar'
import Logout from 'components/Logout'

const isConnected = isLoggedIn()

const App = () => (
  <Router>
    <div>
      <Navbar isLoggedIn={isConnected} />

      <Switch>
        {isConnected
          ? [
              <Route exact path="/" component={Timeline} key="Timeline" />,
              <Route exact path="/moments" component={Moments} key="Moments" />,
              <Route
                exact
                path="/settings"
                component={Settings}
                key="Settings"
              />,
              <Route exact path="/logout" component={Logout} key="Logout" />,
              <Route path="/@:username" component={Profile} key="Profile" />,
              <Route path="/posts/:postid" component={Post} key="Post" />,
              <Route
                path="/hashtag/:hashtag"
                component={Hashtag}
                key="Hashtag"
              />,
              <Route path="/search" component={Search} key="Search" />,
            ]
          : [
              <Route exact path="/" component={Login} key="Login" />,
              <Route exact path="/signup" component={Signup} key="Signup" />,
            ]}

        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </div>
  </Router>
)

export default App
