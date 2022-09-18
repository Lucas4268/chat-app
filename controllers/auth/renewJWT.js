const { generateJWT } = require("../../helpers/jwt");
const User = require("../../models/User");

const renewJWT = async(req, res) => {
    
    // const notificationToken = req.header('n-token')
    const _id = req._id;

    // Generar un nuevo JWT
    const token = await generateJWT( _id );

    // Obtener el usuario por _id
    const user = await User.findById( _id );

    // user.token = notificationToken;

    // await user.save()

    res.json({
        ok: true,
        user,
        token,
    })
}

module.exports = renewJWT