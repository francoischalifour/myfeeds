import React, { Component } from 'react'
import MdFindInPage from 'react-icons/lib/md/find-in-page'
import api from 'api'
import { getCurrentUserId } from 'utils'
import Sidebar from 'components/Sidebar'
import Scaffold from 'components/Scaffold'
import Content from 'components/Content'
import Feed from 'components/Feed'

class ProfileScene extends Component {
  state = {
    loading: true,
    error: false,
  }

  async componentDidMount() {
    this.activeUser = await api.getUserById(getCurrentUserId())
    const username = this.props.match.params.username
    const user = await api.getUserByUsername(username)

    if (user && user._id) {
      const posts = await api.getAllPostsByUsernameAsUserId(
        username,
        this.activeUser._id
      )

      this.setState({
        loading: false,
        user,
        posts,
      })
    } else {
      this.setState({
        loading: false,
        error: true,
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
            ...postNewState,
          }
        }
        return post
      })

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
        <MdFindInPage size={212} color="#ddd" />

        <p>
          The user <strong>@{this.props.match.params.username}</strong> doesn't
          exist.
        </p>
      </div>
    )
  }

  renderProfile = () => {
    return (
      <Feed
        posts={this.state.posts}
        renderEmpty={() => (
          <div style={{ textAlign: 'center' }}>
            <MdFindInPage size={212} color="#ddd" />
            <p>
              <strong>@{this.state.user.username}</strong> hasn't posted yet.
            </p>
          </div>
        )}
        onFavorite={this.onFavorite}
      />
    )
  }

  render() {
    return (
      <Scaffold grid>
        <Sidebar user={this.state.user} />
        <Content className="content">
          {this.state.loading
            ? this.renderLoading()
            : this.state.error ? this.renderError() : this.renderProfile()}
        </Content>
      </Scaffold>
    )
  }
}

export default ProfileScene
