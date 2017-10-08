import React from 'react'
import { MdFindInPage } from 'react-icons/lib/md'
import { getUserById, getUserByUsername } from '../api/users'
import { getCurrentUserId } from '../utils'
import ProfileSidebar from './ProfileSidebar'
import Scaffold from './Scaffold'
import Main from './Main'
import Feed from './Feed'

const Profile = ({ match }) => {
  const user = getUserByUsername(match.params.username)

  if (!user) {
    const currentUser = getUserById(getCurrentUserId())

    return (
      <Scaffold grid>
        <ProfileSidebar {...currentUser} />
        <Main style={{ textAlign: 'center' }}>
          <MdFindInPage size={212} color="#eceff1" />

          <p>
            The user <strong>@{match.params.username}</strong> doesn't exist.
          </p>
        </Main>
      </Scaffold>
    )
  }

  return (
    <Scaffold grid>
      <ProfileSidebar {...user} />
      <Main>
        <Feed
          from={user.username}
          renderEmpty={() => (
            <div style={{ textAlign: 'center' }}>
              <MdFindInPage size={212} color="#eceff1" />
              <p>
                <strong>@{user.username}</strong> hasn't posted yet.
              </p>
            </div>
          )}
        />
      </Main>
    </Scaffold>
  )
}

export default Profile
