const User = require("../../models/User");

const getUsersOnline = async () => {
    const users = await User.find();
    return users;
};

module.exports = getUsersOnline;
