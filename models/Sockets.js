const admin = require('firebase-admin');
const getFriendsById = require('../controllers/Sockets/getFriendsById');
const saveMessage = require('../controllers/Sockets/saveMessage');
const userConnect = require('../controllers/Sockets/userConnect');
const userDisconnect = require('../controllers/Sockets/userDisconnect');
const { verifyJWT } = require('../helpers/jwt');
const createGroup = require('../controllers/Sockets/createGroup');
const getGroupsByUser = require('../controllers/Sockets/getGrupsByUser');
const saveNewRequest = require('../controllers/Sockets/saveNewRequest');
const onAcceptRequest = require('../controllers/Sockets/onAcceptrequest');
const serviceAccount = require('../chatapp-fdaba-firebase-adminsdk-trbiz-67459b27c9.json');
const getNameById = require('../controllers/Sockets/getNameById');
const getTokenNotification = require('../controllers/Sockets/getTokenNotification');

admin.initializeApp({
    credential: admin.credential.cert( serviceAccount )
})
class Sockets {

    constructor( io ) {
        this.io = io;
        this.socketEvents();
    }

    socketEvents() {

        // const serviceAccount = require("../chatapp-35968-firebase-adminsdk-fy45o-6791df91c8.json");

        // const app = admin.initializeApp({
        //     credential: admin.credential.cert(serviceAccount)
        // });
        // const messaging = admin.messaging(app)

        
        this.io.on('connection', async ( socket ) => {
            // ***************************************************************************
            // ************************* CONEXION DEL USUARIO *************************
            // ***************************************************************************
            const [ valid, _id ] = verifyJWT( socket.handshake.query['x-token'] );

            console.log({_id})
            
            // validar usuario y conectarlo
            if (!valid) {
                return socket.disconnect();
            }

            const userConnected = await userConnect( _id );
            if (!userConnected) return socket.disconnect()
            socket.leave( _id ); // lo saco por si ya estaba
            socket.join( _id ); // usuario ingresado en su sala    
            
            const friends = await getFriendsById( _id )
            const groups = await getGroupsByUser( _id )
                groups.map( group => {
                    socket.leave( group._id.toString() )
                    socket.join( group._id.toString() )
                }) // unir al usuario a todos sus grupos

            // const messagesOfGroups = getGroupsMessages( groups )
            
            socket
                // .to( _id )
                .emit('list-users', { friends, groups }); // se emite la lista de amigos al usuario que ingreso
            
            socket
                .broadcast
                .to(userConnected.friends.map(f => f.toString()))
                .emit('user-connected', _id) // se emite a sus amigos que el se conecto

            // ***************************************************************************
            // *********************** ENVIO DE MENSAJES PERSONALES ***********************
            // ***************************************************************************
            socket.on('personal-message', async(payload) => {

                // guardar mensage
                const message = await saveMessage( payload );

                const { name } = await getNameById( message.from )
                const tokenNotification = await getTokenNotification( message.to )

                await admin.messaging().send({
                    token: tokenNotification,
                    notification: {
                        title: name,
                        body: message.message,
                    }
                })

                socket.emit('personal-message', message);
                socket.to( payload.to ).emit('personal-message', message);
                
                
                // await messaging.send({
                //     token: payload.token,
                //     notification: {
                //         "title": message.from.name,
                //         "body": payload.message
                //     }
                // })
            })

            // ***************************************************************************
            // ******************************* GRUPOS ************************************
            // ***************************************************************************
            socket.on('group-message', async(payload) => {
                const message = await saveMessage( payload );
                // emitir para user y grupo
                // console.log('GROUP MESSAGE')
                this.io.to( payload.to ).to( payload.from ).emit('group-message', message);
            })

            socket.on('new-group', async(group, callback) => {
                const newGroup = await createGroup( group )
                callback( newGroup )
                
                // console.log('JOIN ADMIN')
                socket.leave( newGroup._id.toString() )
                socket.join( newGroup._id.toString() )

                this.io.to( [ ...newGroup.users.map(u => u._id.toString()) ] ).emit('new-group', newGroup )
            })
            
            socket.on('join-to-new-group', group => {
                // console.log('JOIN')
                socket.leave( group._id.toString() )
                socket.join( group._id.toString() )
            })

            // socket.on('join-groups', async(_id) => {
            //     const groups = await getGroupsByUser( _id )
            //     groups.map( group => {
            //         socket.join( group._id )
            //     })
            // })


            // ***************************************************************************
            // ******************************* INVITACIONES ******************************
            // ***************************************************************************
            socket.on('send-request', async({from, to}) => {
                const { userFrom, userTo } = await saveNewRequest( from, to )
                socket.broadcast.to( to ).emit('send-request', userFrom)
            })

            socket.on('accept-request', async({from, to}) => {
                console.log(socket.rooms)
                //sacar la req de lolo de lucas yo 
                const userTo = await onAcceptRequest( from, to )
                // emitir para modificar estado
                socket.broadcast.to( from ).emit('accept-request', userTo) // se emite que "to" acepto la solicitud
            })


            // ***************************************************************************
            // ********************************* TYPiNG *********************************
            // ***************************************************************************
            socket.on('typing', ({from, to, isTyping}) => {
                this.io.to( to ).emit('typing', {_id: from, isTyping})
            })

            


            
            // ***************************************************************************
            // ************************* DESCONEXION DEL USUARIO *************************
            // ***************************************************************************
            socket.on('is-disconnect', async () => {
            })
            socket.on('disconnect', async () => {
                const userDisconnected = await userDisconnect( _id );
    
                socket.broadcast.to( userDisconnected.friends.map(f => f.toString())).emit('user-disconnected', _id);
    
                console.log('Disconnected');
                socket.disconnect()
            });
        });
    }
}

module.exports = Sockets;
