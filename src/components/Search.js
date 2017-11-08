import React from 'react'
import { MdFindInPage } from 'react-icons/lib/md'
import { getUserById } from '../api/users'
import { getCurrentUserId } from '../utils'
import ProfileSidebar from './ProfileSidebar'
import Scaffold from './Scaffold'
import Main from './Main'
import Feed from './Feed'

const Search = ({ location }) => {
  const currentUser = getUserById(getCurrentUserId())
  const params = new URLSearchParams(location.search)
  const search = params.get('q')

  return (
    <Scaffold grid>
      <ProfileSidebar {...currentUser} />
      <Main>
        <h2>Results for "{search}"</h2>
        <Feed
          matching={search}
          renderEmpty={() => (
            <div style={{ textAlign: 'center' }}>
              <MdFindInPage size={212} color="#ddd" />
              <p>
                No results for <strong>{search}</strong>.
              </p>
            </div>
          )}
        />
      </Main>
    </Scaffold>
  )
}

export default Search
