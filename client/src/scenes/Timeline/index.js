import React, { Component } from 'react'
import 'intersection-observer'
import Observer from '@researchgate/react-intersection-observer'
import MdCloudOff from 'react-icons/lib/md/cloud-off'
import MdCreate from 'react-icons/lib/md/create'
import { getActiveUser } from 'utils'
import { SITE_TITLE } from '../../constants'
import api from 'api'
import Scaffold from 'components/Scaffold'
import Content from 'components/Content'
import Sidebar from 'components/Sidebar'
import Loader from 'components/Loader'
import Feed from 'components/Feed'
import PostForm from 'components/PostForm'
import PostList from 'components/PostList'
import Post from 'components/Post'
import LoadMoreButton from 'components/LoadMoreButton'

class TimelineScene extends Component {
  static POST_COUNT = 15
  activeUser = getActiveUser()
  state = {
    error: '',
    posts: [],
  }

  async componentDidMount() {
    document.title = SITE_TITLE
    const posts = await api.getAllPosts({
      userId: this.activeUser._id,
      limit: TimelineScene.POST_COUNT,
    })

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

  renderError = error => (
    <div style={{ textAlign: 'center' }}>
      <MdCloudOff size={200} color="#bbb" />
      <p>{error}</p>
    </div>
  )

  renderTimeline = () => (
    <Feed
      name="Timeline"
      posts={this.state.posts}
      limit={TimelineScene.POST_COUNT}
      render={({
        posts,
        onFavorite,
        onItemClick,
        onPostRef,
        onLoadMore,
        onSubmit,
        hasMorePosts,
      }) => (
        <div>
          <div style={{ backgroundColor: '#fff' }}>
            <PostForm {...this.activeUser} onSubmit={onSubmit} />

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
          </div>

          {hasMorePosts && (
            <div style={{ paddingTop: 40, textAlign: 'center' }}>
              <Observer onChange={onLoadMore} rootMargin="0% -25%">
                <LoadMoreButton onClick={onLoadMore}>Load more</LoadMoreButton>
              </Observer>
            </div>
          )}
        </div>
      )}
      renderLoading={() => (
        <div style={{ textAlign: 'center' }}>
          <Loader />
        </div>
      )}
      renderEmpty={() => (
        <div style={{ textAlign: 'center', padding: 24 }}>
          <MdCreate size={200} color="#ddd" />

          <p>Nobody has posted yet. Be the first!</p>
        </div>
      )}
    />
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
