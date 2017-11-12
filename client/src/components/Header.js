import React from 'react'
import { Link } from 'react-router-dom'
import glamorous from 'glamorous'
import MdLineWeight from 'react-icons/lib/md/line-weight'
import MdSearch from 'react-icons/lib/md/search'
import SearchForm from 'components/SearchForm'

const Navbar = glamorous.header({
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
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: '0 auto',
  padding: '12px 24px',
  maxWidth: 1200,
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

const Header = () => {
  return (
    <Navbar>
      <Container>
        <Title>
          <Link to="/">
            <MdLineWeight size="24" color="#fff" style={{ marginRight: 12 }} />
            myfeeds
          </Link>
        </Title>

        <Searchbar>
          <MdSearch size="24" color="#eee" style={{ marginTop: 6 }} />
          <SearchForm placeholder="Search MyFeeds" />
        </Searchbar>

        <ul>
          <li>
            <Link to="/logout">Logout</Link>
          </li>
        </ul>
      </Container>
    </Navbar>
  )
}

export default Header
