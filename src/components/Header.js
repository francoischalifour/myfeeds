import React from 'react'
import { Link } from 'react-router-dom'
import glamorous from 'glamorous'
import MdLineWeight from 'react-icons/lib/md/line-weight'
import MdSearch from 'react-icons/lib/md/search'

const Navbar = glamorous.header({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 56,
  backgroundColor: '#212121',
  padding: '16px 24px',
  color: '#fff',
  boxShadow: '0 1px 3px rgba(50,50,50,.16)',
  '& a': {
    color: '#4fc3f7',
  },
})

const Title = glamorous.h1({
  flex: 2,
  fontSize: '1.2em',
  color: '#4fc3f7',
})

const Searchbar = glamorous.div({
  display: 'flex',
  flex: 1,
})

const Input = glamorous.input({
  background: 'none',
  border: 'none',
  borderRadius: 0,
  color: '#fff',
  maxWidth: 300,
  marginBottom: '0 !important',
  paddingLeft: '6px !important',
})

const MoreList = glamorous.ul()

const Header = () => (
  <Navbar>
    <Title>
      <Link to="/">
        <MdLineWeight size="24" color="#fff" /> myfeeds
      </Link>
    </Title>

    <Searchbar>
      <MdSearch size="24" color="#eee" style={{ marginTop: 6 }} />
      <Input type="search" placeholder="Search myfeeds" />
    </Searchbar>

    <MoreList>
      <li>
        <Link to="/logout">Logout</Link>
      </li>
    </MoreList>
  </Navbar>
)

export default Header
