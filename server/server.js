const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");

const cloudinary = require('./cloudinaryConfig'); // Import Cloudinary configuration
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Create a database connection
mongoose
  .connect("mongodb+srv://aniketmorepersonal:CS3bSl2JGYSI4i29@cluster0.lxa8x.mongodb.net/")
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Configure Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products', // Specify the folder name in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif'], // Allowed file formats
  },
});

const parser = multer({ storage: storage });

// Image upload route
app.post('/api/admin/products/upload-image', parser.single('my_file'), (req, res) => {
  if (req.file) {
    return res.json({
      success: true,
      result: {
        url: req.file.path, // URL of the uploaded image
      },
    });
  } else {
    return res.status(400).json({ success: false, message: 'Image upload failed' });
  }
});

// Existing routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/common/feature", commonFeatureRouter);

// Start the server
app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
