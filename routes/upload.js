const { Router } = require("express");
const uploadImage = require("../controllers/upload/uploadImage");
// const { check } = require("express-validator");
// const getUsersByUserName = require("../controllers/users/getUsersByUserName");
// const { validateFields } = require("../middlewares/validateFields");
const { validateJWT } = require("../middlewares/validateJWT");

const router = Router()

// router.use( validateJWT );

router.post('/', uploadImage);


module.exports = router;
