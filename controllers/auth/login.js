const { response } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../../models/User");
const { generateJWT } = require("../../helpers/jwt");

const login = async (req, res = response) => {

    const { userName, password } = req.body;

    try {
        const user = await User.findOne({ userName }).populate('requests');

        if ( !user ) {
            return res.status( 400 ).json({
                ok: false,
                msg: 'Nombre de usuario inexistente.'
            });
        }

        const validPassword = bcryptjs.compareSync( password, user.password );
        if ( !validPassword ) {
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña incorrecta.'
            });
        }

        const token = await generateJWT( user._id )

        // console.log('req.body.token')
        // console.log(req.body.tokenNotification)
        
        user.token = req.body.tokenNotification

        await user.save()

        res.json({
            ok: true,
            user,
            token
        })
        
    } catch (err) {
        console.log(err);
        res.status( 500 ).json({
            ok: false,
            msg: 'Los sentimos, algo salió mal.'
        })
    }
};

module.exports = login;
