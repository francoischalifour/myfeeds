import React from 'react'
import { MdFindInPage } from 'react-icons/lib/md'
import { getUserById } from '../api/users'
import { getCurrentUserId } from '../utils'
import ProfileSidebar from './ProfileSidebar'
import Scaffold from './Scaffold'
import Main from './Main'
import Feed from './Feed'

const Hashtag = ({ match }) => {
  const currentUser = getUserById(getCurrentUserId())
  const hashtag = match.params.hashtag

  return (
    <Scaffold grid>
      <ProfileSidebar {...currentUser} />
      <Main>
        <h2>#{hashtag}</h2>
        <Feed
          containing={`#${hashtag}`}
          renderEmpty={() => (
            <div style={{ textAlign: 'center' }}>
              <MdFindInPage size={212} color="#d8dee2" />
              <p>
                No results for <strong>#{hashtag}</strong>.
              </p>
            </div>
          )}
        />
      </Main>
    </Scaffold>
  )
}

export default Hashtag
