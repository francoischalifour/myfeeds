import Parser from 'simple-text-parser'
import { getUserByUsername } from '../api/users'

export const getCurrentUserId = () =>
  window.localStorage.getItem('myfeeds-userid') // TODO: check token

export const deleteCurrentUserId = () =>
  window.localStorage.removeItem('myfeeds-userid')

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
