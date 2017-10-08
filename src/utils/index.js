import Parser from 'simple-text-parser'

export const getCurrentUserId = () =>
  window.localStorage.getItem('myfeeds-userid') // TODO: check token

export const deleteCurrentUserId = () =>
  window.localStorage.removeItem('myfeeds-userid')

export const getLocationLink = location =>
  `https://www.google.com/maps/place/${location.replace(' ', '+')}`

export const formatText = text => {
  const parser = new Parser()

  parser.addRule(
    /#[\S]+/gi,
    tag => `<a href="/hashtag/${tag.substr(1)}">${tag}</a>`
  )

  parser.addRule(/@[\S]+/gi, mention => `<a href="/${mention}">${mention}</a>`)

  parser.addRule(/https?[\S]+/gi, url => `<a href="${url}">${url}</a>`)

  return parser.render(text).replace(/[\\\n\r]/g, '<br>')
}
