import React, { Component } from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'
import { Link } from 'react-router-dom'
import ImagePalette from 'react-image-palette'
import { getLocationLink, cleanUrl, formatText } from 'utils'
import MdLocation from 'react-icons/lib/md/location-on'
import MdLink from 'react-icons/lib/md/link'
import MdDateRange from 'react-icons/lib/md/date-range'
import ProfilePicture from 'components/ProfilePicture'

const Sidenav = glamorous.aside({
  gridArea: 'sidebar',
  position: 'sticky',
  top: 84,
  background: '#fff',
  boxShadow: '0 1px 4px rgba(0,0,0,.1)',
  borderRadius: 3,
})

const Content = glamorous.div({
  padding: '75px 24px 24px 24px',
})

const Header = glamorous('header', { propsAreCssOverrides: true })({
  position: 'relative',
  backgroundColor: '#212121',
  height: 114,
})

const ImageContainer = glamorous.div({
  overflow: 'hidden',
  position: 'absolute',
  bottom: '-85px',
  left: '50%',
  width: 150,
  height: 150,
  borderRadius: '50%',
  border: '2px solid white',
  backgroundColor: '#212121',
  transform: 'translateX(-50%)',
})

const Name = glamorous.h2({
  margin: '1rem 0 0 0',
  '> a': {
    color: 'inherit',
  },
})

const Username = glamorous.small({
  fontSize: '.9rem',
  color: '#777',
  '> a': {
    color: 'inherit',
  },
})

const Description = glamorous.p({
  marginTop: '1rem',
})

const Footer = glamorous.footer({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: 16,
})

const Ul = glamorous.ul({
  listStyle: 'none',
  margin: '1rem 0 0 0',
  padding: 0,
  lineHeight: '1.6rem',
})

class Sidebar extends Component {
  static propTypes = {
    showFollowButton: PropTypes.bool,
    followed: PropTypes.bool,
    onFollow: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  }

  render() {
    const {
      profile_image_url: imageUrl,
      name,
      username,
      description,
      location,
      url,
      created_at: createdAt,
    } = this.props.user

    const [, month, , year] = String(new Date(createdAt)).split(' ')

    let header = null

    if (!imageUrl) {
      header = (
        <Header>
          <Link to={`/@${username}`}>
            <ImageContainer />
          </Link>
        </Header>
      )
    } else {
      // Disable CORS errors coming from Amazon and `react-image-palette` avatars for now
      if (imageUrl && imageUrl.startsWith('https://s3.amazonaws.com')) {
        header = (
          <Header>
            <Link to={`/@${username}`}>
              <ImageContainer>
                <ProfilePicture src={imageUrl} alt={name} />
              </ImageContainer>
            </Link>
          </Header>
        )
      } else if (imageUrl) {
        header = (
          <ImagePalette image={imageUrl} crossOrigin={true}>
            {({ backgroundColor }) => (
              <Header backgroundColor={backgroundColor}>
                <Link to={`/@${username}`}>
                  <ImageContainer>
                    <ProfilePicture src={imageUrl} alt={name} />
                  </ImageContainer>
                </Link>
              </Header>
            )}
          </ImagePalette>
        )
      }
    }

    return (
      <Sidenav>
        {header}

        <Content>
          <Name>{name && <Link to={`/@${username}`}>{name}</Link>}</Name>
          <Username>
            {username && <Link to={`/@${username}`}>@{username}</Link>}
          </Username>

          {description && (
            <Description
              dangerouslySetInnerHTML={{ __html: formatText(description) }}
            />
          )}

          <Ul>
            {location && (
              <li>
                <MdLocation />{' '}
                <a href={getLocationLink(location)}>{location}</a>
              </li>
            )}
            {url && (
              <li>
                <MdLink /> <a href={url}>{cleanUrl(url)}</a>
              </li>
            )}
            {createdAt && (
              <li>
                <MdDateRange /> Joined {month} {year}
              </li>
            )}
          </Ul>

          {this.props.showFollowButton && (
            <Footer>
              {!this.props.followed ? (
                <button className="button" onClick={this.props.onFollow}>
                  Follow
                </button>
              ) : (
                <button
                  className="button outline"
                  onClick={this.props.onFollow}
                >
                  Unfollow
                </button>
              )}
            </Footer>
          )}
        </Content>
      </Sidenav>
    )
  }
}

export default Sidebar
