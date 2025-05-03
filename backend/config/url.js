// MongoDB URL For Connect
const mongoose = require("mongoose");
const path = require("path")
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, "../.env1") }); 
const connectDB = async() => { 
//  MongoDB Connection
 const dbUsername = process.env.DB_USERNAME;
 const dbPassword = process.env.DB_PASSWORD;
 const dbName = process.env.DB_NAME;
 const url = `mongodb+srv://${dbUsername}:${dbPassword}@cluster0.j34l9od.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

// Connect to MongoDB
mongoose.connect(url).then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));
 }
 module.exports = connectDB;