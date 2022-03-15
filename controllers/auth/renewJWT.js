const { generateJWT } = require("../../helpers/jwt");
const User = require("../../models/User");

const renewJWT = async(req, res) => {

    const uid = req.uid;

    // Generar un nuevo JWT
    const token = await generateJWT( uid );

    // Obtener el usuario por UID
    const user = await User.findById( uid );

    res.json({
        ok: true,
        user,
        token,
    })
}

module.exports = renewJWT