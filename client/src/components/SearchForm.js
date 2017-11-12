import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import MdFindInPage from 'react-icons/lib/md/find-in-page'
import MdClose from 'react-icons/lib/md/close'
import glamorous from 'glamorous'
import api from 'api'
import { getActiveUser } from 'utils'
import Feed from 'components/Feed'
import LinkButton from 'components/LinkButton'
import Button from 'components/Button'

const Input = glamorous.input({
  background: 'none',
  border: 'none',
  borderRadius: 0,
  color: '#fff',
  marginBottom: '0 !important',
  paddingLeft: '6px !important',
})

const OverlayPanel = glamorous.div({
  margin: 'auto',
  maxWidth: 640,
  padding: 24,
})

const OverlayHeader = glamorous.p({
  color: '#777',
})

const OverlayFooter = glamorous.footer({
  padding: 48,
  textAlign: 'center',
})

const SearchPanel = ({
  posts,
  search,
  onFavorite,
  onItemClick,
  onClose,
  container,
}) =>
  ReactDOM.createPortal(
    <OverlayPanel>
      {posts.length > 0 && (
        <OverlayHeader>
          Found {posts.length} result{posts.length > 1 && 's'}.
        </OverlayHeader>
      )}
      <Feed
        posts={posts}
        renderEmpty={() => (
          <div style={{ textAlign: 'center' }}>
            <MdFindInPage size={212} color="#ddd" />
            <p>
              No results for <strong>{search}</strong>.
            </p>
          </div>
        )}
        onFavorite={onFavorite}
        onItemClick={onItemClick}
      />

      <OverlayFooter>
        <LinkButton href={`/search?q=${search}`}>More results</LinkButton>
        <div style={{ marginTop: 40 }}>
          <Button title="Close the search panel" onClick={onClose}>
            <MdClose size="24" />
          </Button>
        </div>
      </OverlayFooter>
    </OverlayPanel>,
    container
  )

class SearchForm extends Component {
  activeUser = getActiveUser()

  constructor(props) {
    super(props)
    const params = new URLSearchParams(window.location.search)
    const search = params.get('q') || ''
    this.el = document.createElement('div')
    this.el.classList.add('search-wrapper')

    this.state = {
      search,
      posts: [],
    }
  }

  async componentDidMount() {
    this.resultContainer = document.getElementById('search-results')
    document.body.appendChild(this.el)
  }

  componentWillUnmount() {
    document.body.removeChild(this.el)
  }

  onFocus = event => {
    this.originLocation = {
      href: window.location.href,
      pathname: window.location.pathname,
      title: document.title,
    }
    this.onChange(event)
  }

  onChange = async event => {
    const search = event.target.value
    document.body.classList.toggle('searching', search.length > 0)

    this.setState({ search }, async () => {
      // `/` redirects to another route, we need to remove it
      const posts = await api.getAllPostsMatchingAsUserId(
        this.state.search.replace('/', ' '),
        this.activeUser._id
      )

      this.setState({
        posts,
      })

      if (search.length > 0 && posts.length > 0) {
        const searchPath = `/search?q=${this.state.search}`
        const pageTitle = `${search} - MyFeeds`
        document.title = pageTitle
        window.history.pushState({ search }, pageTitle, searchPath)
      } else if (search.length === 0) {
        this.onClose()
      }
    })
  }

  onClose = event => {
    event && event.preventDefault()
    document.body.classList.remove('searching')

    if (!this.originLocation.pathname.startsWith('/search')) {
      document.title = this.originLocation.title
      window.history.pushState(
        {},
        this.originLocation.title,
        this.originLocation.href
      )
    }
  }

  onFavorite = async (postId, hasFavorited) => {
    const fav = {
      post_id: postId,
      user_id: this.activeUser._id,
    }

    const hasSucceeded = hasFavorited
      ? await api.favorite(fav)
      : await api.unfavorite(fav)

    if (hasSucceeded) {
      const postNewState = await api.getPostByIdAsUserId(
        postId,
        this.activeUser._id
      )
      const posts = this.state.posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            reply_count: postNewState.reply_count,
            star_count: postNewState.star_count,
            replied: postNewState.replied,
            favorited: postNewState.favorited,
          }
        }
        return post
      })

      this.setState({
        posts,
      })
    }
  }

  onItemClick = postId => {
    window.location.href = `/posts/${postId}`
  }

  render() {
    return (
      <div>
        <form action="/search">
          <Input
            type="search"
            name="q"
            value={this.state.search}
            onChange={this.onChange}
            onFocus={this.onFocus}
            placeholder={this.props.placeholder}
            autoComplete="off"
          />
        </form>

        <SearchPanel
          search={this.state.search}
          posts={this.state.posts}
          container={this.el}
          onFavorite={this.onFavorite}
          onItemClick={this.onItemClick}
          onClose={this.onClose}
        />
      </div>
    )
  }
}

export default SearchForm
