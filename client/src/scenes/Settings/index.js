import React, { Component } from 'react'
import glamorous from 'glamorous'
import api from 'api'
import { getLocalUser } from 'utils'
import { LOCAL_STORAGE_USER, SITE_TITLE } from '../../constants'
import Scaffold from 'components/Scaffold'
import Content from 'components/Content'
import Sidebar from 'components/Sidebar'
import Loader from 'components/Loader'

const Error = glamorous.p({
  color: '#D32F2F',
  fontWeight: 'bold',
  textAlign: 'center',
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

const getPropName = prop =>
  prop === 'profile_image_url'
    ? 'Image URL'
    : prop.charAt(0).toUpperCase() + prop.substr(1)

class SettingsScene extends Component {
  activeUser = getLocalUser()

  constructor(props) {
    super(props)
    const { _id, ...user } = this.activeUser

    this.state = {
      user,
      error: '',
      valid: true,
      fetching: false,
    }
  }

  async componentDidMount() {
    document.title = `Settings - ${SITE_TITLE}`
  }

  onChange = event => {
    const prop = event.target.id
    const value = event.target.value

    this.setState(state => ({
      user: {
        ...state.user,
        [prop]: value,
      },
    }))
  }

  onSubmit = async event => {
    event.preventDefault()

    this.setState({
      fetching: true,
    })

    const user = {
      ...this.state.user,
      _id: this.activeUser._id,
    }

    const result = await api.update(user)

    if (!result.error) {
      window.localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(result))
      this.setState({
        fetching: false,
        error: '',
      })
      window.location.reload()
    } else {
      this.setState({
        fetching: false,
        error: result.message,
      })
    }
  }

  render() {
    const valid =
      this.state.user.name && this.state.user.username && this.state.user.email

    return (
      <Scaffold grid>
        <Sidebar user={this.activeUser} />
        <Content className="content">
          <form onSubmit={this.onSubmit}>
            {this.state.error && <Error>{this.state.error}</Error>}

            <ul>
              {Object.keys(this.state.user).map(prop => (
                <li key={prop}>
                  <label htmlFor={prop}>{getPropName(prop)}</label>
                  <input
                    id={prop}
                    type="text"
                    value={this.state.user[prop]}
                    onChange={this.onChange}
                  />
                </li>
              ))}
            </ul>

            <SubmitButton
              className="button"
              disabled={!valid || this.state.fetching}
            >
              {this.state.fetching
                ? [
                    <Loader color="#fff" size={32} key="Loader" />,
                    'Updating...',
                  ]
                : 'Update'}
            </SubmitButton>
          </form>
        </Content>
      </Scaffold>
    )
  }
}

export default SettingsScene
