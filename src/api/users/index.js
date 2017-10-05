import { data as users } from './users.json'

export const getUserByUsername = username =>
  users.find(user => user.username === username)

export const getUserById = userId =>
  users.find(user => user._id === userId)

export const getUserByEmail = email =>
  users.find(user => user.email === email)

export const getPublicUserById = userId => {
  const {
    _id,
    created_at,
    email,
    ...publicProps
  } = users.find(user => user._id === userId)

  return publicProps
}
