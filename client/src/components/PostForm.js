import React, { Component } from 'react'
import glamorous from 'glamorous'
import ProfilePicture from 'components/ProfilePicture'

const Container = glamorous.div({
  display: 'flex',
  padding: 16,
  boxShadow: '0 1px 4px rgba(0, 0, 0, .1)',
  borderBottom: '1px solid #e6ecf0',
  backgroundColor: '#eceff1',
})

const PictureContainer = glamorous.div({
  width: 36,
  height: 36,
  marginRight: 16,
  marginLeft: 12,
  textAlign: 'right',
  backgroundColor: '#212121',
  borderRadius: 4,
})

const TextContainer = glamorous.div({
  flex: 1,
  flexDirection: 'row',
  textAlign: 'right',
})

const Textarea = glamorous.textarea({
  width: '100%',
  borderRadius: 2,
  border: 'none',
  backgroundColor: '#fff',
  font: 'inherit',
  padding: 8,
  outline: 'none',
})

class PostForm extends Component {
  static defaultProps = {
    placeholder: "What's happening?",
  }

  state = {
    value: '',
    isFocused: false,
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeydown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydown)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isFocused === true) {
      this.textarea.focus()
    }
  }

  onFocus = () => this.setState({ isFocused: true })

  onBlur = () => {
    this.setState({ isFocused: false })
    this.props.onCommentIconBlur && this.props.onCommentIconBlur()
  }

  onKeydown = event => {
    const metaKey = event.metaKey || event.ctrlKey
    const KEY_ENTER = 13

    if (metaKey && event.which === KEY_ENTER) {
      this.textarea.blur()
      this.onSubmit(event)
    }
  }

  onChange = event => {
    this.setState({ value: event.target.value })

    this.textarea.style.height = 'auto'
    this.textarea.style.height = `${this.textarea.scrollHeight}px`
  }

  onSubmit = event => {
    event.preventDefault()

    const text = this.state.value.trim()
    if (text.length < 2) return

    this.props.onSubmit({ text, postId: this.props.parentId })

    this.setState({
      value: '',
    })
  }

  render() {
    return (
      <Container>
        <PictureContainer>
          {this.props.profile_image_url && (
            <ProfilePicture
              src={this.props.profile_image_url}
              alt={this.props.username}
              width={36}
            />
          )}
        </PictureContainer>

        <TextContainer>
          <form onSubmit={this.onSubmit}>
            <Textarea
              rows="1"
              placeholder={this.props.placeholder}
              value={this.state.value}
              onChange={this.onChange}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              innerRef={textarea => (this.textarea = textarea)}
            />
            <button
              className="button"
              type="submit"
              hidden={!this.state.value && !this.state.isFocused}
              disabled={this.state.value.length < 2}
            >
              Post
            </button>
          </form>
        </TextContainer>
      </Container>
    )
  }
}

export default PostForm
