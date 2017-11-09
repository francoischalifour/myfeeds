import React, { Component } from 'react'
import MdFindInPage from 'react-icons/lib/md/find-in-page'
import api from '../api'
import { getCurrentUserId } from '../utils'
import ProfileSidebar from './ProfileSidebar'
import Scaffold from './Scaffold'
import Main from './Main'
import Feed from './Feed'

class Hashtag extends Component {
  state = {
    user: {},
    posts: [],
  }

  async componentDidMount() {
    const user = await api.getUserById(getCurrentUserId())
    const posts = await api.getAllPostsMatching(
      `${this.props.match.params.hashtag}`
    )

    this.setState({
      user,
      posts,
    })
  }

  render() {
    return (
      <Scaffold grid>
        <ProfileSidebar {...this.state.user} />
        <Main>
          <h2>#{this.props.match.params.hashtag}</h2>
          <Feed
            posts={this.state.posts}
            renderEmpty={() => (
              <div style={{ textAlign: 'center' }}>
                <MdFindInPage size={212} color="#ddd" />
                <p>
                  No results for{' '}
                  <strong>#{this.props.match.params.hashtag}</strong>.
                </p>
              </div>
            )}
          />
        </Main>
      </Scaffold>
    )
  }
}

export default Hashtag
