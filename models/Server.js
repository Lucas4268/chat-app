const express  = require('express');
const http     = require('http');
const socketio = require('socket.io');
const path     = require('path');
const cors     = require('cors');
const { dbConnection } = require('../database/config');
const Sockets = require('./Sockets');


class Server {

    constructor() {
        this.app = express()
        this.port = process.env.PORT

        // **************************************Coneccion a BDD**************************************
        this.conectDB()
        
        // ****************************************Http server****************************************
        this.server = http.createServer( this.app );

        // *********************************Configuraciones de sockets*********************************
        this.io = socketio( this.server, { path: '/my-custom-path-elmpa/' } );

        // *****************************************Middlewares*****************************************
        this.middlewares()

        // ************************************Rutas de la aplicacion************************************
        this.routes()
        
        // *******************************************Sockets*******************************************
        this.configSocket()
    }


    async conectDB() {
        await dbConnection()
    }



    middlewares() {
        //******************************************** CORS********************************************
        this.app.use(cors())

        // ***************************************Parseo del body***************************************
        this.app.use( express.json() )

        //************************************** Directorio publico**************************************
        this.app.use( express.static( path.resolve( __dirname, '../public' ) ) );
    }


    routes() {

        this.app.use('/api/auth', require('../routes/auth'))
        
        this.app.use('/api/messages', require('../routes/messages'))
        
        this.app.use('/api/users', require('../routes/users'))

        this.app.use('/api/upload', require('../routes/upload'))
    }

    configSocket() {
        new Sockets( this.io )
    }


    listen() {
        this.server.listen( this.port, () => {
            console.log(`Servidor corriendo en puerto: ${this.port}`)
        })
    }

}


module.exports = Server