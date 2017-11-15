import React, { Component } from 'react'
import api from 'api'
import { getLocalUser } from 'utils'
import { SITE_TITLE } from '../../constants'
import Loader from 'components/Loader'

class SettingsScene extends Component {
  async componentDidMount() {
    document.title = `Settings - ${SITE_TITLE}`

    this.user = await api.getPublicProfile({ userId: getLocalUser()._id })

    Object.keys(this.user).forEach(prop => {
      this.setState({
        [prop]: this.user[prop],
      })
    })
  }

  onChange = event => {
    const prop = event.target.id
    const value = event.target.value

    this.setState({
      [prop]: value,
    })
  }

  render() {
    return !this.user ? (
      <Loader />
    ) : (
      <ul>
        {Object.keys(this.user).map(prop => (
          <li key={prop}>
            <label htmlFor={prop}>{prop}</label>
            <input
              id={prop}
              type="text"
              value={this.state[prop]}
              onChange={this.onChange}
            />
          </li>
        ))}
      </ul>
    )
  }
}

export default SettingsScene
