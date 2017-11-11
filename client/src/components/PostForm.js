import React, { Component } from 'react'
import glamorous from 'glamorous'
import ProfilePicture from 'components/ProfilePicture'

const Container = glamorous.div({
  display: 'flex',
  padding: 16,
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

  onChange = value => {
    this.setState({ value })

    this.textarea.style.height = 'auto'
    this.textarea.style.height = `${this.textarea.scrollHeight}px`
  }

  onSubmit = async event => {
    event.preventDefault()

    const text = this.state.value.trim()
    if (text.length < 2) return

    this.props.onSubmit(text)

    this.setState({
      value: '',
    })
  }

  render() {
    const { profile_image_url: userImageUrl, username } = this.props

    return (
      <Container>
        <LeftContainer>
          <ProfilePicture src={userImageUrl} alt={username} width={36} />
        </LeftContainer>

        <RightContainer>
          <form onSubmit={this.onSubmit}>
            <Textarea
              rows="1"
              placeholder={this.props.placeholder || "What's happening?"}
              value={this.state.value}
              onChange={event => this.onChange(event.target.value)}
              onFocus={() => this.setState({ isFocused: true })}
              onBlur={() => this.setState({ isFocused: false })}
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
