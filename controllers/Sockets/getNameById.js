const User = require("../../models/User")

const getNameById = async ( userId ) => {

  const user = await User.findById( userId ).lean()

  return {
    name: user.name,
    tokenNotification: user.tokenNotification
  }
}


module.exports = getNameById