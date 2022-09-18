const User = require("../../models/User");

const userDisconnect = async (_id) => {
    const user = await User.findById(_id);
    user.online = false;
    await user.save();
    return user
};

module.exports = userDisconnect;