import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// MongoDB Models
const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  discount: String,
  description: String,
  image: String,
  category: String,
  subcategory: String,
  features: [String],
  images: [String]
});
const Product = mongoose.model("Product", productSchema);

const storeSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: mongoose.Schema.Types.Mixed
});
const Store = mongoose.model("Store", storeSchema);

const siteSettingsSchema = new mongoose.Schema({
  logoUrl: String,
  ceoImageUrl: String,
});
const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middlewares
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));

  // Connect to MongoDB (non-blocking)
  if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
      .then(() => console.log("Connected to MongoDB Atlas"))
      .catch((err) => {
        console.log("⚠️ MongoDB connection failed. Using in-memory fallback. Please whitelist IP '0.0.0.0/0' in your MongoDB Atlas Network Access settings.");
      });
  } else {
    console.warn("MONGODB_URI is not set in environment variables");
  }

  // --- API ROUTES ---

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Site Settings Endpoints
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await SiteSettings.findOne();
      res.json(settings || {});
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", async (req, res) => {
    try {
      const updates = req.body;
      const settings = await SiteSettings.findOneAndUpdate(
        {},
        { $set: updates },
        { upsert: true, new: true }
      );
      res.json({ success: true, settings });
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Key-Value Store Endpoints
  app.get("/api/store/:key", async (req, res) => {
    try {
      const item = await Store.findOne({ key: req.params.key });
      if (item) {
        res.json({ value: item.value });
      } else {
        res.status(404).json({ error: "Key not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch from store" });
    }
  });

  app.post("/api/store/:key", async (req, res) => {
    try {
      const { value } = req.body;

      await Store.findOneAndUpdate(
        { key: req.params.key },
        { value },
        { upsert: true, new: true }
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save to store" });
    }
  });

  // Upload image to Cloudinary
  app.post("/api/upload", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      // Convert buffer to base64 string
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      
      const result = await cloudinary.uploader.upload(dataURI, {
        resource_type: "auto",
        folder: "garments_app",
        type: "upload",
        access_mode: "public"
      });

      res.json({ url: result.secure_url });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Image upload failed" });
    }
  });

  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products.map(p => ({
        id: p._id.toString(),
        name: p.name,
        price: p.price,
        category: p.category,
        subcategory: p.subcategory,
        features: p.features,
        discount: p.discount,
        description: p.description,
        image: p.image
      })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Add a product
  app.post("/api/products", async (req, res) => {
    try {
      const newProduct = new Product(req.body);
      await newProduct.save();
      res.json({ id: newProduct._id.toString(), ...req.body });
    } catch (error) {
      res.status(500).json({ error: "Failed to save product" });
    }
  });

  // Update a product
  app.put("/api/products/:id", async (req, res) => {
    try {
      await Product.findByIdAndUpdate(req.params.id, req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  // Delete a product
  app.delete("/api/products/:id", async (req, res) => {
    try {
      console.log(`Attempting to delete product with ID: ${req.params.id}`);
      const result = await Product.findByIdAndDelete(req.params.id);
      if (result) {
         console.log(`Successfully deleted product: ${result.name}`);
      } else {
         console.log(`Product with ID ${req.params.id} not found.`);
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });


  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
