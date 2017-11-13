import React, { Component } from 'react'
import MdCloudOff from 'react-icons/lib/md/cloud-off'
import MdList from 'react-icons/lib/md/list'
import MdCreate from 'react-icons/lib/md/create'
import { getActiveUser } from 'utils'
import { SITE_TITLE } from '../../constants'
import api from 'api'
import Scaffold from 'components/Scaffold'
import Content from 'components/Content'
import Sidebar from 'components/Sidebar'
import Feed from 'components/Feed'
import PostForm from 'components/PostForm'
import PostList from 'components/PostList'
import Post from 'components/Post'

class TimelineScene extends Component {
  activeUser = getActiveUser()
  state = {
    error: '',
    posts: [],
  }

  async componentDidMount() {
    document.title = SITE_TITLE
    const posts = await api.getAllPostsAsUserId(this.activeUser._id)

    if (Array.isArray(posts)) {
      this.setState({
        posts,
      })
    } else {
      this.setState({
        error: "We can't retrieve the timeline for now.",
      })
    }
  }

  onSubmit = async ({ text }) => {
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
    } else {
      this.setState({
        error: "We can't save your post.",
      })
    }
  }

  renderError = error => (
    <div style={{ textAlign: 'center' }}>
      <MdCloudOff size={200} color="#bbb" />
      <p>{error}</p>
    </div>
  )

  renderTimeline = () => (
    <div style={{ backgroundColor: 'white' }}>
      <PostForm {...this.activeUser} onSubmit={this.onSubmit} />

      <Feed
        name="Timeline"
        posts={this.state.posts}
        render={({ posts, onFavorite, onItemClick, onPostRef }) => (
          <PostList>
            {posts.map(post => (
              <li key={post._id}>
                <Post
                  {...post}
                  onFavorite={onFavorite}
                  onItemClick={onItemClick}
                  ref={onPostRef}
                />
              </li>
            ))}
          </PostList>
        )}
        renderLoading={() => (
          <div style={{ textAlign: 'center' }}>
            <MdList size={200} color="#ddd" />
          </div>
        )}
        renderEmpty={() => (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <MdCreate size={200} color="#ddd" />

            <p>Nobody has posted yet. Be the first!</p>
          </div>
        )}
      />
    </div>
  )

  render() {
    return (
      <Scaffold grid>
        <Sidebar user={this.activeUser} />
        <Content className="content">
          {this.state.error
            ? this.renderError(this.state.error)
            : this.renderTimeline()}
        </Content>
      </Scaffold>
    )
  }
}

export default TimelineScene
