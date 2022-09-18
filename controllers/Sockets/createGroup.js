const Group = require("../../models/Group")

const createGroup = async( group ) => {
  const groupDB = new Group( group )

  const newGroup = await groupDB.save({ new: true })

  return newGroup.populate('users admins')
}

module.exports = createGroup