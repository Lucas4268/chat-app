const Group = require("../../models/Group")

const getGroupsByUser = async( _id ) => {
  const groups = await Group.find(
    {
      $or: [
        {
          users: {
            $all: [ _id ]
          }
        },
        {
          admins: {
            $all: [ _id ]
          }
        }
      ]
    }).populate('users admins').lean()

  return groups
}


module.exports = getGroupsByUser