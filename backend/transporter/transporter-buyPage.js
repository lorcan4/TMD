const nodemailer = require("nodemailer");
const path = require("path");
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, "../.env") }); // Changed from .env1 to .env

// Common transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// send for home
const THANKS_PAGE = path.join(__dirname, "../../frontend/views/thanks.ejs");

async function ThanksPage(req, res) {
  const { name, email, phone, service, message } = req.body;
  
  const mailOptions = {
    from: process.env.EMAIL_USER, // Changed from email to use the authenticated email
    to: process.env.EMAIL_USER,
    subject: `New Service Inquiry - ${service}`,
    html: `
    <div style="max-width: 600px; margin: auto; padding: 20px; font-family: 'Arial', sans-serif; background-color: #f8f9fa; border-radius: 10px; border: 1px solid #ddd;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://i.ibb.co/8LhcSdNc/Black-White-Minimalist-Professional-Initial-Logo-2-removebg-preview.png" alt="Gym Logo" style="max-width: 150px;">
      </div>
      <h2 style="color: #1a73e8; border-bottom: 1px solid #ccc; padding-bottom: 10px;">New Contact Request TMD WebSite</h2>
      <p><strong style="color: #555;">Name:</strong> ${name}</p>
      <p><strong style="color: #555;">Email:</strong> ${email}</p>
      <p><strong style="color: #555;">Phone:</strong> ${phone}</p>
      <p><strong style="color: #555;">Service:</strong> ${service}</p>
      <p><strong style="color: #555;">Message:</strong><br>${message || "No message provided"}</p>
      <hr style="margin-top: 30px;"/>
      <p style="font-size: 12px; color: #999; text-align: center;">This message was sent from your gym's website form TMD.</p>
    </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.render(THANKS_PAGE);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Something went wrong.");
  }
}

// transporterBuy for buy page
async function transporterBuy(req, res) {
  try {
    const { name, email, phone, membership, Address, City } = req.body;
    
    // Validate input
    if (!name || !email || !phone || !membership || !Address || !City) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // Determine membership details
    let membershipDetails, price;
    switch (membership) {
      case "basic":
        membershipDetails = "Basic Membership (Access to gym facilities during standard hours)";
        price = 29.99;
        break;
      case "premium":
        membershipDetails = "Premium Membership (24/7 access + 2 personal training sessions/month)";
        price = 59.99;
        break;
      case "family":
        membershipDetails = "Family Membership (Access for 2 adults and 2 children)";
        price = 89.99;
        break;
      default:
        return res.status(400).json({ message: "Invalid membership type" });
    }
    
    // Create email content
    const mailOptions = {
      from: `"TMD Gym" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Gym Plan Purchase From TMD Gym Buy Page",
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://i.ibb.co/8LhcSdNc/Black-White-Minimalist-Professional-Initial-Logo-2-removebg-preview.png" alt="Gym Logo" style="height: 60px;">
          </div>
          <h2 style="color: #e74c3c; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Membership Purchase</h2>
          <ul style="list-style: none; padding: 0; margin: 20px 0;">
            <li style="margin-bottom: 10px;"><strong>Membership Type:</strong> ${membershipDetails}</li>
            <li style="margin-bottom: 10px;"><strong>Price:</strong> $${price.toFixed(2)} per month</li>
          </ul>
          <p style="margin-bottom: 10px;"><strong>Name:</strong> ${name}</p>
          <p style="margin-bottom: 10px;"><strong>Email:</strong> ${email}</p>
          <p style="margin-bottom: 10px;"><strong>Phone:</strong> ${phone}</p>
          <p style="margin-bottom: 10px;"><strong>Address:</strong> ${Address}</p>
          <p style="margin-bottom: 10px;"><strong>City:</strong> ${City}</p>
          <hr style="margin: 30px 0;">
          <p style="font-size: 0.9em; color: #888;">This message was sent from your gym membership system.</p>
        </div>
      `,
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    // Send confirmation email to customer
    await transporter.sendMail({
      from: `"TMD Purchase" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Purchase Confirmation",
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="color: #2c3e50;">Thank you for your purchase, Mr/Mrs <span style="color: #e67e22;">${name}</span>!</h2>
          <p style="font-size: 16px; color: #555;">We appreciate your trust in us. Here are your membership details:</p>
          <ul style="list-style-type: none; padding: 0; color: #333; font-size: 15px;">
            <li><strong>Membership Type:</strong> ${membershipDetails}</li>
            <li><strong>Price:</strong> $${price.toFixed(2)} per month</li>
          </ul>
          <p style="font-size: 15px; color: #555;">We will process your request and contact you shortly.</p>
          <div style="margin-top: 30px; text-align: center;">
            <img src="https://i.ibb.co/Zpd0dkZT/Black-White-Minimalist-Professional-Initial-Logo.png" alt="Black-White-Minimalist-Professional-Initial-Logo" style="width: 120px; border: 0; opacity: 0.9;" />
          </div>
        </div>
      `,
    });

    res.json({
      success: true,
      message: "A request has been sent. We will process it and contact you.",
    });
  } catch (error) {
    console.error("Purchase error:", error);
    res.status(500).json({
      success: false,
      message: "There was an error sending the request. Please try again later.",
    });
  }
}

// for store
const checkout = path.join(__dirname, "../../frontend/views/Store-order.ejs");

async function placeOrderMailer(req, res) {
  try {
    const { name, email, phone, Address, City } = req.body;
    const cart = req.session.cart || [];
    
    if (!cart.length) {
      req.flash("error", "Cart is empty.");
      return res.redirect("/cart");
    }
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const htmlContent = `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://i.ibb.co/8LhcSdNc/Black-White-Minimalist-Professional-Initial-Logo-2-removebg-preview.png" alt="Gym Logo" style="height: 60px;">
        </div>
        <h2 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">🛒 New Gym Store Order</h2>
        <p style="font-size: 16px; margin-bottom: 10px;"><strong>Name:</strong> ${name}</p>
        <p style="font-size: 16px; margin-bottom: 10px;"><strong>Email:</strong> ${email}</p>
        <p style="font-size: 16px; margin-bottom: 20px;"><strong>Phone:</strong> ${phone}</p>
        <p style="font-size: 16px; margin-bottom: 20px;"><strong>Address:</strong> ${Address}</p>
        <p style="font-size: 16px; margin-bottom: 20px;"><strong>City:</strong> ${City}</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <h3 style="color: #27ae60; margin-bottom: 15px;">🛍️ Order Details</h3>
        <ul style="padding-left: 20px; margin-bottom: 20px; font-size: 15px; color: #333;">
          ${cart.map(item => `
            <li style="margin-bottom: 8px;">
              <strong>${item.name}</strong> - $${item.price.toFixed(2)} x ${item.quantity}
            </li>
          `).join("")}
        </ul>
        <p style="font-size: 16px; font-weight: bold; color: #e67e22; margin-bottom: 30px;">
          Total: $${total.toFixed(2)}
        </p>
        <p style="font-size: 13px; color: #aaa; text-align: center;">
          This is an automated notification from TMD Gym Store.
        </p>
      </div>
    `;

    // Send order notification
    await transporter.sendMail({
      from: `"Gym Store TMD" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Order from Gym Store",
      html: htmlContent,
    });
    
    // Send confirmation to customer
    await transporter.sendMail({
      from: `"TMD Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Purchase Confirmation",
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="color: #2c3e50;">Thank you for your purchase, Mr/Mrs <span style="color: #e67e22;">${name}</span>!</h2>
          <p style="font-size: 16px; color: #555;">We appreciate your trust in us.</p>
          <p style="font-size: 15px; color: #555;">We will process your request and contact you shortly.</p>
          <div style="margin-top: 30px; text-align: center;">
            <img src="https://i.ibb.co/Zpd0dkZT/Black-White-Minimalist-Professional-Initial-Logo.png" alt="Black-White-Minimalist-Professional-Initial-Logo" style="width: 120px; border: 0; opacity: 0.9;" />
          </div>
        </div>
      `,
    });

    req.session.cart = []; // Clear cart after order
    req.flash("success", "Order placed successfully!");
    res.render(checkout, {
      cart: [],
      cartCount: 0,
      messages: req.flash(),
    });
  } catch (err) {
    console.error("Email sending failed:", err);
    req.flash("error", "There was an error placing your order.");
    res.redirect("/cart");
  }
}

module.exports = { transporterBuy, placeOrderMailer, ThanksPage };