import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import api from 'api'
import { LOCALE_STORAGE_FEED_SCROLL } from '../constants'
import { getActiveUser } from 'utils'

class Feed extends Component {
  activeUser = getActiveUser()
  state = {
    loading: true,
    redirect: false,
    error: '',
    posts: [],
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      loading: false,
      posts: nextProps.posts,
    })

    // We keep track of the number of mounted elements if the feed has a name.
    // Giving a name to a feed is a way to remember its scroll position in the
    // `localeStorage` when the user comes back to the page.
    nextProps.name && (this.mountedPostCount = 0)
  }

  componentWillUnmount() {
    this.props.name && document.removeEventListener('scroll', this.onScroll)
  }

  onScroll = () => {
    window.localStorage.removeItem(
      `${LOCALE_STORAGE_FEED_SCROLL}_${this.props.name.toUpperCase()}`
    )
  }

  onPostRef = () => {
    if (!this.props.name) {
      return
    }

    this.mountedPostCount++

    // The DOM has completely mounted, let's scroll to the last stored position
    if (this.mountedPostCount === this.state.posts.length) {
      const lastScrollPosition = window.localStorage.getItem(
        `${LOCALE_STORAGE_FEED_SCROLL}_${this.props.name.toUpperCase()}`
      )

      if (lastScrollPosition) {
        document.documentElement.scrollTop = lastScrollPosition
      }

      document.addEventListener('scroll', this.onScroll)
    }
  }

  onFavorite = async ({ postId, favorited }) => {
    const fav = {
      post_id: postId,
      user_id: this.activeUser._id,
    }

    const success = favorited
      ? await api.favorite(fav)
      : await api.unfavorite(fav)

    if (success) {
      const postUpdated = await api.getPostByIdAsUserId(
        postId,
        this.activeUser._id
      )
      const posts = this.state.posts
      const postUpdatedIndex = posts.findIndex(post => post._id === postId)
      posts[postUpdatedIndex] = {
        ...posts[postUpdatedIndex],
        reply_count: postUpdated.reply_count,
        star_count: postUpdated.star_count,
        favorited: postUpdated.favorited,
        replied: postUpdated.replied,
      }

      this.setState({
        posts,
      })
    } else {
      this.setState({
        error: 'Error while favoriting the post.',
      })
    }
  }

  onItemClick = post => {
    // Store the current scroll position for when the user comes back to this feed
    if (this.props.name) {
      const scrollTop = document.documentElement.scrollTop

      if (scrollTop > 0) {
        window.localStorage.setItem(
          `${LOCALE_STORAGE_FEED_SCROLL}_${this.props.name.toUpperCase()}`,
          scrollTop
        )
      }
    }

    this.setState({
      redirect: {
        pathname: `/posts/${post._id}`,
        state: post,
      },
    })
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />
    }

    if (this.state.error && this.props.renderError) {
      return this.props.renderError(this.state.error)
    }

    if (this.state.loading && this.props.renderLoading) {
      return this.props.renderLoading()
    }

    if (this.state.posts.length === 0 && this.props.renderEmpty) {
      return this.props.renderEmpty()
    }

    return this.props.render({
      posts: this.state.posts,
      onFavorite: this.onFavorite,
      onItemClick: this.onItemClick,
      onPostRef: this.onPostRef,
    })
  }
}

export default Feed
