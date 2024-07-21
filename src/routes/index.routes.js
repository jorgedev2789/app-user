import jwt from "jsonwebtoken";
import { SECRET } from "../config.js";

import {Router} from 'express'
import { authenticateToken } from "../middlewares/authJwt.js";
import User from "../models/User.js";

const router = Router()

router.get("/", [authenticateToken], async (req, res) => {

  const token = req.cookies.access_token

  const decoded = jwt.verify(token, SECRET);

  const user = await User.findById(decoded.id, { password: 0 });

  res.render('dashboard', { message: req.flash('message'), user });
});

router.get("/users", [authenticateToken], async (req, res) => {

  res.render('users/list', { message: req.flash('message')});
});

router.get("/users/create", [authenticateToken], async (req, res) => {

  res.render('users/create', { message: req.flash('message')});
});

router.get("/users/edit/:userId", [authenticateToken], async (req, res) => {
  const user = await User.findById(req.params.userId, { password: 0 });
  res.render('users/edit', 
    { 
      message: req.flash('message'), 
      user
    });
});


export default router