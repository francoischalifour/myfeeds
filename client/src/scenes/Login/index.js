import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import glamorous from 'glamorous'
import { LOCAL_STORAGE_USER, SITE_TITLE } from '../../constants'
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

  componentDidMount() {
    document.title = `Login - ${SITE_TITLE}`
  }

  onSubmit = async event => {
    event.preventDefault()

    this.setState({
      fetching: true,
    })

    const result = await api.login({
      email: this.state.email,
      password: this.state.password,
    })

    if (!result.error) {
      window.localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(result))
      window.location.href = '/'
    } else {
      this.setState({
        fetching: false,
        error: result.message,
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

          <p style={{ textAlign: 'center' }}>
            <Link to="/signup">Don’t have an account yet? Sign up.</Link>
          </p>
        </Form>
      </Container>
    )
  }
}

export default LoginScene
