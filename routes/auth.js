const { Router } = require("express");
const { check } = require("express-validator");
const login = require("../controllers/auth/login");
const registerUser = require("../controllers/auth/registerUser");
const renewJWT = require("../controllers/auth/renewJWT");
const { validateFields } = require("../middlewares/validateFields");
const { validateJWT } = require("../middlewares/validateJWT");

const router = Router();


router.post(
    '/login',
    [
        check('userName', 'El nombre de usuario es requerido.').trim().not().isEmpty(),
        check('password', 'La contraseña es requerida.').trim().not().isEmpty(),
        validateFields
    ],
    login
)

router.post(
    '/register',
    [
        check('userName', 'El nombre de usuario es requerido.').trim().not().isEmpty(),
        check('name', 'El nombre es requerido.').trim().not().isEmpty(),
        // check('phone', 'El teléfono es requerido.').trim().not().isEmpty(),
        check('password', 'La contraseña es requerida.').trim().not().isEmpty(),
        validateFields
    ],
    registerUser
)

router.get('/renew', validateJWT, renewJWT)

module.exports = router