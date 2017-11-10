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
        <Content>
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
        </Content>
      </Scaffold>
    )
  }
}

export default SearchScene
