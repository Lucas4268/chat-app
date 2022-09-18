const User = require("../../models/User");

const getFriendsById = async ( userIdLogged ) => {
    const user = userIdLogged && await User.findById( userIdLogged ).select('friends').lean()

    const users = userIdLogged ? await User.find({ _id: { $in: user.friends } }).lean() : await User.find();


    return users;
};

module.exports = getFriendsById;
