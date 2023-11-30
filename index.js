const { generateToken } = require("./src/utils/jwtUtils");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Initialize the application
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["https://exforum24.web.app", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// JWT TOKEN GENERATE AND STORE INTO COOKIE
app.post("/jwt", async (req, res) => {
  const payLoadData = req.body;
  const token = generateToken(payLoadData);
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    })
    .send({ success: true });
});

// payment intent
app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;
  const amount = parseInt(price * 100);
  console.log(amount, "amount inside the intent");

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types: ["card"],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// MongoDB Connection process.env.MONGODB_URI
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Database successfully connected!"))
  .catch((error) => console.log(error));

// Routes
const postsRouter = require("./src/routes/posts");
const commentsRouter = require("./src/routes/comments");
const reportsRouter = require("./src/routes/reports");
const usersRouter = require("./src/routes/users");
const announcementsRouter = require("./src/routes/announcements");
const tagsRouter = require("./src/routes/tags");
const { default: Stripe } = require("stripe");

// Route files as needed
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/reports", reportsRouter);
app.use("/users", usersRouter);
app.use("/announcements", announcementsRouter);
app.use("/tags", tagsRouter);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
