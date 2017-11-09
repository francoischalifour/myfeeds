import React, { Component } from 'react'
import { getCurrentUserId } from '../utils'
import api from '../api'
import Scaffold from './Scaffold'
import Main from './Main'
import ProfileSidebar from './ProfileSidebar'
import Feed from './Feed'
import PostForm from './PostForm'

class Home extends Component {
  state = {
    posts: [],
  }

  async componentDidMount() {
    this.activeUser = await api.getUserById(getCurrentUserId())
    const posts = await api.getAllPosts()

    this.setState({
      posts,
    })
  }

  render() {
    return (
      <Scaffold grid>
        <ProfileSidebar {...this.activeUser} />
        <Main>
          <Feed
            posts={this.state.posts}
            renderHeader={() => <PostForm {...this.activeUser} />}
          />
        </Main>
      </Scaffold>
    )
  }
}

export default Home
