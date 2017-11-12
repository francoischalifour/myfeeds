import glamorous from 'glamorous'

const Button = glamorous.button({
  outline: 'none',
  cursor: 'pointer',
  padding: '12px',
  borderRadius: '50%',
  color: '#aaa',
  font: 'inherit',
  border: '2px solid #aaa',
  background: 'transparent',
  fontWeight: 'bolder',
  transition: 'all 150ms',
  '&:hover': {
    color: '#999',
  },
})

export default Button
