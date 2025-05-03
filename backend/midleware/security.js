
// Middleware Security 
const jwt = require('jsonwebtoken');
const path = require("path");
const { Admin } = require("../config/ShematableWork.js");
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, "../.env1") }); 
// Auth Middleware
const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; 
    if (!token) return res.redirect('/login');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentAdmin = await Admin.findById(decoded.id);
    if (!currentAdmin) return res.redirect('/login');

    req.admin = currentAdmin;
    next();
  } catch (err) {
    res.redirect('/login');
  }
};
module.exports = protect