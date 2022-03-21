const getUsersOnline = require('../controllers/Sockets/getUsersOnline');
const saveMessage = require('../controllers/Sockets/saveMessage');
const userConnect = require('../controllers/Sockets/userConnect');
const userDisconnect = require('../controllers/Sockets/userDisconnect');
const { verifyJWT } = require('../helpers/jwt');
const admin = require('firebase-admin')

class Sockets {

    constructor( io ) {
        this.io = io;
        this.socketEvents();
    }

    socketEvents() {

        const serviceAccount = require("../chatapp-35968-firebase-adminsdk-fy45o-6791df91c8.json");

        const app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        const messaging = admin.messaging(app)

        
        this.io.on('connection', async ( socket ) => {
            const [ valid, uid ] = verifyJWT( socket.handshake.query['x-token'] );
            // validar usuario y conectarlo
            if (!valid) {
                return socket.disconnect();
            }
            
            console.log('Connected')
            await userConnect( uid );
            socket.join( uid );

            this.io.emit('list-users', await getUsersOnline());


            socket.on('personal-message', async(payload) => {
                // guardar mensage
                const message = await saveMessage( payload );

                
                await messaging.send({
                    token: payload.token,
                    data: {
                        "message": payload.message,
                        "fromUser": message.from.name
                    }
                })        

                // emitir para ambos
                console.log(message)
                this.io.to( payload.to ).emit('personal-message', message);
                this.io.to( payload.from ).emit('personal-message', message);
            })
            


            
            
            socket.on('is-disconnect', async () => {
                await userDisconnect( uid );
                this.io.emit('list-users', await getUsersOnline());
                console.log('Disconnected');
                socket.disconnect()
            })
            socket.on('disconnect', async () => {
                // desconectar y emitir a todos los usuarios
                // await userDisconnect( uid );
                // this.io.emit('list-users', await getUsersOnline());
                console.log('Disconnecteddddddd');
            });
        });
    }
}

module.exports = Sockets;
