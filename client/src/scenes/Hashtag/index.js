import React, { Component } from 'react'
import MdFindInPage from 'react-icons/lib/md/find-in-page'
import MdList from 'react-icons/lib/md/list'
import api from 'api'
import { getActiveUser } from 'utils'
import { SITE_TITLE } from '../../constants'
import Sidebar from 'components/Sidebar'
import Scaffold from 'components/Scaffold'
import Content from 'components/Content'
import Feed from 'components/Feed'
import PostList from 'components/PostList'
import Post from 'components/Post'

class HashtagScene extends Component {
  activeUser = getActiveUser()
  state = {
    posts: [],
  }

  async componentDidMount() {
    document.title = `#${this.props.match.params.hashtag} - ${SITE_TITLE}`
    const posts = await api.getAllPostsHashtag({
      query: this.props.match.params.hashtag,
      userId: this.activeUser._id,
    })

    this.setState({
      posts,
    })
  }

  render() {
    return (
      <Scaffold grid>
        <Sidebar user={this.activeUser} />
        <Content className="content">
          <h2>#{this.props.match.params.hashtag}</h2>

          <Feed
            posts={this.state.posts}
            render={({ posts, onFavorite, onItemClick }) => (
              <PostList>
                {posts.map(post => (
                  <li key={post._id}>
                    <Post
                      {...post}
                      onFavorite={onFavorite}
                      onItemClick={onItemClick}
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
              <div style={{ textAlign: 'center' }}>
                <MdFindInPage size={200} color="#ddd" />

                <p>
                  No results for{' '}
                  <strong>#{this.props.match.params.hashtag}</strong>.
                </p>
              </div>
            )}
          />
        </Content>
      </Scaffold>
    )
  }
}

export default HashtagScene
