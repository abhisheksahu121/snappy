const User = require("../model/userModel");
const bcrypt = require("bcrypt"); //it is used for encryption of the password

module.exports.register = async (req, res, next) => {
  try {
    //    console.log(req.body);
    const { username, email, password } = req.body;
    //check if the username present in the database or not if its not present then it findone function return false
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });

    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    //if all is fine then we encrypt the password
    //for this in the hash function we passed the password and salt value so the salt value nothing but the type of incryption
    const hashedPassword = await bcrypt.hash(password, 10);
    //after this we will use user.create() method to insert the item into the database
    //and it will return the userId and all the information of the user that hash been created into the database
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    //so here we are delete user password bcs we dont need the password from here
    //and we will return the user object
    delete user.password;
    return res.json({ status: true, user });
  } catch (err) {
    next(err);
  } //if any err ocure here will chatch that and ask it to the next middlwear
};

//Login
module.exports.login = async (req, res, next) => {
  try {
    //    console.log(req.body);
    const { username, password } = req.body;
   
    //check if the username present in the database or not if its not present then it findone function return false
   
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect username or password", status: false });
    
      //so waht we do here we compare the password which was sent from the frontend and the password which is inside the database and by using compare method
    //we compare that and this compare method bcypt the password and return the boolean
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid)
    return res.json({ msg: "Incorrect username or password", status: false });
    
    //delete the password from the user object
    delete user.password;
    return res.json({ status: true, user });
  } catch (err) {
    next(err);
  } //if any err ocure here will chatch that and ask it to the next middlwear
};


//setAvatar
module.exports.setAvatar = async (req,res,next) => {
try {
  const userId = req.params.id;
  const avatarImage = req.body.image;
  const userData = await User.findByIdAndUpdate(userId, {
    isAvatarImageSet: true,
    avatarImage,
  });
  return res.json({
    isSet: userData.isAvatarImageSet,
    image: userData.avatarImage,
  });
} catch (err) {
  //will pass the exception to the next
  next(err)
}
};

//Contact
module.exports.getAllUsers = async (req, res, next) => {
  try {
    //so this will select all the users id except our user id and
    //we select certen value from it so we use the select method and here we dont want password to be sended to the user
    const users = await User.find({_id: {$ne: req.params.id}}).select([
      "email",
      "username",
      "avatarImage",
      "_id"
    ]);
    return res.json(users);
  } catch (err) {
    next(err);
  }
}