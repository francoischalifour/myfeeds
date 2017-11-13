import glamorous from 'glamorous'

const PostList = glamorous.ul({
  '& > li': {
    backgroundColor: '#fff',
    boxShadow: '0 1px 4px rgba(0, 0, 0, .1)',
    ':not(:last-of-type)': {
      borderBottom: '1px solid #e6ecf0',
    },
    '&:hover': {
      backgroundColor: '#fafafa',
      cursor: 'pointer',
    },
  },
})

export default PostList
