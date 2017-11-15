import React, { Component } from 'react'
import MdFindInPage from 'react-icons/lib/md/find-in-page'
import api from 'api'
import { getActiveUser } from 'utils'
import Sidebar from 'components/Sidebar'
import Scaffold from 'components/Scaffold'
import Content from 'components/Content'
import Loader from 'components/Loader'
import Feed from 'components/Feed'
import PostList from 'components/PostList'
import Post from 'components/Post'

class SearchScene extends Component {
  activeUser = getActiveUser()
  state = {
    posts: [],
  }

  async componentDidMount() {
    const params = new URLSearchParams(this.props.location.search)
    this.search = params.get('q')

    // `/` redirects to another route, we need to remove it
    const posts = await api.getAllPostsMatching({
      query: this.search.replace('/', ' '),
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
          <h2>Results for "{this.search}"</h2>
          {this.state.posts.length > 0 && (
            <p style={{ color: '#777' }}>
              Found {this.state.posts.length} result{this.state.posts.length >
                1 && 's'}.
            </p>
          )}

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
                <Loader />
              </div>
            )}
            renderEmpty={() => (
              <div style={{ textAlign: 'center' }}>
                <MdFindInPage size={200} color="#ddd" />

                <p>
                  No results for <strong>{this.search}</strong>.
                </p>
              </div>
            )}
          />
        </Content>
      </Scaffold>
    )
  }
}

export default SearchScene
