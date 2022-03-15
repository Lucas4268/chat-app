const Message = require("../../models/Message");

const saveMessage = async ( message ) => {
    try {
        const newMessage = new Message( message );
        await newMessage.save()

        return newMessage
    } catch (err) {
        console.log(err)
        return false
    }
};

module.exports = saveMessage;
