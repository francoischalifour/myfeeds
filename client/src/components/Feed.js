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
  onFavorite = async postId => {}

  onItemClick = (event, postId) => {
    if (['A', 'IMG'].includes(event.target.tagName)) {
      return
    }

    window.location.href = `/posts/${postId}`
  }

  render() {
    const { posts, renderHeader, renderEmpty } = this.props

    if (posts.length === 0 && renderEmpty) {
      return renderEmpty()
    }

    return (
      <ul>
        {renderHeader && <Li backgroundColor="#eceff1">{renderHeader()}</Li>}

        {posts.map(post => (
          <Li
            key={post._id}
            onClick={event => this.onItemClick(event, post._id)}
          >
            <Post {...post} onFavorite={this.onFavorite} />
          </Li>
        ))}
      </ul>
    )
  }
}

export default Feed
