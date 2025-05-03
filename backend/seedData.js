const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Pizza = require("./models/pizzaModel");

dotenv.config();

const dummyPizzas = [
  {
    name: "Margherita",
    varients: ["small", "medium", "large"],
    prices: [
      { varient: "small", price: 199 },
      { varient: "medium", price: 399 },
      { varient: "large", price: 599 },
    ],
    category: "Veg",
    image:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=2940&auto=format&fit=crop",
    description: "Classic Italian pizza with tomatoes, mozzarella, and basil",
    isAvailable: true,
    rating: 4.5,
  },
  {
    name: "Pepperoni",
    varients: ["small", "medium", "large"],
    prices: [
      { varient: "small", price: 249 },
      { varient: "medium", price: 449 },
      { varient: "large", price: 649 },
    ],
    category: "Non-Veg",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=2940&auto=format&fit=crop",
    description: "American favorite with pepperoni, cheese, and tomato sauce",
    isAvailable: true,
    rating: 4.8,
  },
  {
    name: "BBQ Chicken",
    varients: ["small", "medium", "large"],
    prices: [
      { varient: "small", price: 299 },
      { varient: "medium", price: 499 },
      { varient: "large", price: 699 },
    ],
    category: "Non-Veg",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2940&auto=format&fit=crop",
    description: "Grilled chicken with BBQ sauce, onions, and cheese",
    isAvailable: true,
    rating: 4.6,
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI.replace(
      "<db_password>",
      process.env.db_password
    );
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB Atlas");

    await Pizza.deleteMany({});
    console.log("Cleared existing pizza data");

    await Pizza.insertMany(dummyPizzas);
    console.log("Successfully added dummy pizza data");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB Atlas");
  } catch (error) {
    console.error(" Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();
