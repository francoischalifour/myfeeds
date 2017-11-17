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

const SubmitButton = glamorous.button({
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

class SignupScene extends Component {
  state = {
    name: '',
    username: '',
    email: '',
    password: '',
    error: '',
    fetching: false,
  }

  componentDidMount() {
    document.title = `Sign up - ${SITE_TITLE}`
  }

  onSubmit = async event => {
    event.preventDefault()

    this.setState({
      fetching: true,
    })

    const result = await api.signup({
      name: this.state.name,
      username: this.state.username,
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
    const valid =
      this.state.name &&
      this.state.username &&
      this.state.email &&
      this.state.password

    return (
      <Container>
        <Form onSubmit={this.onSubmit}>
          {this.state.error && <Error>{this.state.error}</Error>}

          <input
            type="text"
            placeholder="Full name"
            value={this.state.name}
            onChange={e => this.setState({ name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Username"
            value={this.state.username}
            onChange={e => this.setState({ username: e.target.value })}
          />
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

          <SubmitButton
            className="button"
            disabled={!valid || this.state.fetching}
          >
            {this.state.fetching
              ? [
                  <Loader color="#fff" size={32} key="Loader" />,
                  'Signing up...',
                ]
              : 'Sign up'}
          </SubmitButton>

          <p style={{ textAlign: 'center' }}>
            <Link to="/">Already have an account? Sign in.</Link>
          </p>
        </Form>
      </Container>
    )
  }
}

export default SignupScene
