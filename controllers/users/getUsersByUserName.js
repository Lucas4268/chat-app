const { response } = require("express");
const User = require("../../models/User");

const getUsersByUserName = async( req, res = response ) => {
  const { userName } = req.params;

  const user = await User.findOne({ userName })

  if ( !user ) {
    return res.status( 200 ).json({
      ok: true,
      user: null
    })
  }

  return res.status( 200 ).json({
    ok: true,
    user
  })
}


module.exports = getUsersByUserName