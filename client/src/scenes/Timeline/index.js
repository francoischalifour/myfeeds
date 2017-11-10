import React, { Component } from 'react'
import { getCurrentUserId } from 'utils'
import api from 'api'
import Scaffold from 'components/Scaffold'
import Content from 'components/Content'
import ProfileSidebar from 'components/ProfileSidebar'
import Feed from 'components/Feed'
import PostForm from 'components/PostForm'

class TimelineScene extends Component {
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
        <Content>
          <Feed
            posts={this.state.posts}
            renderHeader={() => <PostForm {...this.activeUser} />}
          />
        </Content>
      </Scaffold>
    )
  }
}

export default TimelineScene
