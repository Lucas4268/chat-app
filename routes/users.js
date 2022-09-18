const { Router } = require("express");
const { check } = require("express-validator");
const getMessages = require("../controllers/messages/getMessages");
const getUsersByUserName = require("../controllers/users/getUsersByUserName");
const { validateFields } = require("../middlewares/validateFields");
const { validateJWT } = require("../middlewares/validateJWT");

const router = Router()

router.use( validateJWT );

router.get(
  '/:userName',
  [
    check('userName', 'El nombre de usuario es requerido.').trim().not().isEmpty(),
    validateFields
  ],
  getUsersByUserName
);


module.exports = router;
