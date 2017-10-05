import { data as feeds } from './feeds.json'
import { getUserByUsername } from '../users'

export const getFeeds = ({ from, containing }) =>
  from
    ? feeds.filter(post => post.userid === getUserByUsername(from)._id)
    : containing
      ? feeds.filter(post => post.text.includes(`${containing}`))
      : feeds
