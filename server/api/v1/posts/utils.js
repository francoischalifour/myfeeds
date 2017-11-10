const { COLLECTION_USERS } = require('../../../constants')
/**
 * Merges the given posts with their authors' information to send only one response to the client.
 * To improve the efficiency, it looks up in a user reference object if the author is already known
 * to not request the database when not needed.
 *
 * This function triggers side effects since it merges the results.
 *
 * @param {object[]} posts The posts to populate with the authors
 * @param {object} db The database object
 * @private
 */
const mergePostsWithAuthors = async (posts, db) => {
  const userLookup = {}

  for (let post of posts) {
    const authorId = post.user_id

    if (!userLookup[authorId]) {
      const author = await db
        .collection(COLLECTION_USERS)
        .findOne({ _id: authorId })

      userLookup[authorId] = getAuthorData(author)
    }

    Object.assign(post, userLookup[authorId])
  }
}

/**
 * Returns the author's public information to be merged with the post.
 *
 * @param {object} author The author to get the data from
 * @return {object}
 * @private
 */
const getAuthorData = author => ({
  username: author.username,
  name: author.name,
  profile_image_url: author.profile_image_url,
})

/**
 * Returns posts with highlighted search results.
 *
 * This is a custom function because MongoDB cannot return matching elements.
 *
 * Uses a regex to ignore all non-alphanumerical characters.
 *  - `\w` is any digit, letter, or underscore.
 *  - `\s` is any whitespace.
 *  - `[^\w\s]` is anything that's not a digit, letter, whitespace, or underscore.
 *  - `[^\w\s]|_` is the same as #3 except with the underscores added back in.
 * See: https://stackoverflow.com/a/4328546
 *
 * @param {object[]} posts The posts to highlight terms in
 * @param {string} terms The terms to highlight
 * @param {string} tag The tag to wrap the terms with
 * @return {object[]}
 * @private
 */
const highlightTerms = (posts, terms, tag = 'em') => {
  const words = terms
    .replace(/[^\w\s]|_/g, ' ')
    .replace(/\s+/g, ' ')
    .split(' ')

  return posts.map(post => {
    words.forEach(word => {
      const regex = new RegExp(word, 'gi')
      post.text = post.text.replace(regex, `<${tag}>${word}</${tag}>`)
    })
    return post
  })
}

module.exports = {
  getAuthorData,
  mergePostsWithAuthors,
  highlightTerms,
}
