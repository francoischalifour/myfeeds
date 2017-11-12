import React, { Component } from 'react'
import MdCloudOff from 'react-icons/lib/md/cloud-off'
import MdList from 'react-icons/lib/md/list'
import { getCurrentUserId } from 'utils'
import { SITE_TITLE } from '../../constants'
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
    document.title = SITE_TITLE

    this.activeUser = await api.getUserById(getCurrentUserId())
    const posts = await api.getAllPostsAsUserId(this.activeUser._id)

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
      const posts = await api.getAllPostsAsUserId(this.activeUser._id)

      this.setState({
        posts,
      })
    }
  }

  onFavorite = async (postId, hasFavorited) => {
    const fav = {
      post_id: postId,
      user_id: this.activeUser._id,
    }

    const hasSucceeded = hasFavorited
      ? await api.favorite(fav)
      : await api.unfavorite(fav)

    if (hasSucceeded) {
      const postNewState = await api.getPostByIdAsUserId(
        postId,
        this.activeUser._id
      )
      const posts = this.state.posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            reply_count: postNewState.reply_count,
            star_count: postNewState.star_count,
            replied: postNewState.replied,
            favorited: postNewState.favorited,
          }
        }
        return post
      })

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
        onFavorite={this.onFavorite}
      />
    )
  }

  render() {
    return (
      <Scaffold grid>
        <Sidebar user={this.activeUser} />
        <Content className="content">
          {this.state.error ? this.renderError() : this.renderTimeline()}
        </Content>
      </Scaffold>
    )
  }
}

export default TimelineScene
