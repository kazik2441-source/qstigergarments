import mongoose from "mongoose";
import * as dotenv from 'dotenv';
dotenv.config();

async function run() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      const adminDb = mongoose.connection.db?.admin();
      const listDatabases = await adminDb?.listDatabases();
      
      const client = mongoose.connection.getClient();
      
      if (listDatabases) {
        for (const dbInfo of listDatabases.databases) {
            const dbName = dbInfo.name;
            const db = client.db(dbName);
            const collections = await db.listCollections().toArray();
            console.log(`\nDB: ${dbName}`);
            for (const col of collections) {
                const count = await db.collection(col.name).countDocuments();
                console.log(` - ${col.name} (${count} docs)`);
            }
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
