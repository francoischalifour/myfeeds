import React, { Component } from 'react'
import glamorous from 'glamorous'
import { getFeeds } from './api/feeds'
import Post from './Post'

const Item = glamorous('li', { propsAreCssOverrides: true })({
  backgroundColor: '#fff',
  boxShadow: '0 1px 4px rgba(0,0,0,.1)',
  ':not(:last-of-type)': {
    borderBottom: '1px solid #e6ecf0',
  },
})

export default class Feed extends Component {
  render() {
    const feeds = getFeeds({
      from: this.props.from,
      containing: this.props.containing,
    })

    return (
      <ul>
        {this.props.renderHeader && (
          <Item backgroundColor="#d8dee2">{this.props.renderHeader()}</Item>
        )}

        {feeds.map(post => (
          <Item key={post._id}>
            <Post {...post} />
          </Item>
        ))}
      </ul>
    )
  }
}
