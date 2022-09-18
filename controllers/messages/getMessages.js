const { response } = require("express");
const Message = require("../../models/Message");
const getGroupsByUser = require("../Sockets/getGrupsByUser");

const getMessages = async(req, res = response) => {
    const _id = req._id;
    // const to = req.params.to

    try {
        const groups = await getGroupsByUser( _id )
        const groupsId = groups.map( group => group._id.toString() )

        const messagesDB = await Message.find({
            $or: [
                { from: _id },
                { to: _id },
                { to: { $in: groupsId } }
            ]
        }).populate('from').lean()


        const usersRepeat = messagesDB.map( message => {
            return message.from._id.toString() === _id
                ? message.to.toString()
                : groupsId.includes( message.to.toString() )
                    ? message.to.toString()
                    : message.from._id.toString()
        })


        const users = []
        usersRepeat.forEach( user => {
            if (!users.includes(user)) {
                users.push(user)
            }
        })

        let messages = {}
        users.map( user => {
            let messagesThisUser = []

            if ( groupsId.includes( user ) ) {
                messagesThisUser = messagesDB.filter( message => message.to.toString() === user)
            } else {
                messagesThisUser = messagesDB.filter( message => (message.from._id.toString() === user &&  message.to.toString() === _id) || (message.to.toString() === user && message.from._id.toString() === _id))
            }

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