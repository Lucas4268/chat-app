const { response } = require("express");
const Message = require("../../models/Message");

const getMessages = async(req, res = response) => {
    const uid = req.uid;
    // const to = req.params.to

    try {
        const messagesDB = await Message.find({
            $or: [
                { from: uid },
                { to: uid }
            ]
        })

        const usersRepeat = messagesDB.map( message => {
            return message.from.toString() === uid ? message.to.toString() : message.from.toString()
        })

        const users = []
        usersRepeat.forEach( user => {
            if (!users.includes(user)) {
                users.push(user)
            }
        })

        let messages = {}
        users.map( user => {
            const messagesThisUser = messagesDB.filter( message => message.from.toString() === user || message.to.toString() === user)
            console.log(messagesThisUser)

            messages = {
                ...messages,
                [user]: messagesThisUser.reverse()
            }
        })


        res.json({
            ok: true,
            messages
        })
    } catch (err) {
        console.log(err);
        res.status( 500 ).json({
            ok: false,
            msg: 'Ocurrio un error.'
        })
    }
};

module.exports = getMessages