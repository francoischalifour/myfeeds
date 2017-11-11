import React, { Component } from 'react'
import MdFindInPage from 'react-icons/lib/md/find-in-page'
import api from 'api'
import { getCurrentUserId } from 'utils'
import Sidebar from 'components/Sidebar'
import Scaffold from 'components/Scaffold'
import Content from 'components/Content'
import Feed from 'components/Feed'

class SearchScene extends Component {
  state = {
    loading: true,
  }

  async componentDidMount() {
    const params = new URLSearchParams(this.props.location.search)
    this.search = params.get('q')
    this.activeUser = await api.getUserById(getCurrentUserId())
    // `/` redirects to another route, we need to remove it
    const posts = await api.getAllPostsMatchingAsUserId(
      this.search.replace('/', ' '),
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
        <h2>Results for "{this.search}"</h2>
        <Feed
          posts={this.state.posts}
          renderEmpty={() => (
            <div style={{ textAlign: 'center' }}>
              <MdFindInPage size={212} color="#ddd" />
              <p>
                No results for <strong>{this.search}</strong>.
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
        <Content>
          {this.state.loading ? this.renderLoading() : this.renderSearch()}
        </Content>
      </Scaffold>
    )
  }
}

export default SearchScene
