import Parser from 'simple-text-parser'
import hasha from 'hasha'
import { getUserById, getUserByUsername } from '../api/users'

const isValidToken = () => {
  const userId = window.localStorage.getItem('myfeeds-userid')
  const token = window.localStorage.getItem('myfeeds-token')
  const { email = '' } = getUserById(userId) || {}

  return token === hasha(`${email}#${userId}`)
}

export const logUser = user => {
  const token = hasha(`${user.email}#${user._id}`)

  window.localStorage.setItem('myfeeds-userid', user._id)
  window.localStorage.setItem('myfeeds-token', token)
}

export const getCurrentUserId = () =>
  isValidToken() && window.localStorage.getItem('myfeeds-userid')

export const deleteCurrentUserId = () => {
  if (isValidToken()) {
    window.localStorage.removeItem('myfeeds-userid')
    window.localStorage.removeItem('myfeeds-token')
  }
}

export const getLocationLink = location =>
  `https://www.google.com/maps/place/${location.replace(' ', '+')}`

export const cleanUrl = url => url.substr(url.indexOf('://') + 3)

export const formatText = text => {
  const parser = new Parser()

  parser.addRule(
    /#[\S]+/gi,
    tag => `<a href="/hashtag/${tag.substr(1)}">${tag}</a>`
  )

  parser.addRule(
    /@[\S]+/gi,
    mention =>
      getUserByUsername(mention.substr(1))
        ? `<a href="/${mention}">${mention}</a>`
        : mention
  )

  parser.addRule(
    /https?[\S]+/gi,
    url => `<a href="${url}">${cleanUrl(url)}</a>`
  )

  return parser.render(text).replace(/[\\\n\r]/g, '<br>')
}
