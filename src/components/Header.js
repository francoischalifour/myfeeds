import React from 'react'
import { Link } from 'react-router-dom'
import glamorous from 'glamorous'
import { deleteCurrentUserId } from '../utils'

const Navbar = glamorous.header({
  backgroundColor: '#fff',
  padding: '16px',
  color: '#333',
  boxShadow: '0 1px 3px rgba(50,50,50,.16)',
})

const Ul = glamorous.ul({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  textAlign: 'center',
  maxWidth: 1200,
  margin: '0 auto',
  padding: '0 24px',
  '> li:first-child': {
    textAlign: 'left',
  },
  '> li:last-child': {
    textAlign: 'right',
  },
})

const Title = glamorous.h1({
  fontSize: '1.5em',
})

const logout = () => {
  deleteCurrentUserId()
  window.location.reload()
}

const Header = () => (
  <Navbar>
    <Ul>
      <li>
        <Link to="/">
          <Title>MyFeeds</Title>
        </Link>
      </li>

      <li>Search</li>

      <li>
        <button onClick={logout}>Logout</button>
      </li>
    </Ul>
  </Navbar>
)

export default Header
