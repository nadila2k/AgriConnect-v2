const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

const app = express();

// Security Middlewares
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use("/api", limiter);

// Regular Middlewares
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); 
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Routes
app.use("/api/v1", require("./routers"));

// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
