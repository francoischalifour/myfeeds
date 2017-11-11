import glamorous from 'glamorous'

const ImageContainer = glamorous.div({
  overflow: 'hidden',
  position: 'absolute',
  bottom: '-85px',
  left: '50%',
  width: 150,
  height: 150,
  borderRadius: '50%',
  border: '2px solid white',
  backgroundColor: '#212121',
  transform: 'translateX(-50%)',
})

export default ImageContainer
