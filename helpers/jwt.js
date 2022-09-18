const jwt = require('jsonwebtoken');


const generateJWT = ( _id ) => {

    return new Promise(  ( resolve, reject ) => {

        const payload = { _id };

        jwt.sign( payload, process.env.JWT_KEY, {
            expiresIn: '30d'
        }, ( err, token ) => {

            if ( err ) {
                console.log(err);
                reject('No se pudo generar el JWT.');
            } else {
                resolve( token );
            }
        });
    });
}

const verifyJWT = ( token = '' ) => {

    try {
        const { _id } = jwt.verify( token, process.env.JWT_KEY );

        return [ true, _id ];

    } catch (error) {
        return [ false, null ];
    }

}

module.exports = {
    generateJWT,
    verifyJWT
}