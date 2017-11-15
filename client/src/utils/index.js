import Parser from 'simple-text-parser'
import { LOCALE_STORAGE_USER } from '../constants'

export const getActiveUser = () => {
  try {
    // TODO: check validation token
    return JSON.parse(window.localStorage.getItem(LOCALE_STORAGE_USER))
  } catch (err) {
    destroyActiveUser()
    window.location.reload()
  }
}

export const destroyActiveUser = () =>
  window.localStorage.removeItem(LOCALE_STORAGE_USER)

export const isLoggedIn = () => getActiveUser() && getActiveUser()._id

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
