import React from 'react'
import { Link } from 'react-router-dom'
import glamorous from 'glamorous'
import MdLineWeight from 'react-icons/lib/md/line-weight'
import MdSearch from 'react-icons/lib/md/search'
import { SITE_TITLE } from '../constants'
import SearchForm from 'components/SearchForm'

const Navbar = glamorous.header({
  display: 'flex',
  position: 'sticky',
  top: 0,
  zIndex: 1,
  height: 60,
  backgroundColor: '#212121',
  color: '#fff',
  boxShadow: '0 1px 3px rgba(50,50,50,.16)',
  '& a': {
    color: '#4fc3f7',
  },
})

const Container = glamorous.div({
  display: 'flex',
  width: '100%',
  maxWidth: 1200,
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: '0 auto',
  padding: '0 24px',
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

const Header = ({ isLoggedIn }) => (
  <Navbar className="navbar">
    <Container>
      <Title>
        <Link to="/">
          <MdLineWeight size="24" color="#fff" style={{ marginRight: 12 }} />
          {SITE_TITLE.toLowerCase()}
        </Link>
      </Title>

      {isLoggedIn && [
        <Searchbar key="searchbar">
          <MdSearch size="24" color="#eee" style={{ marginTop: 6 }} />
          <SearchForm placeholder="Search MyFeeds" />
        </Searchbar>,

        <ul key="more">
          <li>
            <Link to="/logout">Logout</Link>
          </li>
        </ul>,
      ]}
    </Container>
  </Navbar>
)

export default Header
