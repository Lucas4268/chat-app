const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { generateJWT } = require("../../helpers/jwt");
const User = require("../../models/User");

const registerUser = async (req, res = response) => {
    const { userName, password } = req.body;

    try {
        const existUser = await User.findOne({ userName });

        if (existUser) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre de usuario ya existe.'
            })
        }

        const newUser = new User(req.body);

        const salt = bcryptjs.genSaltSync();
        newUser.password = bcryptjs.hashSync( password, salt );

        await newUser.save();

        const token = await generateJWT( newUser._id )

        res.json({
            ok: true,
            user: newUser,
            token
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Los sentimos, algo salió mal.'
        })
    }
};

module.exports = registerUser