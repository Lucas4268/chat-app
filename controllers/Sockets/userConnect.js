const User = require("../../models/User");

const userConnect = async (_id) => {
    const user = await User.findById(_id);
    if (!user) return null;
    
    user.online = true;
    await user.save();

    return user
};

module.exports = userConnect;