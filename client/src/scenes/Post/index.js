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

const PostFormContainer = glamorous.div({
  backgroundColor: '#eee',
  borderTop: '1px solid #ddd',
  borderBottom: '1px solid #ddd',
})

class PostScene extends Component {
  state = {
    post: {},
    replies: [],
  }

  async componentDidMount() {
    this.activeUser = await api.getUserById(getCurrentUserId())
    const postId = this.props.match.params.postid
    const post = await api.getPostById(postId)
    const replies = await api.getPostRepliesById(postId)

    this.setState({
      post,
      replies,
    })
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
              <Post {...this.state.post} />

              <PostFormContainer>
                <PostForm
                  placeholder={`Reply to @${this.state.post.username || ''}`}
                  parentId={this.state.post._id}
                  {...this.activeUser}
                />
              </PostFormContainer>

              <Feed posts={this.state.replies} />
            </Container>
          )}
        </Content>
      </Scaffold>
    )
  }
}

export default PostScene
