import React, { Component } from 'react'
import glamorous from 'glamorous'

const Input = glamorous.input({
  background: 'none',
  border: 'none',
  borderRadius: 0,
  color: '#fff',
  marginBottom: '0 !important',
  paddingLeft: '6px !important',
})

class SearchForm extends Component {
  state = {
    search: this.props.value || '',
  }

  render() {
    return (
      <form action="/search">
        <Input
          type="search"
          name="q"
          value={this.state.search}
          onChange={event => this.setState({ search: event.target.value })}
          placeholder="Search myfeeds"
        />
      </form>
    )
  }
}

export default SearchForm
