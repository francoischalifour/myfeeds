import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Feed from './Feed'

class FeedContainer extends Component {
  state = {
    loading: true,
    redirect: false,
  }

  componentDidMount() {
    if (!this.props.renderLoading) {
      this.setState({
        loading: false,
      })
    }
  }

  componentWillReceiveProps() {
    if (this.props.renderLoading) {
      this.setState({
        loading: false,
      })
    }
  }

  onItemClick = (event, postId) => {
    if (['A', 'IMG'].includes(event.target.tagName)) {
      return
    }

    if (this.props.onItemClick) {
      this.props.onItemClick(postId)
    } else {
      this.setState({
        redirect: `/posts/${postId}`,
      })
    }
  }

  onFavorite = async (postId, hasFavorited) => {
    this.props.onFavorite && this.props.onFavorite(postId, hasFavorited)
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />
    }

    return (
      <Feed
        posts={this.props.posts}
        renderLoading={this.state.loading && this.props.renderLoading}
        renderEmpty={
          this.props.posts &&
          this.props.posts.length === 0 &&
          this.state.loading === false
            ? this.props.renderEmpty
            : null
        }
        renderHeader={this.props.renderHeader}
        onItemClick={this.onItemClick}
        onFavorite={this.onFavorite}
      />
    )
  }
}

export default FeedContainer
