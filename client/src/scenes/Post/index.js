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
import PostList from 'components/PostList'
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
    error: '',
    isCommentInputFocused: false,
    post: {},
    replies: [],
    favorites: [],
  }
  state = {
    loading: true,
    ...this.initialState,
  }

  componentDidMount() {
    document.title = `Post - ${SITE_TITLE}`
    const postId = this.props.match.params.postid
    this.fetchPost({ postId })
  }

  componentWillReceiveProps(nextProps) {
    const postId = nextProps.match.params.postid
    this.fetchPost({ postId })
  }

  fetchPost = async ({ postId }) => {
    const post = await api.getPostByIdAsUserId(postId, this.activeUser._id)

    if (post && post._id) {
      this.setState({
        loading: false,
        post,
      })

      if (!post.error) {
        const replies = await api.getPostRepliesByIdAsUserId(
          postId,
          this.activeUser._id
        )
        const favorites = await api.getPostFavoritesById(postId)

        this.setState({
          replies,
          favorites: favorites.slice(0, 10),
        })
      } else {
        this.setState({
          replies: [],
          favorites: [],
        })
      }
    } else {
      this.setState({
        loading: false,
        error: "This post doesn't exist",
      })
    }
  }

  onItemClick = ({ postId }) => {
    this.setState({
      ...this.initialState,
    })

    this.props.history.push(`/posts/${postId}`)
    this.fetchPost({ postId })
  }

  onCommentIconClick = () => {
    this.setState({
      isCommentInputFocused: true,
    })
  }

  onPostFavorite = async ({ postId }) => {
    const fav = {
      post_id: postId,
      user_id: this.activeUser._id,
    }

    const success = this.state.post.favorited
      ? await api.unfavorite(fav)
      : await api.favorite(fav)

    if (success) {
      const post = await api.getPostByIdAsUserId(postId, this.activeUser._id)
      const favorites = await api.getPostFavoritesById(postId)
      this.setState({
        post,
        favorites,
      })
    }
  }

  onSubmit = async ({ text }) => {
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
      })
    } else {
      this.setState({
        error: "We can't save your reply.",
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

  renderError = error => {
    return (
      <div style={{ textAlign: 'center' }}>
        <MdFindInPage size={200} color="#bbb" />
        <p>{error}</p>
      </div>
    )
  }

  renderPost = () => {
    return (
      <Container>
        <Post
          {...this.state.post}
          favorites={this.state.favorites}
          onFavorite={this.onPostFavorite}
          onCommentIconClick={this.onCommentIconClick}
        />

        <PostForm
          {...this.activeUser}
          placeholder={`Reply to @${this.state.post.username || ''}`}
          parentId={this.state.post._id}
          isFocused={this.state.isCommentInputFocused}
          onCommentIconBlur={() =>
            this.setState({ isCommentInputFocused: false })}
          onSubmit={this.onSubmit}
        />

        <Feed
          posts={this.state.replies}
          render={({ posts: replies, onFavorite }) => (
            <PostList>
              {replies.map(reply => (
                <li key={reply._id}>
                  <Post
                    {...reply}
                    onFavorite={onFavorite}
                    onItemClick={this.onItemClick}
                  />
                </li>
              ))}
            </PostList>
          )}
          renderLoading={
            this.state.post.reply_count > 0
              ? () => (
                  <div style={{ textAlign: 'center' }}>
                    <MdList size={200} color="#ddd" />
                  </div>
                )
              : null
          }
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
            : this.state.error
              ? this.renderError(this.state.error)
              : this.renderPost()}
        </Content>
      </Scaffold>
    )
  }
}

export default PostScene
