import React, { Component } from 'react'
import { getActiveUser } from 'utils'
import Sidebar from './Sidebar'
import Loading from './Loading'

class SidebarContainer extends Component {
  activeUser = getActiveUser()
  state = {
    loading: true,
    isFollowing: false,
  }

  async componentWillReceiveProps(nextProps) {
    this.showFollowButton = nextProps.user._id !== this.activeUser._id

    this.setState({
      loading: false,
    })

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
    if (this.state.loading) {
      return <Loading />
    }

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
