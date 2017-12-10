import React, { Component } from 'react'
import PropTypes from 'prop-types'
import api from 'api'
import { getLocalUser } from 'utils'
import Sidebar from './Sidebar'

class SidebarContainer extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
  }

  activeUser = getLocalUser()
  state = {}

  async componentWillReceiveProps(nextProps) {
    this.showFollowButton = nextProps.user._id !== this.activeUser._id

    this.setState({ ...nextProps.user })
  }

  onFollow = async () => {
    const follow = {
      followerId: this.activeUser._id,
      userId: this.props.user._id,
    }

    const success = this.state.followed
      ? await api.unfollow(follow)
      : await api.follow(follow)

    if (success) {
      this.setState(state => ({
        followed: !state.followed,
      }))
    }
  }

  render() {
    return (
      <Sidebar
        user={this.props.user}
        followed={this.state.followed}
        showFollowButton={this.showFollowButton}
        onFollow={this.onFollow}
      />
    )
  }
}

export default SidebarContainer
