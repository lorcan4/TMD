const { Traffic } = require("../config/ShematableWork");
const crypto = require("crypto");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path")
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, "../.env1") }); 
async function middlewareVisitor(req, res, next) {
  try {
    // استثناء بعض المسارات من التتبع
    const excludedPaths = [
      "/admin-access-panel-03",
      "/admin-update-banner-87",
      "/admin-user-comments-71",
      "/admin-workout-schedule-92",
      "/store/store-admin-dashboard-51",
      "/blog-manager-portal-57",
      "/admin-settings-page-64",
      "/admin-login-entry-99",
      "/css",
      "/js",
      "/img",
      "/favicon.ico",
    ];
    if (excludedPaths.some((path) => req.path.startsWith(path))) {
      return next();
    }
    const now = new Date();
    const monthKey = `${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${now.getFullYear()}`;
    let traffic = await Traffic.findOne();
    if (!traffic) {
      traffic = await Traffic.create({
        monthlyVisitors: [],
      });
    }
    // زيادة عدد مشاهدات الصفحة
    traffic.pageViews++;
    traffic.lastUpdated = now;
    // عد الزوار الفريدين (مرة واحدة يومياً باستخدام الكوكي visited)
    if (!req.cookies.visited) {
      res.cookie("visited", true, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      traffic.totalVisitors++;
      const monthEntry = traffic.monthlyVisitors.find(
        (m) => m.month === monthKey
      );
      if (monthEntry) {
        monthEntry.count++;
      } else {
        traffic.monthlyVisitors.push({ month: monthKey, count: 1 });
        if (traffic.monthlyVisitors.length > 12) {
          traffic.monthlyVisitors.shift();
        }
      }
    }
    // عد المستخدمين المتصلين الآن (جلسة مدتها 5 دقائق)
    if (!req.cookies.sessionId) {
      const sessionId = crypto.randomBytes(16).toString("hex");
      res.cookie("sessionId", sessionId, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
      });
      traffic.onlineUsers++;
    }
    await traffic.save();
    next();
  } catch (err) {
    console.error("Tracking middleware error:", err);
    next();
  }
}
// middlewaresetInterval
async function middlewareSetInterval(req, res, next) {
  setInterval(async () => {
    try {
      const traffic = await Traffic.findOne();
      if (!traffic) return;

      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      if (traffic.lastUpdated < fiveMinutesAgo && traffic.onlineUsers > 0) {
        traffic.onlineUsers = 0;
        await traffic.save();
      }
    } catch (err) {
      console.error("Session cleanup error:", err);
    }
  }, 60 * 1000);
}
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const url = `mongodb+srv://${dbUsername}:${dbPassword}@cluster0.j34l9od.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

// Session configuration  store
// ✅ الصحيح: إرجاع session middleware الجاهز
function SessionConfiguration() {
  return session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: url }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  });
}
// Custom middleware to pass flash messages to views
// Initialize cart in session if it doesn't exist
async function SessionCard(req, res, next) {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  res.locals.messages = req.flash();
  res.locals.cartCount = req.session.cart.reduce(
    (total, item) => total + item.quantity,
    0
  );
  next();
} 


module.exports = {
  middlewareVisitor,
  middlewareSetInterval,
  SessionConfiguration,
  SessionCard,
};







