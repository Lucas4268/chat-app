const User = require("../../models/User");

const userDisconnect = async (uid) => {
    const user = await User.findById(uid);
    user.online = false;
    const algo = await user.save();
    console.log(algo)
    return user
};

module.exports = userDisconnect;