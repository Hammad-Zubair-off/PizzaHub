const mongoose = require("mongoose");
require("dotenv").config();

async function testConnection() {
  try {
    console.log("Attempting to connect to MongoDB Atlas...");
    console.log("Connection string:", process.env.MONGO_URI);

    mongoose.set("strictQuery", false);

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    console.log("✅ MongoDB Atlas connection successful!");
    console.log("Connected to database:", conn.connection.name);
    console.log("Host:", conn.connection.host);

    await mongoose.connection.close();
    console.log("Connection closed successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB Atlas:", error.message);
    console.error("Full error:", error);
  }
}

testConnection();
