import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { getUserByUsername } from '../api/users'
import ProfileSidebar from './ProfileSidebar'
import Scaffold from './Scaffold'
import Main from './Main'
import Feed from './Feed'

export default class Profile extends Component {
  render() {
    const user = getUserByUsername(this.props.match.params.username)

    return !user ? (
      <Scaffold textAlign="center">
        <p>This user doesn't exist.</p>

        <Link to="/" className="button">
          Back home
        </Link>
      </Scaffold>
    ) : (
      <Scaffold grid>
        <ProfileSidebar {...user} />
        <Main>
          <Feed from={user.username} />
        </Main>
      </Scaffold>
    )
  }
}
