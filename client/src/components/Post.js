import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import glamorous from 'glamorous'
import MdChatBubbleOutline from 'react-icons/lib/md/chat-bubble-outline'
import MdChatBubble from 'react-icons/lib/md/chat-bubble'
import MdFavoriteBorder from 'react-icons/lib/md/favorite-border'
import MdFavorite from 'react-icons/lib/md/favorite'
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
    color: 'inherit',
  },
})

const ImageContainer = glamorous.div({
  width: 64,
})

const TextContainer = glamorous.div({
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
    backgroundColor: '#FFF59D',
  },
})

const FooterList = glamorous.ul({
  userSelect: 'none',
  display: 'flex',
  color: '#999',
  fontWeight: 500,
  '& > li': {
    cursor: 'pointer',
    paddingRight: 24,
  },
})

const ReplyItem = glamorous.li(props => ({
  color: props.fill ? '#03A9F4' : '',
  '&:hover': {
    color: '#03A9F4',
  },
}))

const FavoriteItem = glamorous.li(props => ({
  color: props.fill ? '#E91E63' : '',
  '&:hover': {
    color: '#E91E63',
  },
}))

const FavoriteItemList = glamorous.ul({
  display: 'flex',
  paddingTop: 2,
  '& li': { paddingRight: 4 },
})

class Post extends Component {
  static defaultProps = {
    onFavorite: () => {},
    onItemClick: () => {},
    onCommentIconClick: () => {},
  }

  onFavorite = event => {
    event.preventDefault()
    event.stopPropagation()

    this.props.onFavorite({
      postId: this.props._id,
      favorited: !this.props.favorited,
    })
  }

  onItemClick = event => {
    if (['A', 'IMG'].includes(event.target.tagName)) {
      return
    }

    event.preventDefault()
    this.props.onItemClick({ postId: this.props._id })
  }

  onCommentIconClick = () => {
    this.props.onCommentIconClick()
  }

  render() {
    const {
      _id: postId,
      text,
      created_at: createdAt,
      reply_count: replyCount = 0,
      star_count: starCount = 0,
      profile_image_url: userImageUrl,
      name,
      username,
      replied,
      favorited,
      favorites,
    } = this.props

    return (
      <Container onClick={this.onItemClick}>
        <ImageContainer>
          <Link to={`/@${username}`}>
            <ProfilePicture src={userImageUrl} alt={username} width={48} />
          </Link>
        </ImageContainer>

        <TextContainer>
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
                {''} • {''}
                <Link to={`/posts/${postId}`} onClick={this.onItemClick}>
                  {distanceInWordsStrict(createdAt, new Date())}
                </Link>
              </time>
            </Small>
          </Header>

          <PostText dangerouslySetInnerHTML={{ __html: formatText(text) }} />

          <FooterList>
            <ReplyItem fill={replied} onClick={this.onCommentIconClick}>
              {replied ? (
                <MdChatBubble size="18" />
              ) : (
                <MdChatBubbleOutline size="18" />
              )}{' '}
              {replyCount > 0 && replyCount}
            </ReplyItem>
            <FavoriteItem fill={favorited} onClick={this.onFavorite}>
              {favorited ? (
                <MdFavorite size="18" />
              ) : (
                <MdFavoriteBorder size="18" />
              )}{' '}
              {starCount > 0 && starCount}
            </FavoriteItem>
            {favorites && (
              <li>
                <FavoriteItemList>
                  {favorites.map(fav => (
                    <li key={fav.username}>
                      <Link
                        to={`/@${fav.username}`}
                        title={`Go to @${fav.name}'s profile`}
                      >
                        <ProfilePicture
                          src={fav.profile_image_url}
                          alt={fav.username}
                          width={20}
                        />
                      </Link>
                    </li>
                  ))}
                </FavoriteItemList>
              </li>
            )}
          </FooterList>
        </TextContainer>
      </Container>
    )
  }
}

export default Post
