import React from 'react'
import glamorous from 'glamorous'
import { getFeeds } from '../api/feeds'
import Post from './Post'

const Item = glamorous('li', { propsAreCssOverrides: true })({
  backgroundColor: '#fff',
  boxShadow: '0 1px 4px rgba(0,0,0,.1)',
  ':not(:last-of-type)': {
    borderBottom: '1px solid #e6ecf0',
  },
})

const Feed = ({ from, containing, renderHeader, renderEmpty }) => {
  const feeds = getFeeds({
    from: from,
    containing: containing,
  })

  if (feeds.length === 0 && renderEmpty) {
    return renderEmpty()
  }

  return (
    <ul>
      {renderHeader && <Item backgroundColor="#d8dee2">{renderHeader()}</Item>}

      {feeds.map(post => (
        <Item key={post._id}>
          <Post {...post} />
        </Item>
      ))}
    </ul>
  )
}

export default Feed
