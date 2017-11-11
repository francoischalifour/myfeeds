import React, { Component } from 'react'
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
  onItemClick = (event, postId) => {
    this.props.onItemClick(event, postId)
  }

  onFavorite = (postId, hasFavorited) => {
    this.props.onFavorite(postId, hasFavorited)
  }

  renderPosts = posts => {
    return posts.map(post => (
      <Li key={post._id} onClick={event => this.onItemClick(event, post._id)}>
        <Post {...post} onFavorite={this.onFavorite} />
      </Li>
    ))
  }

  render() {
    if (this.props.renderEmpty) {
      return this.props.renderEmpty()
    }

    return (
      <ul>
        {this.props.renderHeader && (
          <Li backgroundColor="#eceff1">{this.props.renderHeader()}</Li>
        )}

        {this.props.renderLoading ? (
          <Li>{this.props.renderLoading()}</Li>
        ) : (
          this.renderPosts(this.props.posts)
        )}
      </ul>
    )
  }
}

export default Feed
