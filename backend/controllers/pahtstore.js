const path = require("path");
const { Product } = require("../config/ShematableWork.js");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../.env") });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// All Store GET
//  StoreCard get
const StoreCard = path.join(__dirname, "../../frontend/views/Store-card.ejs");
exports.getStoreCard = async (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render(StoreCard, { cart, total });
};
// StoreDash
const StoreDash = path.join(
  __dirname,
  "../../frontend/Dashboard/StoreDash.ejs"
);
exports.getStoreDash = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    const cart = req.session.cart || [];
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    res.render(StoreDash, { products, cart, total });
  } catch (err) {
    req.flash("error", "Error fetching products");
  }
};
// Store get
const Store = path.join(__dirname, "../../frontend/views/Store.ejs");
exports.getStore = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.render(Store, { products, cart: req.session.cart });
  } catch (err) {
    res.status(500).render("error", { message: "Error loading products" });
  }
};
// checkout get
const checkout = path.join(__dirname, "../../frontend/views/Store-order.ejs");
exports.getCheckout = async (req, res) => {
  if (!req.session.cart || req.session.cart.length === 0) {
    req.flash("error", "Your cart is empty");
  }
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render(checkout, { cart, total });
};
// All Store POST
// Add Product POST
exports.getAddProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const result = await cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto",
          folder: "gym-store",
        },
        async (error, result) => {
          if (error) {
            req.flash("error", "Error uploading image");
            return res.redirect("/store-admin-dashboard-51");
          }
          const newProduct = new Product({
            name,
            description,
            price,
            category,
            stock,
            image: {
              public_id: result.public_id,
              url: result.secure_url,
            },
          });
          await newProduct.save();
          req.flash("success", "Product added successfully");
          res.redirect("/store/store-admin-dashboard-51");
        }
      )
      .end(req.file.buffer);
  } catch (err) {
    req.flash("error", "Error adding product");
    // res.redirect("/dashboard");
  }
};
//  delete-product POST
exports.getDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    await cloudinary.uploader.destroy(product.image.public_id);
    await Product.findByIdAndDelete(req.params.id);
    req.flash("success", "Product deleted successfully");
    res.redirect("/store/store-admin-dashboard-51");
  } catch (err) {
    req.flash("error", "Error deleting product");
  }
};
// add-to-cart POST
exports.getadd_to_cart = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      req.flash("error", "Product not found");
      return res.redirect("/store");
    }
    const cartItem = req.session.cart.find(
      (item) => item.productId.toString() === req.params.id
    );
    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      req.session.cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image.url,
        quantity: 1,
      });
    }
    req.flash("success", "Product added to cart");
    res.redirect("back");
  } catch (err) {
    req.flash("error", "Error adding to cart");
    res.redirect("/");
  }
};
// remove-from-cart POST
exports.getDeleteremove_from_cartProduct = async (req, res) => {
  req.session.cart = req.session.cart.filter(
    (item) => item.productId.toString() !== req.params.id
  );
  req.flash("success", "Product removed from cart");
  res.redirect("back");
};
const { placeOrderMailer } = require("../transporter/transporter-buyPage.js");
exports.placeOrder = async (req, res) => {
  try {
    await placeOrderMailer(req, res); // Pass req and res to the function
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error for transporterBuy");
  }
};
