import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Role from "../models/Role.js";
import { SECRET } from "../config.js";

export const signupHandler = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;

    // Creating a new User Object
    const newUser = new User({
      username,
      email,
      password,
    });

    // checking for roles
    if (roles) {
      const foundRoles = await Role.find({ name: { $in: roles } });
      newUser.roles = foundRoles.map((role) => role._id);
    } else {
      const role = await Role.findOne({ name: "user" });
      newUser.roles = [role._id];
    }

    // Saving the User Object in Mongodb
    const savedUser = await newUser.save();

    // Create a token
    const token = jwt.sign({ id: savedUser._id }, SECRET, {
      expiresIn: 86400, // 24 hours
    });

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const signinHandler = async (req, res) => {
  try {
    // Request body email can be an email or username
    const userFound = await User.findOne({ email: req.body.email }).populate(
      "roles"
    );

    if (!userFound) {
      req.flash('error', "User Not Found")
      return res.redirect('/');
    }

    const matchPassword = await User.comparePassword(
      req.body.password,
      userFound.password
    );

    if (!matchPassword)
    {
      req.flash('error', "Invalid Password")
      return res.redirect('/');
    }

    const token = jwt.sign({ id: userFound._id }, SECRET, {
      expiresIn: 86400, // 24 hours
    });
    return res.cookie('access_token', token).redirect('/');
  } catch (error) {
    console.log(error);
  }
};

export const logoutHandler = async (req, res) => {
  try {
    return res.cookie('access_token', '', {expires: new Date(0)}).redirect('/');
  } catch (error) {
    console.log(error);
  }
};
