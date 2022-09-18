const User = require("../../models/User")

const getTokenNotification = async( userId ) => {

  const user = await User.findById( userId )

  return user.tokenNotification
}


module.exports = getTokenNotification