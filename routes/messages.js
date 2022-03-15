const { Router } = require("express");
const getMessages = require("../controllers/messages/getMessages");
const { validateJWT } = require("../middlewares/validateJWT");

const router = Router()

router.get('/', validateJWT, getMessages);


module.exports = router;
