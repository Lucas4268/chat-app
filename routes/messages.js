const { Router } = require("express");
const getMessages = require("../controllers/messages/getMessages");
const { validateJWT } = require("../middlewares/validateJWT");

const router = Router()

router.use( validateJWT );

router.get('/', getMessages);


module.exports = router;
