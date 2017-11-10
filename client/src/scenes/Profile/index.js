import React, { Component } from 'react'
import MdFindInPage from 'react-icons/lib/md/find-in-page'
import api from 'api'
import { getCurrentUserId } from 'utils'
import ProfileSidebar from 'components/ProfileSidebar'
import Scaffold from 'components/Scaffold'
import Content from 'components/Content'
import Feed from 'components/Feed'

class ProfileScene extends Component {
  state = {
    user: {},
    posts: [],
  }

  async componentDidMount() {
    this.activeUser = await api.getUserById(getCurrentUserId())
    const username = this.props.match.params.username
    const user = await api.getUserByUsername(username)
    const posts = await api.getAllPostsByUsername(username)

    this.setState({
      user,
      posts,
    })
  }

  render() {
    if (!this.state.user) {
      return (
        <Scaffold grid>
          <ProfileSidebar {...this.activeUser} />
          <Content style={{ textAlign: 'center' }}>
            <MdFindInPage size={212} color="#ddd" />

            <p>
              The user <strong>@{this.props.match.params.username}</strong>{' '}
              doesn't exist.
            </p>
          </Content>
        </Scaffold>
      )
    }

    return (
      <Scaffold grid>
        <ProfileSidebar {...this.state.user} />
        <Content>
          <Feed
            posts={this.state.posts}
            renderEmpty={() => (
              <div style={{ textAlign: 'center' }}>
                <MdFindInPage size={212} color="#ddd" />
                <p>
                  <strong>@{this.state.user.username}</strong> hasn't posted
                  yet.
                </p>
              </div>
            )}
          />
        </Content>
      </Scaffold>
    )
  }
}

export default ProfileScene
