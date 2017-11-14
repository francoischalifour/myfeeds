import glamorous from 'glamorous'

const LoadMoreButton = glamorous.button({
  outline: 'none',
  padding: '12px 32px',
  borderRadius: '30px',
  color: '#666',
  background: 'transparent',
  cursor: 'pointer',
  font: 'inherit',
  border: '2px solid #999',
  fontWeight: 'bolder',
  transition: 'all 150ms',
  '&:hover': {
    textDecoration: 'none',
    backgroundColor: '#999',
    color: '#fff',
  },
})

export default LoadMoreButton
