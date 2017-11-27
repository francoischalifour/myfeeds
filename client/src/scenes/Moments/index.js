import React, { Component } from 'react'
import glamorous from 'glamorous'
import api from 'api'
import { getLocalUser } from 'utils'
import { SITE_TITLE } from '../../constants'
import Scaffold from 'components/Scaffold'
import Content from 'components/Content'
import Sidebar from 'components/Sidebar'
import Loader from 'components/Loader'
import Feed from 'components/Feed'
import PostList from 'components/PostList'
import Post from 'components/Post'

const ColumnList = glamorous.div({
  display: 'flex',
  marginTop: '2rem',
  '& > div:not(:last-of-type)': {
    marginRight: '1rem',
  },
})

const Small = glamorous.small({
  fontSize: '1rem',
  color: '#777',
  fontWeight: 'normal',
  '&::before': {
    content: ' · ',
  },
})

class Moments extends Component {
  activeUser = getLocalUser()
  state = {
    popularPosts: [],
    bestPosts: [],
    controversedPosts: [],
  }

  async componentDidMount() {
    document.title = `Moments - ${SITE_TITLE}`

    const popularPosts = await api.getPopularPosts({
      userId: this.activeUser._id,
    })

    this.setState({
      popularPosts,
    })

    const bestPosts = await api.getBestPosts({
      userId: this.activeUser._id,
    })

    this.setState({
      bestPosts,
    })

    const controversedPosts = await api.getControversedPosts({
      userId: this.activeUser._id,
    })

    this.setState({
      controversedPosts,
    })
  }

  render() {
    return (
      <Scaffold grid>
        <Sidebar user={this.activeUser} />
        <Content className="content">
          <h2>
            Popular posts <Small>most commented and liked</Small>
          </h2>

          <Feed
            posts={this.state.popularPosts}
            render={({
              posts,
              onFavorite,
              onItemClick,
              onPostRef,
              onSubmit,
            }) => (
              <div style={{ backgroundColor: '#fff' }}>
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
            )}
            renderLoading={() => (
              <div style={{ textAlign: 'center' }}>
                <Loader />
              </div>
            )}
            renderEmpty={() => (
              <div style={{ textAlign: 'center', padding: 24 }}>
                <p>No posts to show.</p>
              </div>
            )}
          />

          <ColumnList>
            <div>
              <h2>
                Best posts <Small>most liked</Small>
              </h2>

              <Feed
                posts={this.state.bestPosts}
                render={({
                  posts,
                  onFavorite,
                  onItemClick,
                  onPostRef,
                  onSubmit,
                }) => (
                  <div style={{ backgroundColor: '#fff' }}>
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
                )}
                renderLoading={() => (
                  <div style={{ textAlign: 'center' }}>
                    <Loader />
                  </div>
                )}
                renderEmpty={() => (
                  <div style={{ textAlign: 'center', padding: 24 }}>
                    <p>No posts to show.</p>
                  </div>
                )}
              />
            </div>
            <div>
              <h2>
                Controversed posts <Small>most commented</Small>
              </h2>

              <Feed
                posts={this.state.controversedPosts}
                render={({
                  posts,
                  onFavorite,
                  onItemClick,
                  onPostRef,
                  onSubmit,
                }) => (
                  <div style={{ backgroundColor: '#fff' }}>
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
                )}
                renderLoading={() => (
                  <div style={{ textAlign: 'center' }}>
                    <Loader />
                  </div>
                )}
                renderEmpty={() => (
                  <div style={{ textAlign: 'center', padding: 24 }}>
                    <p>No posts to show.</p>
                  </div>
                )}
              />
            </div>
          </ColumnList>
        </Content>
      </Scaffold>
    )
  }
}

export default Moments
