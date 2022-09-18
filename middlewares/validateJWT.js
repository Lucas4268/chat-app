const jwt = require('jsonwebtoken');


const validateJWT = ( req, res, next ) => {

    try {
        const token = req.header('x-token');
        if ( !token ) {
            return res.status(401).json({
                ok: false,
                msg: 'No hay token en la petición'
            });
        }

        const { _id } = jwt.verify( token, process.env.JWT_KEY );
        req._id = _id;

        next();

    } catch (e) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no es válido'
        });
    }



}


module.exports = {
    validateJWT
}