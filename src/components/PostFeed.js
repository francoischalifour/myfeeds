import React from 'react'
import glamorous from 'glamorous'
import { MdFindInPage } from 'react-icons/lib/md'
import { getCurrentUserId } from '../utils'
import { getUserById } from '../api/users'
import { getPostById, getPostRepliesById } from '../api/posts'
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
  const replies = getPostRepliesById(postId)

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
                placeholder={`Reply to @${getUserById(post.user_id).username}`}
                parentId={postId}
                {...user}
              />
            </PostFormContainer>

            {replies && (
              <ul>
                {replies.map(reply => (
                  <li key={reply._id}>
                    <Post {...reply} />
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
