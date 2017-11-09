import React, { Component } from 'react'
import glamorous from 'glamorous'
import { MdFindInPage } from 'react-icons/lib/md'
import { getCurrentUserId } from '../utils'
import api from '../api'
import Scaffold from './Scaffold'
import Main from './Main'
import ProfileSidebar from './ProfileSidebar'
import Post from './Post'
import PostForm from './PostForm'

const PostContainer = glamorous.div({
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

class PostFeed extends Component {
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
        <Main>
          {!this.state.post ? (
            <div style={{ textAlign: 'center' }}>
              <MdFindInPage size={212} color="#ddd" />
              <p>This post doesn't exist.</p>
            </div>
          ) : (
            <PostContainer>
              <Post {...this.state.post} />

              <PostFormContainer>
                <PostForm
                  placeholder={`Reply to @${this.state.post.username || ''}`}
                  parentId={this.state.post._id}
                  {...this.activeUser}
                />
              </PostFormContainer>

              {this.state.replies && (
                <ul>
                  {this.state.replies.map(reply => (
                    <li key={reply._id}>
                      <Post {...reply} />
                    </li>
                  ))}
                </ul>
              )}
            </PostContainer>
          )}
        </Main>
      </Scaffold>
    )
  }
}

export default PostFeed
