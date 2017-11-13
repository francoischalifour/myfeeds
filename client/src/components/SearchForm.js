import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import glamorous from 'glamorous'
import api from 'api'
import { getActiveUser } from 'utils'
import SearchPanel from 'components/SearchPanel'

const Input = glamorous.input({
  background: 'none',
  border: 'none',
  borderRadius: 0,
  color: '#fff',
  marginBottom: '0 !important',
  paddingLeft: '6px !important',
})

class SearchForm extends Component {
  static defaultProps = {
    placeholder: '',
  }

  activeUser = getActiveUser()

  constructor(props) {
    super(props)
    const params = new URLSearchParams(window.location.search)
    const search = params.get('q') || ''
    this.panelContainer = document.createElement('div')
    this.panelContainer.classList.add('search-wrapper')

    this.state = {
      search,
      posts: [],
    }
  }

  componentDidMount() {
    this.resultContainer = document.getElementById('search-results')
    document.body.appendChild(this.panelContainer)
  }

  componentWillUnmount() {
    document.body.removeChild(this.panelContainer)
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

  onItemClick = ({ postId }) => {
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

        {ReactDOM.createPortal(
          <SearchPanel
            search={this.state.search}
            posts={this.state.posts}
            onItemClick={this.onItemClick}
            onClose={this.onClose}
          />,
          this.panelContainer
        )}
      </div>
    )
  }
}

export default SearchForm
