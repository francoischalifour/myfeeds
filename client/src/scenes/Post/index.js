import React, { Component } from 'react'
import glamorous from 'glamorous'
import MdFindInPage from 'react-icons/lib/md/find-in-page'
import MdList from 'react-icons/lib/md/list'
import { getActiveUser } from 'utils'
import { SITE_TITLE } from '../../constants'
import api from 'api'
import Scaffold from 'components/Scaffold'
import Content from 'components/Content'
import Sidebar from 'components/Sidebar'
import Feed from 'components/Feed'
import Post from 'components/Post'
import PostForm from 'components/PostForm'

const Container = glamorous.div({
  backgroundColor: '#fff',
  boxShadow: '0 1px 4px rgba(0,0,0,.1)',
  ':not(:last-of-type)': {
    borderBottom: '1px solid #e6ecf0',
  },
})

class PostScene extends Component {
  activeUser = getActiveUser()
  initialState = {
    loading: true,
    error: false,
    isCommentInputFocused: false,
    replies: [],
  }
  state = this.initialState

  async componentDidMount() {
    document.title = `Post - ${SITE_TITLE}`
    const postId = this.props.match.params.postid
    this.fetchPost(postId)
  }

  fetchPost = async postId => {
    const post = await api.getPostByIdAsUserId(postId, this.activeUser._id)

    if (post && post._id) {
      this.setState({
        loading: false,
        post,
      })

      if (post.reply_count > 0) {
        const replies = await api.getPostRepliesByIdAsUserId(
          postId,
          this.activeUser._id
        )
        this.setState({
          replies,
        })
      }
    } else {
      this.setState({
        loading: false,
        error: true,
      })
    }
  }

  onItemClick = postId => {
    this.setState({
      ...this.initialState,
      loading: false,
    })

    this.fetchPost(postId)
    this.props.history.push(`/posts/${postId}`)
  }

  onCommentIconClick = () => {
    this.setState({
      isCommentInputFocused: true,
    })
  }

  onFavorite = async postId => {
    const fav = {
      post_id: postId,
      user_id: this.activeUser._id,
    }

    const hasSucceeded = this.state.post.favorited
      ? await api.unfavorite(fav)
      : await api.favorite(fav)

    if (hasSucceeded) {
      const post = await api.getPostByIdAsUserId(postId, this.activeUser._id)
      this.setState(state => ({
        post,
      }))
    }
  }

  onSubmit = async text => {
    const postId = this.state.post._id
    const post = {
      text,
      user_id: this.activeUser._id,
      parent_id: postId,
    }
    const success = !!await api.addPost(post)

    if (success) {
      const replies = await api.getPostRepliesByIdAsUserId(
        postId,
        this.activeUser._id
      )
      const post = await api.getPostByIdAsUserId(postId, this.activeUser._id)

      this.setState({
        replies,
        post,
        hasReplied: true,
      })
    }
  }

  onReplyFavorite = async (postId, hasFavorited) => {
    const fav = {
      post_id: postId,
      user_id: this.activeUser._id,
    }

    const hasSucceeded = hasFavorited
      ? await api.favorite(fav)
      : await api.unfavorite(fav)

    if (hasSucceeded) {
      const replyNewState = await api.getPostByIdAsUserId(
        postId,
        this.activeUser._id
      )
      const replies = this.state.replies.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            reply_count: replyNewState.reply_count,
            star_count: replyNewState.star_count,
            replied: replyNewState.replied,
            favorited: replyNewState.favorited,
          }
        }
        return post
      })

      this.setState({
        replies,
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
        <MdFindInPage size={200} color="#bbb" />
        <p>This post doesn't exist.</p>
      </div>
    )
  }

  renderPost = () => {
    return (
      <Container>
        <Post
          {...this.state.post}
          onFavorite={this.onFavorite}
          onCommentIconClick={this.onCommentIconClick}
        />

        <Feed
          posts={this.state.replies}
          onItemClick={this.onItemClick}
          renderHeader={() => (
            <PostForm
              placeholder={`Reply to @${this.state.post.username || ''}`}
              parentId={this.state.post._id}
              onSubmit={this.onSubmit}
              isFocused={this.state.isCommentInputFocused}
              onCommentIconBlur={() =>
                this.setState({ isCommentInputFocused: false })}
              {...this.activeUser}
            />
          )}
          renderLoading={
            this.state.post.reply_count > 0
              ? () => (
                  <div style={{ textAlign: 'center', padding: 48 }}>
                    <MdList size={200} color="#ddd" />
                  </div>
                )
              : null
          }
          onFavorite={this.onReplyFavorite}
        />
      </Container>
    )
  }

  render() {
    return (
      <Scaffold grid>
        <Sidebar user={this.activeUser} />
        <Content className="content">
          {this.state.loading
            ? this.renderLoading()
            : this.state.error ? this.renderError() : this.renderPost()}
        </Content>
      </Scaffold>
    )
  }
}

export default PostScene
