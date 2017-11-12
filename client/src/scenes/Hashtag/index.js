import React, { Component } from 'react'
import MdFindInPage from 'react-icons/lib/md/find-in-page'
import api from 'api'
import { getCurrentUserId } from 'utils'
import Sidebar from 'components/Sidebar'
import Scaffold from 'components/Scaffold'
import Content from 'components/Content'
import Feed from 'components/Feed'

class HashtagScene extends Component {
  state = {
    loading: true,
  }

  async componentDidMount() {
    this.activeUser = await api.getUserById(getCurrentUserId())
    const posts = await api.getAllPostsHashtagAsUserId(
      this.props.match.params.hashtag,
      this.activeUser._id
    )

    this.setState({
      loading: false,
      posts,
    })
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
            favorited: postNewState.favorited,
            replied: postNewState.replied,
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

  renderSearch = () => {
    return (
      <div>
        <h2>#{this.props.match.params.hashtag}</h2>
        <Feed
          posts={this.state.posts}
          renderEmpty={() => (
            <div style={{ textAlign: 'center' }}>
              <MdFindInPage size={212} color="#ddd" />
              <p>
                No results for{' '}
                <strong>#{this.props.match.params.hashtag}</strong>.
              </p>
            </div>
          )}
          onFavorite={this.onFavorite}
        />
      </div>
    )
  }

  render() {
    return (
      <Scaffold grid>
        <Sidebar user={this.activeUser} />
        <Content className="content">
          {this.state.loading ? this.renderLoading() : this.renderSearch()}
        </Content>
      </Scaffold>
    )
  }
}

export default HashtagScene
