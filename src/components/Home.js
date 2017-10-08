import React, { Component } from 'react'
import { getCurrentUserId } from '../utils'
import { getUserById } from '../api/users'
import Scaffold from './Scaffold'
import Main from './Main'
import ProfileSidebar from './ProfileSidebar'
import Feed from './Feed'
import PostForm from './PostForm'

export default class Home extends Component {
  state = {
    userId: getCurrentUserId(),
  }

  render() {
    const user = getUserById(this.state.userId)

    return (
      <Scaffold grid>
        <ProfileSidebar {...user} />
        <Main>
          <Feed renderHeader={() => <PostForm {...user} />} />
        </Main>
      </Scaffold>
    )
  }
}
