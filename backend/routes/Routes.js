// Routes File main
const express = require("express");
const router = express.Router();
const routerStore = express.Router();
// Configure multer for memory storage
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
// get controller main website TMD
// security midleware 
const protect = require("../midleware/security")
// Path Controls
const {
  getUsersHome,
  getUsersAbout,
  getUsersTeam,
  getUsersService,
  getUsersContact,
  getUsersBlog,
  getUsersBlogR,
  getUsersBlogD,
  getUsersShemaTabel,
  getUsersDaTabel,
  getDevloper,
  getAdmin,
  getUsersComments,
  getUsersCommentsDash,
  getUsersNewsDash,
  getUsersPrintUrName,
  getUsersjoin,
  getUsersAdvancedBMI,
  getUsersThanksPage,
  getUsersTransporterBuy,
  getUsersBlogPost,
  getUsersBlogPut,
  getUsersBlogDelete,
  getUsersBlogadmin,
  getAdminlogin,
  getAdminloginPost,
  getAdminloginSettings,
  getAdminloginSettingsPost,
  getAdminloginLogout,
} = require("../controllers/pathControls");
// post controller main website TMD
const {
  postUsersDaTabel,
  postUsersComments,
  postUsersCommentsDash,
  postUsersNewsDash,
  postUsersCommentsDashdelete,
  postUsersVisitorsDash,
  postUsersThanksPage,
  postUsersTransporterBuy,
} = require("../controllers/pathControlspost");
// delete controller main website TMD
const { deleteUsersDaTabel } = require("../controllers/pathControls.delete");
// pathStoreAll TMD Store
const {
  getStoreCard,
  getStoreDash,
  getStore,
  getCheckout,
  getAddProduct,
  getDeleteProduct,
  getadd_to_cart,
  getDeleteremove_from_cartProduct,
  placeOrder,
} = require("../controllers/pahtstore");
// All Routes GET HOME 
router.route("/").get(getUsersHome);
router.route("/About").get(getUsersAbout);
router.route("/Team").get(getUsersTeam);
router.route("/Service").get(getUsersService);
router.route("/Contact").get(getUsersContact);
router.route("/Blog").get(getUsersBlog);
router.route("/BlogR").get(getUsersBlogR);
router.route("/BlogD").get(getUsersBlogD);
router.route("/Print-UR-Name").get(getUsersPrintUrName);
router.route("/JOIN").get(getUsersjoin);
router.route("/BMI").get(getUsersAdvancedBMI);
router.route("/thanks").get(getUsersThanksPage);
//  Get Comments page and Dash Comments
router.route("/Comments").get(getUsersComments);
router.route("/admin-user-comments-71").get(protect,getUsersCommentsDash);
// buy page
router.route("/buy-service").get(getUsersTransporterBuy);
// WorkoutSchedule GET and POST DELETE / Page Admin GET and POST
router.route("/admin-access-panel-03").get(protect,getAdmin);
router.route("/workSchedule").get(getUsersShemaTabel);
router.route("/admin-workout-schedule-92").get(protect,getUsersDaTabel);
router.route("/api/workouts").get(protect,getDevloper);
router.route("/api/workouts").delete(protect,deleteUsersDaTabel);
// NEWS GET && POST
router.route("/admin-update-banner-87").get(protect,getUsersNewsDash);
router.route("/banner").put(protect,postUsersNewsDash);
// Comments POST && DELETE
router.route("/comment").post(postUsersComments);
router.route("/api/workouts").post(postUsersDaTabel);
router.route("/admin/delete-comment").post(postUsersCommentsDash);
// Visitors POST
router.route("/visitors").post(postUsersVisitorsDash);
router.route("/remove-visitor/:id").post(postUsersCommentsDashdelete);
// Transporter POST
router.route("/purchase").post(postUsersTransporterBuy);
// Thanks page GET
router.route("/send-email-home").post(postUsersThanksPage);
// BLOG 
router.route("/blog-manager-portal-57").get(protect,getUsersBlogadmin);
router.route("/posts").post(protect,upload.single("image"),getUsersBlogPost);
router.route("/posts/:id").put(protect,upload.single("image"),getUsersBlogPut);
router.route("/posts/:id").delete(protect,getUsersBlogDelete);
// Store All GET
routerStore.route("/cart").get(getStoreCard);
routerStore.route("/store-admin-dashboard-51").get(protect,getStoreDash);
routerStore.route("/").get(getStore);
routerStore.route("/Checkout").get(getCheckout);
routerStore.route("/category/:category").get(getCheckout);
// Store All POST
routerStore.route("/add-product").post(protect,upload.single("image"), getAddProduct);
routerStore.route("/delete-product/:id").post(protect,getDeleteProduct);
routerStore.route("/add-to-cart/:id").post(getadd_to_cart);
routerStore.route("/remove-from-cart/:id").post(getDeleteremove_from_cartProduct);
routerStore.route("/place-order").post(placeOrder);
// security Page login &&  
router.route("/admin-login-entry-99").get(getAdminlogin);
router.route("/login").post(getAdminloginPost);
router.route("/admin-settings-page-64").get(protect, getAdminloginSettings);
router.route("/settings").post(protect, getAdminloginSettingsPost);
router.route("/logout").post(protect, getAdminloginLogout);
// All Exports router
module.exports = { router, routerStore };
 