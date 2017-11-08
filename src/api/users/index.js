import allUsers from './users.json'

export const getUserByUsername = username =>
  allUsers.find(user => user.username === username)

export const getUserById = userId => allUsers.find(user => user._id === userId)

export const getUserByEmail = email =>
  allUsers.find(user => user.email === email)

export const getPublicUserById = userId => {
  const { _id, created_at, email, ...publicProps } = allUsers.find(
    user => user._id === userId
  )

  return publicProps
}
