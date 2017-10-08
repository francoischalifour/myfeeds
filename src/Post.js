import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { getUserById } from './api/users'
import { formatText } from './utils'
import glamorous from 'glamorous'
import ProfilePicture from './ProfilePicture'

const Container = glamorous.div({
  display: 'flex',
  padding: 16,
})

const Small = glamorous.small({
  color: '#999',
  '& a': {
    color: '#999',
  },
})

const LeftContainer = glamorous.div({
  paddingRight: 16,
})

const RightContainer = glamorous.div({
  flex: 1,
})

const Header = glamorous.header({
  '& a': {
    color: '#333',
  },
})

const PostText = glamorous.p({
  marginTop: 4,
  color: '#333',
})

export default class Post extends Component {
  render() {
    const { text, created_at: createdAt, userid: userId } = this.props

    const [, month, day] = String(new Date(createdAt)).split(' ')

    const { profile_image_url: userImageUrl, name, username } = getUserById(
      userId
    )

    return (
      <Container>
        <LeftContainer>
          <Link to={`/@${username}`}>
            <ProfilePicture src={userImageUrl} alt={username} width={48} />
          </Link>
        </LeftContainer>

        <RightContainer>
          <Header>
            <Link to={`/@${username}`}>
              <strong>{name}</strong>
            </Link>
            <Small>
              {' '}
              <Link to={`/@${username}`}>@{username}</Link>
              <time>
                {''} • {month} {day}
              </time>
            </Small>
          </Header>

          <PostText dangerouslySetInnerHTML={{ __html: formatText(text) }} />
        </RightContainer>
      </Container>
    )
  }
}
