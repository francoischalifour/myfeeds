import React, { Component } from 'react'
import MdCloudOff from 'react-icons/lib/md/cloud-off'
import { getCurrentUserId } from 'utils'
import api from 'api'
import Scaffold from 'components/Scaffold'
import Content from 'components/Content'
import ProfileSidebar from 'components/ProfileSidebar'
import Feed from 'components/Feed'
import PostForm from 'components/PostForm'

class TimelineScene extends Component {
  state = {
    loading: true,
    error: false,
  }

  async componentDidMount() {
    this.activeUser = await api.getUserById(getCurrentUserId())
    const posts = await api.getAllPosts()

    if (posts.length > 0) {
      this.setState({
        loading: false,
        posts,
      })
    } else {
      this.setState({
        loading: false,
        error: true,
      })
    }
  }

  onSubmit = async text => {
    const post = {
      text,
      user_id: this.activeUser._id,
    }
    const success = !!await api.addPost(post)

    if (success) {
      const posts = await api.getAllPosts()

      this.setState({
        posts,
      })
    }
  }

  renderLoading = () => {
    return (
      <div style={{ textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    )
  }

  renderError = () => {
    return (
      <div style={{ textAlign: 'center' }}>
        <MdCloudOff size={200} color="#bbb" />
        <p>We can't retrieve the timeline for now.</p>
      </div>
    )
  }

  renderTimeline = () => {
    return (
      <Feed
        posts={this.state.posts}
        renderHeader={() => (
          <PostForm {...this.activeUser} onSubmit={this.onSubmit} />
        )}
      />
    )
  }

  render() {
    return (
      <Scaffold grid>
        <ProfileSidebar {...this.activeUser} />
        <Content>
          {this.state.loading
            ? this.renderLoading()
            : this.state.error ? this.renderError() : this.renderTimeline()}
        </Content>
      </Scaffold>
    )
  }
}

export default TimelineScene
