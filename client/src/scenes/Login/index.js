import React, { Component } from 'react'
import glamorous from 'glamorous'
import { STORAGE_TOKEN_USER } from '../../constants'
import api from 'api'

const Container = glamorous.div({
  padding: 24,
})

const Form = glamorous.form({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: 300,
  margin: '0 auto',
})

const Error = glamorous.p({
  color: '#D32F2F',
  fontWeight: 'bold',
  textAlign: 'center',
})

class LoginScene extends Component {
  state = {
    email: '',
    password: '',
    error: '',
  }

  onSubmit = async event => {
    event.preventDefault()

    const user = await api.login(this.state.email, this.state.password)

    if (user && user._id) {
      window.localStorage.setItem(STORAGE_TOKEN_USER, JSON.stringify(user))
      window.location.href = '/'
    } else {
      this.setState({
        error: 'Invalid email address or password.',
      })
    }
  }

  render() {
    return (
      <Container>
        <Form onSubmit={this.onSubmit}>
          {this.state.error && <Error>{this.state.error}</Error>}

          <input
            type="text"
            placeholder="Email"
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={this.state.password}
            onChange={e => this.setState({ password: e.target.value })}
          />

          <button className="button" disabled={!this.state.email}>
            Sign in
          </button>
        </Form>
      </Container>
    )
  }
}

export default LoginScene
