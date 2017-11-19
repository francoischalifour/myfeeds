import React from 'react'
import { Link } from 'react-router-dom'
import glamorous from 'glamorous'
import MdLineWeight from 'react-icons/lib/md/line-weight'
import MdSearch from 'react-icons/lib/md/search'
import { SITE_TITLE } from '../constants'
import SearchForm from 'components/SearchForm'

const Header = glamorous.header({
  display: 'flex',
  position: 'sticky',
  top: 0,
  zIndex: 1,
  height: 60,
  backgroundColor: '#212121',
  color: '#fff',
  boxShadow: '0 1px 3px rgba(50,50,50,.16)',
  '& a': {
    color: '#4FC3F7',
    '&:hover': {
      textDecoration: 'none',
    },
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

const LeftContainer = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: '100%',
  flex: 2,
})

const Title = glamorous.h1({
  fontSize: '1.2em',
  marginRight: '3rem',
})

const NavList = glamorous.ul({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  '& > li': {
    padding: '0 1.2em',
    height: '100%',
    alignItems: 'center',
    display: 'flex',
    borderBottom: '2px solid transparent',
    '&:hover': {
      borderColor: '#fff',
    },
    '> a': {
      display: 'flex',
      height: '100%',
      alignItems: 'center',
    },
  },
})

const Searchbar = glamorous.div({
  display: 'flex',
  flex: 1,
})

const Navbar = ({ isLoggedIn: username }) => (
  <Header className="navbar">
    <Container>
      <LeftContainer>
        <Title>
          <Link to="/">
            <MdLineWeight size="24" color="#fff" style={{ marginRight: 12 }} />
            {SITE_TITLE.toLowerCase()}
          </Link>
        </Title>

        {username && (
          <NavList>
            <li>
              <a href={`/@${username}`}>Profile</a>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
          </NavList>
        )}
      </LeftContainer>

      {username && [
        <Searchbar key="searchbar">
          <MdSearch size="24" color="#eee" style={{ marginTop: 6 }} />
          <SearchForm placeholder="Search MyFeeds" />
        </Searchbar>,

        <NavList key="more">
          <li>
            <Link to="/logout">Logout</Link>
          </li>
        </NavList>,
      ]}
    </Container>
  </Header>
)

export default Navbar
