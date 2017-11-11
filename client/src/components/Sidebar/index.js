import React, { Component } from 'react'
import { getCurrentUserId } from 'utils'
import api from 'api'
import Sidebar from './Sidebar'
import Loading from './Loading'

class SidebarContainer extends Component {
  state = {
    loading: true,
    isFollowing: false,
    showFollowButton: false,
  }

  async componentWillReceiveProps() {
    this.activeUser = await api.getUserById(getCurrentUserId())
    const showFollowButton = this.props.user._id !== this.activeUser._id

    this.setState({
      loading: false,
      showFollowButton,
    })

    if (showFollowButton) {
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
        showFollowButton={this.state.showFollowButton}
        isFollowing={this.state.isFollowing}
        onFollow={this.onFollow}
      />
    )
  }
}

export default SidebarContainer
