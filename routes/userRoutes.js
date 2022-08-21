const { register,login, setAvatar, getAllUsers } = require("../controllers/usersController");

const router = require("express").Router();

router.post('/register', register);
router.post('/login', login);
//define the route for setAvatar
router.post("/setAvatar/:id", setAvatar);
//here is a get request bcs we just want the data
router.get('/allusers/:id',getAllUsers)

module.exports = router;