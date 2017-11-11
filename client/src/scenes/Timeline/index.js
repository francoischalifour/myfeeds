import React, { Component } from 'react'
import MdCloudOff from 'react-icons/lib/md/cloud-off'
import MdList from 'react-icons/lib/md/list'
import { getCurrentUserId } from 'utils'
import api from 'api'
import Scaffold from 'components/Scaffold'
import Content from 'components/Content'
import Sidebar from 'components/Sidebar'
import Feed from 'components/Feed'
import PostForm from 'components/PostForm'

class TimelineScene extends Component {
  state = {
    error: false,
  }

  async componentDidMount() {
    this.activeUser = await api.getUserById(getCurrentUserId())
    const posts = await api.getAllPosts()

    if (posts && posts.length > 0) {
      this.setState({
        posts,
      })
    } else {
      this.setState({
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
        renderLoading={() => (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <MdList size={200} color="#ddd" />
          </div>
        )}
      />
    )
  }

  render() {
    return (
      <Scaffold grid>
        <Sidebar user={this.activeUser} />
        <Content>
          {this.state.error ? this.renderError() : this.renderTimeline()}
        </Content>
      </Scaffold>
    )
  }
}

export default TimelineScene
