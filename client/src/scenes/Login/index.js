import React, { Component } from 'react'
import glamorous from 'glamorous'
import { LOCAL_STORAGE_USER } from '../../constants'
import api from 'api'
import Loader from 'components/Loader'

const Container = glamorous.div({
  padding: 24,
})

const Form = glamorous.form({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: 300,
  margin: '0 auto',
})

const LoginButton = glamorous.button({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '& svg': {
    position: 'absolute',
    right: '24',
  },
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
    fetching: false,
  }

  onSubmit = async event => {
    event.preventDefault()

    this.setState({
      fetching: true,
    })

    const user = await api.login({
      email: this.state.email,
      password: this.state.password,
    })

    if (user && user._id) {
      window.localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(user))
      window.location.href = '/'
    } else {
      this.setState({
        fetching: false,
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
            type="email"
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

          <LoginButton
            className="button"
            disabled={!this.state.email || this.state.fetching}
          >
            {this.state.fetching
              ? [
                  <Loader color="#fff" size={32} key="Loader" />,
                  'Signing in...',
                ]
              : 'Sign in'}
          </LoginButton>
        </Form>
      </Container>
    )
  }
}

export default LoginScene
