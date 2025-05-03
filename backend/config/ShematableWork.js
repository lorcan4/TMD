const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// Mongoose model
const workoutSchema = new mongoose.Schema({
  name: String,
  time: String, 
  day: String,
  timeRange: String,
});
const Workout = mongoose.model("Workout", workoutSchema);
// Comment Schema
const commentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  text: { type: String, required: true },
  gender: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  workoutType: { type: String, required: true },
});
const Comment = mongoose.model("Comment", commentSchema);
// News Schema
const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  buttonText: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});
const News = mongoose.model("news", NewsSchema);
// Traffic Schema
const trafficSchema = new mongoose.Schema({
  totalVisitors: { type: Number, default: 0 },
  onlineUsers: { type: Number, default: 0 },
  monthlyVisitors: [
    {
      month: String, // e.g., "04-2025"
      count: { type: Number, default: 0 },
    },
  ],
  pageViews: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
});
const Traffic = mongoose.model("Traffic", trafficSchema);
// Visitor Schema
const MembersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  coachPrice: {
    type: Number,
    required: true,
  },
  earnings: {
    type: Number,
    required: true,
  },
  visitTime: {
    type: Date,
    default: Date.now,
  },
});
const Member = mongoose.model("Member", MembersSchema);
// test
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ["supplements", "equipment", "apparel", "accessories"],
    required: true,
  },
  image: {
    public_id: String,
    url: String,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Product = mongoose.model("Product", productSchema);

// Post Schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  author: { type: String, default: "Admin" },
});
const Post = mongoose.model("Post", postSchema);

// admin page for security
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = {
  Comment,
  Workout,
  News,
  Traffic,
  Member,
  Product,
  Post,
  Admin,
};