const User = require("../../models/User")

const onAcceptRequest = async( from, to ) => {
  const userTo = await User.findById( to )
  const userFrom = await User.findById( from )

  userTo.requests = userTo.requests.filter( r => r.toString() !== from )


  userTo.friends = [ ...userTo.friends, from ]
  userFrom.friends = [ ...userFrom.friends, to ]

  Promise.all([await userTo.save(), await userFrom.save()])
  // await userTo.save()

  // await userFrom.save()

  return userTo
}

module.exports = onAcceptRequest