import Parser from 'simple-text-parser'
import { STORAGE_TOKEN_USER_ID } from '../constants'

export const getCurrentUserId = () =>
  window.localStorage.getItem(STORAGE_TOKEN_USER_ID) // TODO: check validation token

export const deleteCurrentUserId = () =>
  window.localStorage.removeItem(STORAGE_TOKEN_USER_ID)

export const getLocationLink = location =>
  `https://www.google.com/maps/place/${location.replace(' ', '+')}`

export const cleanUrl = url => url.substr(url.indexOf('://') + 3)

export const formatText = text => {
  const parser = new Parser()

  parser.addRule(/(^|\s)(#[a-z\d-]+)/gi, tag => {
    const space = tag.startsWith(' ') ? ' ' : ''
    const cleanTag = tag.trim()
    return `${space}<a href="/hashtag/${cleanTag.substr(1)}">${cleanTag}</a>`
  })

  parser.addRule(/@[\S]+/gi, mention => `<a href="/${mention}">${mention}</a>`)

  parser.addRule(
    /https?[\S]+/gi,
    url => `<a href="${url}">${cleanUrl(url)}</a>`
  )

  return parser.render(text).replace(/[\\\n\r]/g, '<br>')
}
