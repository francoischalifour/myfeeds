const { objectifyProps } = require('../../../utils')
const { COLLECTION_POSTS, COLLECTION_FAVORITES } = require('../../../constants')

const Favorites = {
  async add(rawFav = {}, { db }) {
    const fav = objectifyProps({
      ...rawFav,
      created_at: new Date(),
    })
    let result

    const hasAlreadyFavorited = await db
      .collection(COLLECTION_FAVORITES)
      .findOne({
        user_id: fav.user_id,
        post_id: fav.post_id,
      })

    if (!hasAlreadyFavorited) {
      await db.collection(COLLECTION_FAVORITES).insertOne(fav)
      await db.collection(COLLECTION_POSTS).updateOne(
        {
          _id: fav.post_id,
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

    return result
  },
  async remove(rawFav = {}, { db }) {
    const star = objectifyProps({ ...rawFav })
    let result

    const isFavorited = await db.collection(COLLECTION_FAVORITES).findOne({
      user_id: star.user_id,
      post_id: star.post_id,
    })

    if (isFavorited) {
      await db.collection(COLLECTION_FAVORITES).deleteOne(star)
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

    return result
  },
}

module.exports = Favorites
