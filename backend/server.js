const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// const router = require("./routes/Routes");
const { router, routerStore } = require("./routes/Routes");
const {
  middlewareVisitor,
  middlewareSetInterval,
  SessionConfiguration,
  SessionCard,
} = require("./midleware/midleware.js");
// connectDB
const connectDB = require("./config/url.js"); // MongoDB connection
// morgan & cors & dotenv
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const app = express();
// Database Connection
connectDB();
// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
// Parse methodOverride
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
// Set up view engine (if needed)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "frontend", "views"));
// Serve static files
const FRONTEND_PATH = path.join(__dirname, "../frontend");
app.use(express.static(FRONTEND_PATH));
// Static file routes
app.use("/css", express.static(path.join(FRONTEND_PATH, "css")));
app.use("/js", express.static(path.join(FRONTEND_PATH, "js")));
app.use("/img", express.static(path.join(FRONTEND_PATH, "img")));
app.use("/views", express.static(path.join(FRONTEND_PATH, "views")));
app.use(cookieParser());
// flash
const flash = require("express-flash");

middlewareSetInterval(); 
app.use("/", middlewareVisitor, router);
app.use(SessionConfiguration());
app.use(flash());
app.use(
  "/store",
  SessionCard,
  middlewareVisitor,
  routerStore
); 

 
 


/*
middlewareSetInterval(); 
app.use("/", middlewareVisitor, router);
app.use(flash());
app.use(
  "/store",
  SessionConfiguration(),
  SessionCard,
  middlewareVisitor,
  routerStore
); 
*/
// Error handling middleware
// app.use(errorHandler);
const file404 = path.join(__dirname, "../frontend/views/404.ejs")
app.use((req,res,next) => {
  res.status(404).render(file404)
})
// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
