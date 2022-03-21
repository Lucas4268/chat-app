const { generateJWT } = require("../../helpers/jwt");
const User = require("../../models/User");

const renewJWT = async(req, res) => {
    
    const notificationToken = req.header('n-token')
    const uid = req.uid;

    // Generar un nuevo JWT
    const token = await generateJWT( uid );

    // Obtener el usuario por UID
    const user = await User.findById( uid );

    user.token = notificationToken;

    await user.save()

    res.json({
        ok: true,
        user,
        token,
    })
}

module.exports = renewJWT