const dayjs = require("dayjs");
const Message = require("../../models/Message");

const saveMessage = async ( message ) => {
    const createdAt = new dayjs().subtract(3, 'hour').format('YYYY-MM-DDTHH:mm:ss.000Z')
    
    try {
        const newMessage = new Message( {...message, createdAt} )
        await newMessage.save()

        return newMessage.populate('from')
    } catch (err) {
        console.log(err)
        return false
    }
};

module.exports = saveMessage;
