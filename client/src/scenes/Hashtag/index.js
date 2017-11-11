import React, { Component } from 'react'
import MdFindInPage from 'react-icons/lib/md/find-in-page'
import api from 'api'
import { getCurrentUserId } from 'utils'
import Sidebar from 'components/Sidebar'
import Scaffold from 'components/Scaffold'
import Content from 'components/Content'
import Feed from 'components/Feed'

class HashtagScene extends Component {
  state = {
    loading: true,
  }

  async componentDidMount() {
    this.activeUser = await api.getUserById(getCurrentUserId())
    const posts = await api.getAllPostsHashtag(this.props.match.params.hashtag)

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
        <h2>#{this.props.match.params.hashtag}</h2>
        <Feed
          posts={this.state.posts}
          renderEmpty={() => (
            <div style={{ textAlign: 'center' }}>
              <MdFindInPage size={212} color="#ddd" />
              <p>
                No results for{' '}
                <strong>#{this.props.match.params.hashtag}</strong>.
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
        <Sidebar user={this.activeUser} />
        <Content>
          {this.state.loading ? this.renderLoading() : this.renderSearch()}
        </Content>
      </Scaffold>
    )
  }
}

export default HashtagScene
