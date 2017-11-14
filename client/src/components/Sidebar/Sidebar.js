import React, { Component } from 'react'
import glamorous from 'glamorous'
import { Link } from 'react-router-dom'
import ImagePalette from 'react-image-palette'
import { getLocationLink, cleanUrl, formatText } from 'utils'
import MdLocation from 'react-icons/lib/md/location-on'
import MdLink from 'react-icons/lib/md/link'
import MdDateRange from 'react-icons/lib/md/date-range'
import ProfilePicture from 'components/ProfilePicture'
import Container from './components/Container'
import Content from './components/Content'
import Header from './components/Header'
import ImageContainer from './components/ImageContainer'

const Sidenav = glamorous(Container)({
  position: 'sticky',
  top: 84,
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
  onFollow = ({ following }) => {
    this.props.onFollow({ following })
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

    let header

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
          {({ backgroundColor, color, alternativeColor }) => (
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

    return (
      <Sidenav>
        {imageUrl && header}
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
              {!this.props.isFollowing ? (
                <button
                  className="button"
                  onClick={() => this.onFollow({ following: true })}
                >
                  Follow
                </button>
              ) : (
                <button
                  className="button outline"
                  onClick={() => this.onFollow({ following: false })}
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
