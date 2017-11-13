import React from 'react'
import glamorous from 'glamorous'
import MdFindInPage from 'react-icons/lib/md/find-in-page'
import MdList from 'react-icons/lib/md/list'
import MdClose from 'react-icons/lib/md/close'
import Feed from 'components/Feed'
import PostList from 'components/PostList'
import Post from 'components/Post'
import LinkButton from 'components/LinkButton'
import Button from 'components/Button'

const PanelContainer = glamorous.div({
  margin: 'auto',
  maxWidth: 640,
  padding: 24,
})

const PanelHeader = glamorous.p({
  color: '#777',
})

const PanelFooter = glamorous.footer({
  padding: 48,
  textAlign: 'center',
})

const SearchPanel = ({ posts, search, onItemClick, onClose }) => (
  <PanelContainer>
    {posts.length > 0 && (
      <PanelHeader>
        Found {posts.length} result{posts.length > 1 && 's'}.
      </PanelHeader>
    )}

    <Feed
      posts={posts}
      render={({ posts, onFavorite }) => (
        <PostList>
          {posts.map(post => (
            <li key={post._id}>
              <Post
                {...post}
                onFavorite={onFavorite}
                onItemClick={onItemClick}
              />
            </li>
          ))}
        </PostList>
      )}
      renderLoading={() => (
        <div style={{ textAlign: 'center' }}>
          <MdList size={200} color="#ddd" />
        </div>
      )}
      renderEmpty={() => (
        <div style={{ textAlign: 'center' }}>
          <MdFindInPage size={200} color="#ddd" />

          <p>
            No results for <strong>{search}</strong>.
          </p>
        </div>
      )}
    />

    <PanelFooter>
      <LinkButton href={`/search?q=${search}`}>More results</LinkButton>

      <div style={{ marginTop: 40 }}>
        <Button title="Close the search panel" onClick={onClose}>
          <MdClose size="24" />
        </Button>
      </div>
    </PanelFooter>
  </PanelContainer>
)

export default SearchPanel
