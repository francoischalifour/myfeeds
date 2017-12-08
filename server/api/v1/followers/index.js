const { objectifyProps } = require('../../../utils')
const { COLLECTION_FOLLOWERS } = require('../../../constants')

const Followers = {
  async add(rawFollow = {}, { db }) {
    const follow = objectifyProps({
      ...rawFollow,
      created_at: new Date(),
    })
    let result

    const isFollowed = await db.collection(COLLECTION_FOLLOWERS).findOne({
      follower_id: follow.follower_id,
      user_id: follow.user_id,
    })

    if (!isFollowed) {
      await db.collection(COLLECTION_FOLLOWERS).insertOne(follow)
      result = true
    } else {
      console.info('User has already followed this user.')
      result = false
    }

    return result
  },
  async remove(rawFollow = {}, { db }) {
    const follow = objectifyProps({ ...rawFollow })
    let result

    const isFollowed = await db.collection(COLLECTION_FOLLOWERS).findOne({
      follower_id: follow.follower_id,
      user_id: follow.user_id,
    })

    if (isFollowed) {
      await db.collection(COLLECTION_FOLLOWERS).deleteOne(follow)
      result = true
    } else {
      console.info('User has not followed this user yet.')
      result = false
    }

    return result
  },
}

module.exports = Followers
