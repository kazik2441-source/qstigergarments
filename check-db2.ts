import mongoose from "mongoose";
import * as dotenv from 'dotenv';
dotenv.config();

async function run() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      const dbName = mongoose.connection.db?.databaseName;
      console.log("Connected DB Name:", dbName);
      
      const collections = await mongoose.connection.db?.listCollections().toArray();
      console.log("Collections in this DB:", collections?.map(c => c.name));
      
      if (collections) {
        for (const col of collections) {
            const count = await mongoose.connection.db?.collection(col.name).countDocuments();
            console.log(` - ${col.name} (${count} docs)`);
        }
      }
    } catch (e) {
      console.error(e);
    }
    process.exit(0);
  } else {
    console.log("No MONGODB_URI");
  }
}
run();
