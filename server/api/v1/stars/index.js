const connect = require('../../../utils/connect')
const { COLLECTION_POSTS, COLLECTION_STARS } = require('../../../constants')
const { objectifyProps } = require('../../../utils')

const Stars = {
  async add(rawStar) {
    const star = objectifyProps({
      ...rawStar,
      created_at: new Date(),
    })
    const db = await connect()
    let result

    const hasAlreadyStarred = await db.collection(COLLECTION_STARS).findOne({
      user_id: star.user_id,
      post_id: star.post_id,
    })

    if (!hasAlreadyStarred) {
      await db.collection(COLLECTION_STARS).insertOne(star)
      await db.collection(COLLECTION_POSTS).updateOne(
        {
          _id: star.post_id,
        },
        {
          $inc: { star_count: 1 },
        }
      )
      result = true
    } else {
      console.info('User has already starred this post.')
      result = false
    }

    db.close()

    return result
  },
  async remove(rawStar) {
    const star = objectifyProps({ ...rawStar })
    const db = await connect()
    let result

    const isStarring = await db.collection(COLLECTION_STARS).findOne({
      user_id: star.user_id,
      post_id: star.post_id,
    })

    if (isStarring) {
      await db.collection(COLLECTION_STARS).deleteOne(star)
      await db.collection(COLLECTION_POSTS).updateOne(
        {
          _id: star.post_id,
        },
        {
          $inc: { star_count: -1 },
        }
      )
      result = true
    } else {
      console.info('User has not starred this post yet.')
      result = false
    }

    db.close()

    return result
  },
}

module.exports = Stars
