import React from 'react'
import { getCurrentUserId } from '../utils'
import { getUserById } from '../api/users'
import Scaffold from './Scaffold'
import Main from './Main'
import ProfileSidebar from './ProfileSidebar'
import Feed from './Feed'
import PostForm from './PostForm'

const Home = () => {
  const user = getUserById(getCurrentUserId())

  return (
    <Scaffold grid>
      <ProfileSidebar {...user} />
      <Main>
        <Feed renderHeader={() => <PostForm {...user} />} />
      </Main>
    </Scaffold>
  )
}

export default Home
