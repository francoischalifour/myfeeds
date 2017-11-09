import React, { Component } from 'react'
import { MdFindInPage } from 'react-icons/lib/md'
import api from '../api'
import { getCurrentUserId } from '../utils'
import ProfileSidebar from './ProfileSidebar'
import Scaffold from './Scaffold'
import Main from './Main'
import Feed from './Feed'

class Profile extends Component {
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
          <Main style={{ textAlign: 'center' }}>
            <MdFindInPage size={212} color="#eceff1" />

            <p>
              The user <strong>@{this.props.match.params.username}</strong>{' '}
              doesn't exist.
            </p>
          </Main>
        </Scaffold>
      )
    }

    return (
      <Scaffold grid>
        <ProfileSidebar {...this.state.user} />
        <Main>
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
        </Main>
      </Scaffold>
    )
  }
}

export default Profile
