import glamorous from 'glamorous'
import { Link } from 'react-router-dom'

const LinkButton = glamorous(Link)({
  padding: '16px 32px',
  borderRadius: '30px',
  color: '#fff',
  backgroundColor: '#212121',
  background: 'linear-gradient(to right, #006064, #212121)',
  boxShadow: '0 2px 4px 0 rgba(20, 20, 20, .32)',
  fontWeight: 'bolder',
  transition: 'all 150ms',
  '&:hover': {
    textDecoration: 'none',
    color: '#fff',
    boxShadow: '0 2px 6px 0 rgba(20, 20, 20, .64)',
  },
})

export default LinkButton
