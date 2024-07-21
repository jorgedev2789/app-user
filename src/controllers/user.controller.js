import User from "../models/User.js";
import Role from "../models/Role.js";

export const createUser = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password, roles } = req.body;

    const rolesFound = await Role.find({ name: { $in: roles } });

    // creating a new User
    const user = new User({
      firstname,
      lastname,
      username,
      email,
      password,
      roles: rolesFound.map((role) => role._id),
    });

    // encrypting password
    user.password = await User.encryptPassword(user.password);

    // saving the new user
    const savedUser = await user.save();

    return res.status(200).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      roles: savedUser.roles,
    });
  } catch (error) {
    console.error(error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;
    const roles = ['admin']
    const rolesFound = await Role.find({ name: { $in: roles } });

    const body = {
      firstname,
      lastname,
      username,
      email,
      roles: rolesFound.map((role) => role._id),
    }
    if(password){
      // encrypting password
      body.password = await User.encryptPassword(password);
    }
    // saving the new user
    const savedUser = await User.findByIdAndUpdate(
      req.params.userId,
      body
    );
    req.flash('message', "User updated successfully")
    return res.redirect('/')
  } catch (error) {
    console.error(error);
  }
};

export const getUsers = async (req, res) => {
  const users = await User.paginate({}, { offset: req.query.offset, limit: req.query.limit})
  console.log(users)
  const total = await User.count({});
  const userData = {
    total,
    rows: users.docs.map(user => {
      return {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
      }
    })
  }
  return res.json(userData);
};

export const deleteUserById = async (req, res) => {
  const { userId } = req.params;

  await User.findByIdAndDelete(userId);

  req.flash('message', "User deleted successfully")
  return res.redirect('/')
};


export const getUser = async (req, res) => {
  const user = await User.findById(req.params.userId);
  return res.json(user);
};
