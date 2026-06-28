import mongoose from "mongoose";
import * as dotenv from 'dotenv';
import { PRODUCTS } from './src/data.js';

dotenv.config();

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String },
  description: { type: String },
  price: { type: String, required: true },
  image: { type: String },
  features: [String],
  discount: { type: String },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

async function run() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      const count = await Product.countDocuments();
      if (count === 0) {
        console.log("Seeding products from data.ts...");
        // remove 'id' from each product and insert
        const toInsert = PRODUCTS.map(({ id, ...rest }) => ({ ...rest, price: rest.price || "0" }));
        // @ts-ignore
        await Product.insertMany(toInsert);
        console.log(`Seeded ${toInsert.length} products.`);
      } else {
        console.log(`Database already has ${count} products.`);
      }
    } catch (e) {
      console.error(e);
    }
    process.exit(0);
  } else {
    console.log("No MONGODB_URI");
    process.exit(1);
  }
}
run();
