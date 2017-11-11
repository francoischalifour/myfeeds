import React, { Component } from 'react'
import MdFindInPage from 'react-icons/lib/md/find-in-page'
import api from 'api'
import { getCurrentUserId } from 'utils'
import ProfileSidebar from 'components/ProfileSidebar'
import Scaffold from 'components/Scaffold'
import Content from 'components/Content'
import Feed from 'components/Feed'

class SearchScene extends Component {
  state = {
    loading: true,
    error: false,
  }

  async componentDidMount() {
    const params = new URLSearchParams(this.props.location.search)
    this.search = params.get('q')
    this.activeUser = await api.getUserById(getCurrentUserId())
    // `/` redirects to another route, we need to remove it
    const posts = await api.getAllPostsMatching(this.search.replace('/', ' '))

    this.setState({
      loading: false,
      posts,
    })
  }

  renderLoading = () => {
    return (
      <div style={{ textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    )
  }

  renderSearch = () => {
    return (
      <div>
        <h2>Results for "{this.search}"</h2>
        <Feed
          posts={this.state.posts}
          renderEmpty={() => (
            <div style={{ textAlign: 'center' }}>
              <MdFindInPage size={212} color="#ddd" />
              <p>
                No results for <strong>{this.search}</strong>.
              </p>
            </div>
          )}
        />
      </div>
    )
  }

  render() {
    return (
      <Scaffold grid>
        <ProfileSidebar {...this.activeUser} />
        <Content>
          {this.state.loading ? this.renderLoading() : this.renderSearch()}
        </Content>
      </Scaffold>
    )
  }
}

export default SearchScene
