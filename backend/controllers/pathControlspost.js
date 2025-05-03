const path = require("path");
const {
  Workout,
  Comment,
  News,
  Member,
} = require("../config/ShematableWork.js");
// POST methods WEBSITE
// post controller Table
exports.postUsersDaTabel = async (req, res) => {
  try {
    const workout = new Workout(req.body);
    await workout.save();
    res.status(201).json(workout);
  } catch (err) {
    res.status(500).json({ error: "Failed to save workout" });
  }
};
// ost controller for comments and dashboard
exports.postUsersComments = async (req, res) => {
  try {
    const { username, gender, text, workoutType } = req.body;
    const newComment = new Comment({ username, gender, text, workoutType });
    await newComment.save();
    res.redirect("/Comments");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
// POST methods for Dashboard
exports.postUsersCommentsDash = async (req, res) => {
  try {
    const { commentId } = req.body;
    await Comment.findByIdAndDelete(commentId);
    res.redirect("/admin-user-comments-71"); // redirect back to the dashboard after deletion
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to delete comment");
  }
};

// Update banner (PUT) for News
exports.postUsersNewsDash = async (req, res) => {
  try {
    const { title, description, link, buttonText } = req.body;

    // Check if banner exists
    let banner = await News.findOne();

    if (banner) {
      // Update existing banner
      banner.title = title;
      banner.description = description;
      banner.link = link;
      banner.buttonText = buttonText;
      await banner.save();
    } else {
      // Create new banner
      banner = new News({ title, description, link, buttonText });
      await banner.save();
    }
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
// postUsersVisitorsDash
exports.postUsersVisitorsDash = async (req, res) => {
  try {
    const { name, totalPrice, coachPrice } = req.body;
    const earnings = totalPrice - coachPrice;

    const newMember = new Member({
      name,
      totalPrice,
      coachPrice,
      earnings,
    });

    await newMember.save();
    res.redirect("/admin-access-panel-03");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
exports.postUsersCommentsDashdelete = async (req, res) => {
  try {
    const MemberId = req.params.id;
    await Member.findByIdAndDelete(MemberId); // Delete the visitor by ID
    res.redirect("/admin-access-panel-03"); // Redirect to the home page after removal
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
// Transpor
// post thanks page
const {
  transporterBuy,
  ThanksPage,
} = require("../transporter/transporter-buyPage.js");
const THANKS_PAGE = path.join(__dirname, "../../frontend/views/thanks.ejs");
exports.postUsersThanksPage = async (req, res) => {
  try {
    await ThanksPage(req, res); // Pass req and res to the function
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error for transporterBuy");
  }
};
// nodemailer function  transporterBuy for buy page
exports.postUsersTransporterBuy = async (req, res) => {
  try {
    await transporterBuy(req, res); // Pass req and res to the function
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error for transporterBuy");
  }
};
