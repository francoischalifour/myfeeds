import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import glamorous from 'glamorous'
import Post from 'components/Post'

const Li = glamorous('li', { propsAreCssOverrides: true })(props => ({
  backgroundColor: '#fff',
  boxShadow: '0 1px 4px rgba(0,0,0,.1)',
  ':not(:last-of-type)': {
    borderBottom: '1px solid #e6ecf0',
  },
  '&:hover': {
    backgroundColor: props.backgroundColor || '#fafafa',
    cursor: props.backgroundColor ? 'auto' : 'pointer',
  },
}))

class Feed extends Component {
  state = {
    loading: true,
    redirect: false,
  }

  onFavorite = async postId => {}

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

  renderPosts = posts => {
    return posts.map(post => (
      <Li key={post._id} onClick={event => this.onItemClick(event, post._id)}>
        <Post {...post} onFavorite={this.onFavorite} />
      </Li>
    ))
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />
    }

    if (
      this.props.renderEmpty &&
      this.props.posts.length === 0 &&
      this.state.loading === false
    ) {
      return this.props.renderEmpty()
    }

    return (
      <ul>
        {this.props.renderHeader && (
          <Li backgroundColor="#eceff1">{this.props.renderHeader()}</Li>
        )}

        {this.state.loading && this.props.renderLoading ? (
          <Li>{this.props.renderLoading()}</Li>
        ) : (
          this.renderPosts(this.props.posts)
        )}
      </ul>
    )
  }
}

export default Feed
