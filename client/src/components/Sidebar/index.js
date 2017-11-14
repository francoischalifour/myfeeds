import React, { Component } from 'react'
import { getActiveUser } from 'utils'
import Sidebar from './Sidebar'

class SidebarContainer extends Component {
  activeUser = getActiveUser()
  state = {
    isFollowing: false,
  }

  async componentWillReceiveProps(nextProps) {
    this.showFollowButton = nextProps.user._id !== this.activeUser._id

    if (this.showFollowButton) {
      const isFollowing = false // TODO: fetch from DB

      this.setState({
        isFollowing,
      })
    }
  }

  onFollow = async () => {
    // TODO: send to DB with `this.props.user._id` and `this.activeUser._id`

    this.setState(state => ({
      isFollowing: !state.isFollowing,
    }))
  }

  render() {
    return (
      <Sidebar
        user={this.props.user}
        showFollowButton={this.showFollowButton}
        isFollowing={this.state.isFollowing}
        onFollow={this.onFollow}
      />
    )
  }
}

export default SidebarContainer
