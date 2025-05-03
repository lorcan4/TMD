const path = require("path");
const {
  Workout,
  Comment,
  News,
  Traffic,
  Member,
  Post,
  Admin,
} = require("../config/ShematableWork.js");
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../.env") });
// GET methods;
// Default banner data for News
const defaultBanner = {
  title: "Lorem ipsum dolor sit amet concesteur",
  description:
    "Vitae sapien pellentesque habitant morbi. Scelerisque varius morbi enim nunc faucibus a pellentesque sit amet. Risus ultricies tristique nulla aliquet enim tortor. Turpis nunc eget lorem dolor sed viverra.",
  link: "#",
  buttonText: "MORBI VARIUS",
};
// Get home page
const HOME = path.join(__dirname, "../../frontend/views/index.ejs");
exports.getUsersHome = async (req, res) => {
  try {
    const banner = (await News.findOne()) || defaultBanner;
    res.render(HOME, {
      bannerTitle: banner.title,
      bannerLink: banner.link,
      bannerButtonText: banner.buttonText,
      bannerDescription: banner.description,
      message2: null,
      isError: false,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
// Get about page
const ABOUT = path.join(__dirname, "../../frontend/views/about.ejs");
exports.getUsersAbout = async (req, res) => {
  res.render(ABOUT);
};
// Get about page
const TEAM = path.join(__dirname, "../../frontend/views/team.ejs");
exports.getUsersTeam = async (req, res) => {
  res.render(TEAM);
};
// Get Server page
const SERVICES = path.join(__dirname, "../../frontend/views/service.ejs");
exports.getUsersService = async (req, res) => {
  res.render(SERVICES);
};
// Get Contact page
const CONTACT = path.join(__dirname, "../../frontend/views/contact.ejs");
exports.getUsersContact = async (req, res) => {
  res.render(CONTACT);
};

//  cloudinary for storage
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Get blog page
const BLOG = path.join(__dirname, "../../frontend/views/blog.ejs");
exports.getUsersBlog = async (req, res) => {
  const posts = await Post.find().sort({ date: -1 });
  res.render(BLOG, { posts, title: "Latest News" });
};
// Get blog-r page
const BLOG_R = path.join(__dirname, "../../frontend/views/blog-r.ejs");
exports.getUsersBlogR = async (req, res) => {
  const posts = await Post.find().sort({ date: -1 });
  const post = req.query.edit ? await Post.findById(req.query.edit) : null;
  res.render(BLOG_R, {
    posts,
    post,
    editing: !!req.query.edit,
    title: "Admin Dashboard",
  });
  // res.render(BLOG_R);
};
// Get blog-details page
const BLOG_DETAILS = path.join(
  __dirname,
  "../../frontend/views/blog-details.ejs"
);
exports.getUsersBlogD = async (req, res) => {
  res.render(BLOG_DETAILS);
};
// Blog POST
exports.getUsersBlogPost = async (req, res) => {
  try {
    const { title, description, content, category, author } = req.body;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "media-news",
      },
      async (error, result) => {
        if (error) {
          console.error(error);
          return res.redirect("/blog-manager-portal-57");
        }

        const newPost = new Post({
          title,
          imageUrl: result.secure_url, // ← هنا الصحيح!
          description,
          content,
          category,
          author: author || "Admin",
        });

        await newPost.save();
        res.redirect("/blog-manager-portal-57");
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (err) {
    console.error(err);
    res.redirect("/blog-manager-portal-57");
  }
};

// Blog PUT (update)
exports.getUsersBlogPut = async (req, res) => {
  const { title, description, content, category, author } = req.body;
  const updateData = {
    title,
    description,
    content,
    category,
    author: author || "Admin",
  };

  if (req.file) {
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "media-news" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    updateData.imageUrl = uploadResult.secure_url;
  }

  await Post.findByIdAndUpdate(req.params.id, updateData);
  res.redirect("/blog-manager-portal-57");
};

// Blog DELETE
exports.getUsersBlogDelete = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect("/blog-manager-portal-57");
};
// admin Blog  GET
const AdminBLOG = path.join(
  __dirname,
  "../../frontend/Dashboard/adminBlog.ejs"
);

exports.getUsersBlogadmin = async (req, res) => {
  const posts = await Post.find().sort({ date: -1 });
  const post = req.query.edit ? await Post.findById(req.query.edit) : null;
  res.render(AdminBLOG, {
    posts,
    post,
    editing: !!req.query.edit,
    title: "Admin Dashboard",
  });
};

// comments page schemaand admine
const COMMENTSPASE = path.join(__dirname, "../../frontend/views/comments.ejs");
exports.getUsersComments = async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    res.render(COMMENTSPASE, { comments });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
// GEt WrkoutSchedule GET
const WORKOUT_SHEMA = path.join(
  __dirname,
  "../../frontend/views/workSchedule.ejs"
);
exports.getUsersShemaTabel = async (req, res) => {
  const workouts = await Workout.find();
  res.render(WORKOUT_SHEMA, { workouts });
};

// get getUsersPrintUrName
const Print = path.join(__dirname, "../../frontend/views/join.ejs");
exports.getUsersPrintUrName = async (req, res) => {
  res.render(Print);
};

// get getUsersjoin
const JOIN = path.join(__dirname, "../../frontend/views/buy.ejs");
exports.getUsersjoin = async (req, res) => {
  res.render(JOIN);
};

// get getUsersjoin
const BMI = path.join(__dirname, "../../frontend/views/AdvancedBMI.ejs");
exports.getUsersAdvancedBMI = async (req, res) => {
  res.render(BMI);
};

// Get DASHBOARD HOME
// count visitors and page views
const DASHBOARDHOME = path.join(
  __dirname,
  "../../frontend/Dashboard/Dashboard.ejs"
);
exports.getAdmin = async (req, res) => {
  try {
    const traffic = (await Traffic.findOne()) || (await Traffic.create({}));
    const currentMonth = `${String(new Date().getMonth() + 1).padStart(
      2,
      "0"
    )}-${new Date().getFullYear()}`;
    // visitors
    const MemberAll = await Member.find().sort({ visitTime: -1 }).limit(20);

    res.render(DASHBOARDHOME, {
      totalVisitors: traffic.totalVisitors,
      pageViews: traffic.pageViews,
      onlineNow: traffic.onlineUsers,
      thisMonthVisitors: Array.isArray(traffic.monthlyVisitors)
        ? traffic.monthlyVisitors.find((m) => m.month === currentMonth)
            ?.count || 0
        : 0,

      lastUpdated: traffic.lastUpdated,
      MemberAll,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).send("Error loading dashboard");
  }
};

// Get WorkoutSchedule table for Devloper
exports.getUsersShemaTabel = async (req, res) => {
  const workouts = await Workout.find();
  res.render(WORKOUT_SHEMA, { workouts });
};
// Get WorkoutSchedule DASHBOARD
const DASHBOARD_TABE = path.join(
  __dirname,
  "../../frontend/Dashboard/dash-table.ejs"
);
exports.getUsersDaTabel = async (req, res) => {
  res.render(DASHBOARD_TABE);
};
// show data by devloper get
exports.getDevloper = async (req, res) => {
  const workouts = await Workout.find();
  res.json(workouts);
};

// comments page schemaand admine
const DASHCOMMENTS = path.join(
  __dirname,
  "../../frontend/Dashboard/dash-comments.ejs"
);
exports.getUsersCommentsDash = async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 }); // fetch all comments, newest first
    res.render(DASHCOMMENTS, { comments });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
// Update banner (GET) for News
const NEWS = path.join(__dirname, "../../frontend/Dashboard/News.ejs");
exports.getUsersNewsDash = async (req, res) => {
  try {
    const banner = (await News.findOne()) || defaultBanner;
    res.render(NEWS, { banner });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// thanks page
const THANKS_PAGE = path.join(__dirname, "../../frontend/views/thanks.ejs");
exports.getUsersThanksPage = async (req, res) => {
  try {
    res.render(THANKS_PAGE);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const BUY_PAGE_MAILER = path.join(__dirname, "../../frontend/views/buy.ejs");
exports.getUsersTransporterBuy = async (req, res) => {
  res.render(BUY_PAGE_MAILER);
};

const login = path.join(__dirname, "../../frontend/views/login.ejs");
// Login Page
exports.getAdminlogin = async (req, res) => {
  res.render(login, { error: req.query.error });
};

exports.getAdminloginPost = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new Error("Please provide email and password");

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      throw new Error("Incorrect email or password");
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET || "your_jwt_secret",
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.redirect("/admin-access-panel-03");
  } catch (err) {
    res.redirect(
      `/admin-login-entry-99?error=${encodeURIComponent(err.message)}`
    );
  }
};

// Change Password GET
const settings = path.join(__dirname, "../../frontend/views/settings.ejs");
exports.getAdminloginSettings = async (req, res) => {
  res.render(settings, {
    success: req.query.success,
    error: req.query.error,
  });
};

// Change Password POST
exports.getAdminloginSettingsPost = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      throw new Error("Please provide both passwords");

    const admin = await Admin.findById(req.admin.id).select("+password");
    if (!(await bcrypt.compare(currentPassword, admin.password))) {
      throw new Error("Current password is incorrect");
    }

    admin.password = newPassword;
    await admin.save();
    res.redirect(
      "/admin-settings-page-64?success=Password changed successfully"
    );
  } catch (err) {
    res.redirect(
      `/admin-settings-page-64?error=${encodeURIComponent(err.message)}`
    );
  }
};
// Logout
exports.getAdminloginLogout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/admin-login-entry-99");
};


// إنشاء Admin افتراضي إذا لم يكن موجودًا
/*
(async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: 'mcdochvk1@gmail.com' });
    if (!existingAdmin) {
      const newAdmin = new Admin({
        email: 'tmdmad9@gmail.com',
        password: '1234'
      });
      await newAdmin.save();
      console.log('✅ تم إنشاء المدير الافتراضي.');
    } else {
      console.log('ℹ️ المدير موجود بالفعل.');
    }
  } catch (err) {
    console.error('❌ فشل في إنشاء المدير:', err.message);
  }
})();
*/