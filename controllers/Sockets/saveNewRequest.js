const User = require("../../models/User")

const saveNewRequest = async(from, to) => {

  const userTo = await User.findById( to )
  const userFrom = await User.findById( from ).lean()

  userTo.requests = [ ...userTo.requests, from ]
  await userTo.save()

  return { userTo, userFrom }
}

module.exports = saveNewRequest