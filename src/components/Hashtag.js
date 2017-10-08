import React, { Component } from 'react'
import { getUserById } from '../api/users'
import { getCurrentUserId } from '../utils'
import ProfileSidebar from './ProfileSidebar'
import Scaffold from './Scaffold'
import Main from './Main'
import Feed from './Feed'

export default class Hashtag extends Component {
  render() {
    const currentUser = getUserById(getCurrentUserId())
    const hashtag = this.props.match.params.hashtag

    return (
      <Scaffold grid>
        <ProfileSidebar {...currentUser} />
        <Main>
          <h2>#{hashtag}</h2>
          <Feed containing={`#${hashtag}`} />
        </Main>
      </Scaffold>
    )
  }
}
