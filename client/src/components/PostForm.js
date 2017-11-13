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

const LeftContainer = glamorous.div({
  width: 64,
  paddingRight: 16,
  textAlign: 'right',
})

const RightContainer = glamorous.div({
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

  onSubmit = async event => {
    event.preventDefault()

    const text = this.state.value.trim()
    if (text.length < 2) return

    this.props.onSubmit({ text })

    this.setState({
      value: '',
    })
  }

  render() {
    return (
      <Container>
        <LeftContainer>
          <ProfilePicture
            src={this.props.profile_image_url}
            alt={this.props.username}
            width={36}
          />
        </LeftContainer>

        <RightContainer>
          <form onSubmit={this.onSubmit}>
            <Textarea
              rows="1"
              placeholder={this.props.placeholder || "What's happening?"}
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
              disabled={!this.state.value}
            >
              Post
            </button>
          </form>
        </RightContainer>
      </Container>
    )
  }
}

export default PostForm
