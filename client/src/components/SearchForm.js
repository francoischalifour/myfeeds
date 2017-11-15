import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import glamorous from 'glamorous'
import api from 'api'
import { getLocalUser } from 'utils'
import SearchPanel from 'components/SearchPanel'
import Loader from 'components/Loader'

const Form = glamorous.form({
  display: 'flex',
  alignItems: 'center',
})

const Input = glamorous.input({
  background: 'none',
  border: 'none',
  borderRadius: 0,
  color: '#fff',
  marginBottom: '0 !important',
  paddingLeft: '6px !important',
  '&::-webkit-search-cancel-button': {
    display: 'none',
  },
})

class SearchForm extends Component {
  static defaultProps = {
    placeholder: '',
  }

  activeUser = getLocalUser()

  constructor(props) {
    super(props)
    const params = new URLSearchParams(window.location.search)
    const search = params.get('q') || ''
    this.panelContainer = document.createElement('div')
    this.panelContainer.classList.add('search-wrapper')

    this.state = {
      fetching: false,
      search,
      posts: [],
    }
  }

  componentDidMount() {
    this.resultContainer = document.getElementById('search-results')
    document.body.appendChild(this.panelContainer)
    this.navbar = document.querySelector('.navbar a')
    this.navbar.addEventListener('click', this.onNavbarLinkClick)
  }

  componentWillUnmount() {
    document.body.removeChild(this.panelContainer)
    this.navbar.removeEventListener('click', this.onNavbarLinkClick)
  }

  onNavbarLinkClick = event => {
    this.onClose()
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
    this.setState({
      fetching: true,
    })

    const search = event.target.value
    document.body.classList.toggle('searching', search.length > 0)

    this.setState({ search }, async () => {
      if (search.length > 0) {
        // `/` redirects to another route, we need to remove it
        const posts = await api.getAllPostsMatching({
          query: this.state.search.replace('/', ' '),
          userId: this.activeUser._id,
        })

        this.setState({
          posts,
          fetching: false,
        })

        if (posts.length > 0) {
          document.documentElement.scrollTop = 0
          const searchPath = `/search?q=${this.state.search}`
          const pageTitle = `${search} - MyFeeds`
          document.title = pageTitle
          window.history.pushState({ search }, pageTitle, searchPath)
        }
      } else {
        this.onClose()
      }
    })
  }

  onClose = event => {
    event && event.preventDefault()
    document.body.classList.remove('searching')
    this.setState({
      posts: [],
      fetching: false,
    })

    if (
      this.originLocation &&
      !this.originLocation.pathname.startsWith('/search')
    ) {
      document.title = this.originLocation.title
      window.history.pushState(
        {},
        this.originLocation.title,
        this.originLocation.href
      )
    }
  }

  onItemClick = ({ _id }) => {
    window.location.href = `/posts/${_id}`
  }

  render() {
    return (
      <div>
        <Form action="/search">
          <Input
            type="search"
            name="q"
            value={this.state.search}
            onChange={this.onChange}
            onFocus={this.onFocus}
            placeholder={this.props.placeholder}
            autoComplete="off"
          />
          {this.state.fetching && <Loader size={24} color="#fff" delay={200} />}
        </Form>

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
