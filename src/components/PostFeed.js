import React from 'react'
import glamorous from 'glamorous'
import { MdFindInPage } from 'react-icons/lib/md'
import { getCurrentUserId } from '../utils'
import { getUserById } from '../api/users'
import { getPostById } from '../api/posts'
import Scaffold from './Scaffold'
import Main from './Main'
import ProfileSidebar from './ProfileSidebar'
import Post from './Post'
import PostForm from './PostForm'

const PostContainer = glamorous.div({
  backgroundColor: '#fff',
  boxShadow: '0 1px 4px rgba(0,0,0,.1)',
  ':not(:last-of-type)': {
    borderBottom: '1px solid #e6ecf0',
  },
})

const PostFormContainer = glamorous.div({
  backgroundColor: '#eee',
  borderTop: '1px solid #ddd',
  borderBottom: '1px solid #ddd',
})

const PostFeed = ({ match }) => {
  const user = getUserById(getCurrentUserId())
  const postId = match.params.postid
  const post = getPostById(postId)

  return (
    <Scaffold grid>
      <ProfileSidebar {...user} />
      <Main>
        {!post ? (
          <div style={{ textAlign: 'center' }}>
            <MdFindInPage size={212} color="#ddd" />
            <p>This post doesn't exist.</p>
          </div>
        ) : (
          <PostContainer>
            <Post {...post} />

            <PostFormContainer>
              <PostForm
                placeholder={`Reply to @${user.username}`}
                parentId={postId}
                {...user}
              />
            </PostFormContainer>

            {post.comments && (
              <ul>
                {post.comments.map(comment => (
                  <li key={comment._id}>
                    <Post {...comment} />
                  </li>
                ))}
              </ul>
            )}
          </PostContainer>
        )}
      </Main>
    </Scaffold>
  )
}

export default PostFeed
