import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import MdChatBubbleOutline from 'react-icons/lib/md/chat-bubble-outline'
import MdChatBubble from 'react-icons/lib/md/chat-bubble'
import MdStarBorder from 'react-icons/lib/md/star-border'
import MdStar from 'react-icons/lib/md/star'
import { getUserById } from '../api/users'
import { getPostRepliesById } from '../api/posts'
import { getStarsByPostId } from '../api/stars'
import { formatText, getCurrentUserId } from '../utils'
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
  constructor(props) {
    super(props)

    const currentUserId = getCurrentUserId()
    const { _id: postId } = props

    const replies = getPostRepliesById(postId)
    const currentUserHasReplied =
      replies &&
      replies.findIndex(reply => reply.user_id === currentUserId) > -1

    const stars = getStarsByPostId(postId)
    const currentUserHasStarred =
      stars && stars.findIndex(star => star.user_id === currentUserId) > -1

    this.state = {
      starred: currentUserHasStarred,
      replied: currentUserHasReplied,
    }
  }

  onStarred = (event, isStarred) => {
    event.preventDefault()
    event.stopPropagation()

    this.setState(state => ({
      starred: isStarred,
    }))
  }

  render() {
    const {
      text,
      created_at: createdAt,
      user_id: userId,
      reply_count: replyCount = 0,
      star_count: starCount = 0,
    } = this.props
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

          <FooterList>
            <li>
              {this.state.replied ? (
                <MdChatBubble size="18" />
              ) : (
                <MdChatBubbleOutline size="18" />
              )}{' '}
              {replyCount > 0 && replyCount}
            </li>
            <li>
              {this.state.starred ? (
                <MdStar
                  onClick={event => this.onStarred(event, false)}
                  size="18"
                />
              ) : (
                <MdStarBorder
                  onClick={event => this.onStarred(event, true)}
                  size="18"
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
