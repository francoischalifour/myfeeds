import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import glamorous from 'glamorous'
import Post from 'components/Post'

const Item = glamorous('li', { propsAreCssOverrides: true })(props => ({
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
    redirect: '',
  }

  onItemClick = (event, postId) => {
    if (event.target.tagName === 'A') {
      return
    }

    this.setState({
      redirect: `/posts/${postId}`,
    })
  }

  render() {
    const { posts, renderHeader, renderEmpty } = this.props

    if (posts.length === 0 && renderEmpty) {
      return renderEmpty()
    }

    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />
    }

    return (
      <ul>
        {renderHeader && (
          <Item backgroundColor="#eceff1">{renderHeader()}</Item>
        )}

        {posts.map(post => (
          <Item
            key={post._id}
            onClick={event => this.onItemClick(event, post._id)}
          >
            <Post {...post} />
          </Item>
        ))}
      </ul>
    )
  }
}

export default Feed
