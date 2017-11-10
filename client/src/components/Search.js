import React, { Component } from 'react'
import MdFindInPage from 'react-icons/lib/md/find-in-page'
import api from '../api'
import { getCurrentUserId } from '../utils'
import ProfileSidebar from './ProfileSidebar'
import Scaffold from './Scaffold'
import Main from './Main'
import Feed from './Feed'

class Search extends Component {
  state = {
    search: '',
    posts: [],
  }

  async componentDidMount() {
    this.activeUser = await api.getUserById(getCurrentUserId())
    const params = new URLSearchParams(this.props.location.search)
    const search = params.get('q')
    const posts = await api.getAllPostsMatching(search.replace('/', ' ')) // '/' leads to another route, remove it

    this.setState({
      posts,
      search,
    })
  }

  render() {
    return (
      <Scaffold grid>
        <ProfileSidebar {...this.activeUser} />
        <Main>
          <h2>Results for "{this.state.search}"</h2>
          <Feed
            posts={this.state.posts}
            renderEmpty={() => (
              <div style={{ textAlign: 'center' }}>
                <MdFindInPage size={212} color="#ddd" />
                <p>
                  No results for <strong>{this.state.search}</strong>.
                </p>
              </div>
            )}
          />
        </Main>
      </Scaffold>
    )
  }
}

export default Search
