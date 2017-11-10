import glamorous from 'glamorous'

export default glamorous.img(props => ({
  width: '100%',
  maxWidth: props.width || 200,
  borderRadius: 4,
  backgroundColor: '#fff',
}))
