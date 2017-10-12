import React, { Component } from 'react'
import glamorous from 'glamorous'
import { logUser } from '../utils'
import { getUserByEmail } from '../api/users'

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

export default class Login extends Component {
  state = {
    email: '',
    password: '',
    error: '',
  }

  onSubmit = event => {
    event.preventDefault()

    const user = getUserByEmail(this.state.email)
    // TODO: check `this.state.password`

    if (!user) {
      this.setState({
        error: 'Invalid email address or password.',
      })
    } else {
      logUser(user)
      window.location.href = '/'
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
