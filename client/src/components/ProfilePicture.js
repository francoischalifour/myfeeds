import glamorous from 'glamorous'

const ProfilePicture = glamorous.img(props => ({
  width: '100%',
  maxWidth: props.width || 'initial',
  borderRadius: 4,
  backgroundColor: '#fff',
}))

export default ProfilePicture
