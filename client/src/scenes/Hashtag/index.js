import React, { Component } from 'react'
import MdFindInPage from 'react-icons/lib/md/find-in-page'
import api from 'api'
import { getCurrentUserId } from 'utils'
import ProfileSidebar from 'components/ProfileSidebar'
import Scaffold from 'components/Scaffold'
import Content from 'components/Content'
import Feed from 'components/Feed'

class HashtagScene extends Component {
  state = {
    user: {},
    posts: [],
  }

  async componentDidMount() {
    const user = await api.getUserById(getCurrentUserId())
    const posts = await api.getAllPostsHashtag(this.props.match.params.hashtag)

    this.setState({
      user,
      posts,
    })
  }

  render() {
    return (
      <Scaffold grid>
        <ProfileSidebar {...this.state.user} />
        <Content>
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
        </Content>
      </Scaffold>
    )
  }
}

export default HashtagScene
