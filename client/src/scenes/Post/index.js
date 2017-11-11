import React, { Component } from 'react'
import glamorous from 'glamorous'
import MdFindInPage from 'react-icons/lib/md/find-in-page'
import { getCurrentUserId } from 'utils'
import api from 'api'
import Scaffold from 'components/Scaffold'
import Content from 'components/Content'
import ProfileSidebar from 'components/ProfileSidebar'
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
  state = {
    post: {},
    hasReplied: false,
    hasFavorited: false,
    replies: [],
  }

  async componentDidMount() {
    this.activeUser = await api.getUserById(getCurrentUserId())
    const postId = this.props.match.params.postid
    const post = await api.getPostById(postId)
    const replies = await api.getPostRepliesById(postId)
    const userMetadata = await api.getUserPostData({
      post_id: postId,
      user_id: this.activeUser._id,
    })

    this.setState({
      post,
      replies,
      hasReplied: userMetadata.replied,
      hasFavorited: userMetadata.favorited,
    })
  }

  onFavorite = async postId => {
    const fav = {
      post_id: postId,
      user_id: this.activeUser._id,
    }

    const hasSucceeded = this.state.hasFavorited
      ? await api.unfavorite(fav)
      : await api.favorite(fav)

    if (hasSucceeded) {
      const post = await api.getPostById(postId)
      this.setState(state => ({
        hasFavorited: !state.hasFavorited,
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
      const replies = await api.getPostRepliesById(postId)
      const post = await api.getPostById(postId)

      this.setState({
        replies,
        post,
        hasReplied: true,
      })
    }
  }

  render() {
    return (
      <Scaffold grid>
        <ProfileSidebar {...this.activeUser} />
        <Content>
          {!this.state.post ? (
            <div style={{ textAlign: 'center' }}>
              <MdFindInPage size={212} color="#ddd" />
              <p>This post doesn't exist.</p>
            </div>
          ) : (
            <Container>
              <Post
                {...this.state.post}
                hasReplied={this.state.hasReplied}
                hasFavorited={this.state.hasFavorited}
                onFavorite={this.onFavorite}
              />

              <Feed
                posts={this.state.replies}
                renderHeader={() => (
                  <PostForm
                    placeholder={`Reply to @${this.state.post.username || ''}`}
                    parentId={this.state.post._id}
                    onSubmit={this.onSubmit}
                    {...this.activeUser}
                  />
                )}
              />
            </Container>
          )}
        </Content>
      </Scaffold>
    )
  }
}

export default PostScene
