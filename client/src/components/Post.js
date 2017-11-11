import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import glamorous from 'glamorous'
import MdChatBubbleOutline from 'react-icons/lib/md/chat-bubble-outline'
import MdChatBubble from 'react-icons/lib/md/chat-bubble'
import MdStarBorder from 'react-icons/lib/md/star-border'
import MdStar from 'react-icons/lib/md/star'
import distanceInWordsStrict from 'date-fns/distance_in_words_strict'
import format from 'date-fns/format'
import { formatText } from 'utils'
import ProfilePicture from 'components/ProfilePicture'

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
  '& em': {
    fontWeight: 'bold',
  },
})

const FooterList = glamorous.ul({
  display: 'flex',
  maxWidth: 200,
  color: '#999',
  fontWeight: 500,
  '& > li': {
    paddingRight: 24,
    '&:hover': {
      color: '#03a9f4',
    },
  },
})

class Post extends Component {
  onFavorite = event => {
    event.preventDefault()
    event.stopPropagation()

    this.props.onFavorite(this.props._id, !this.props.hasFavorited)
  }

  onCommentIconClick = () => {
    this.props.onCommentIconClick && this.props.onCommentIconClick()
  }

  render() {
    const {
      text,
      created_at: createdAt,
      reply_count: replyCount = 0,
      star_count: starCount = 0,
      profile_image_url: userImageUrl,
      name,
      username,
      hasReplied,
      hasFavorited,
    } = this.props
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
              <time
                dateTime={format(createdAt)}
                title={format(createdAt, 'HH:mm - DD MMM YYYY')}
              >
                {''} • {distanceInWordsStrict(createdAt, new Date())}
              </time>
            </Small>
          </Header>

          <PostText dangerouslySetInnerHTML={{ __html: formatText(text) }} />

          <FooterList>
            <li>
              {hasReplied ? (
                <MdChatBubble
                  size="18"
                  style={{ cursor: 'pointer' }}
                  onClick={this.onCommentIconClick}
                />
              ) : (
                <MdChatBubbleOutline
                  size="18"
                  style={{ cursor: 'pointer' }}
                  onClick={this.onCommentIconClick}
                />
              )}{' '}
              {replyCount > 0 && replyCount}
            </li>
            <li>
              {hasFavorited ? (
                <MdStar
                  size="18"
                  style={{ cursor: 'pointer' }}
                  onClick={event => this.onFavorite(event)}
                />
              ) : (
                <MdStarBorder
                  size="18"
                  style={{ cursor: 'pointer' }}
                  onClick={event => this.onFavorite(event)}
                />
              )}{' '}
              {starCount > 0 && starCount}
            </li>
          </FooterList>
        </RightContainer>
      </Container>
    )
  }
}

export default Post
