const User = require("../../models/User");

const userConnect = async (uid) => {
    const user = await User.findById(uid);
    user.online = true;
    await user.save();

    return user
};

module.exports = userConnect;