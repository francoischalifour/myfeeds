import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import glamorous from 'glamorous'
import { getFeeds } from '../api/feeds'
import Post from './Post'

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

export default class Feed extends Component {
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
    const { from, containing, renderHeader, renderEmpty } = this.props

    const feeds = getFeeds({
      from: from,
      containing: containing,
    })

    if (feeds.length === 0 && renderEmpty) {
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

        {feeds.map(post => (
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
