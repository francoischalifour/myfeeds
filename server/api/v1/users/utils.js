const { COLLECTION_FOLLOWERS } = require('../../../constants')

/**
 * Returns the given user with metadata.
 * This data is specific to the given user.
 * Example: { ...post, followed: true }
 *
 * @param {object} user The user to get the data from
 * @param {number} userId The ID of the user to get the metadata for
 * @param {object} db The database object
 * @return {object}
 */
const getUserWithMetadata = async (user, userId, db) => {
  // const userId = await db.collection(COLLECTION_USERS).findOne({ username })
  const followed = !!await db.collection(COLLECTION_FOLLOWERS).findOne({
    follower_id: userId,
    user_id: user._id,
  })

  return {
    ...user,
    followed,
  }
}

module.exports = {
  getUserWithMetadata,
}
