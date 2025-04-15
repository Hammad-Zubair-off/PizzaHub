require('dotenv').config();
const mongoose = require('mongoose');
const Pizza = require('../models/pizzaModel');
const connectWithDB = require('../db');

const pizzasData = [
    {
        name: "Cheesy Margherita",
        varients: ["small", "medium", "large"],
        prices: [
            { varient: "small", price: 750 },
            { varient: "medium", price: 1200 },
            { varient: "large", price: 1700 }
        ],
        category: "Veg",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
        description: "Classic pizza with tomato sauce, mozzarella, and fresh basil",
        isAvailable: true,
        rating: 4.5,
        popularity: 95,
        tags: ["classic", "vegetarian"],
        ingredients: ["tomato sauce", "mozzarella", "basil"],
        cookingTime: 15,
        spiceLevel: 1
    },
    {
        name: "Pepperoni Feast",
        varients: ["small", "medium", "large"],
        prices: [
            { varient: "small", price: 850 },
            { varient: "medium", price: 1400 },
            { varient: "large", price: 1900 }
        ],
        category: "Non-Veg",
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
        description: "Loaded with double pepperoni and extra cheese",
        isAvailable: true,
        rating: 4.7,
        popularity: 98,
        tags: ["meat", "popular"],
        ingredients: ["pepperoni", "mozzarella", "tomato sauce"],
        cookingTime: 18,
        spiceLevel: 2
    },
    {
        name: "Four Cheese Pizza",
        varients: ["small", "medium", "large"],
        prices: [
            { varient: "small", price: 900 },
            { varient: "medium", price: 1500 },
            { varient: "large", price: 2100 }
        ],
        category: "Veg",
        image: "https://images.unsplash.com/photo-1552539618-7eec9b4d1796",
        description: "Mozzarella, cheddar, parmesan, and feta cheese blend",
        isAvailable: true,
        rating: 4.4,
        popularity: 88,
        tags: ["cheesy", "vegetarian"],
        ingredients: ["mozzarella", "cheddar", "parmesan", "feta"],
        cookingTime: 16,
        spiceLevel: 1
    },
    {
        name: "Spicy Afghani Tikka",
        varients: ["medium", "large", "family"],
        prices: [
            { varient: "medium", price: 1600 },
            { varient: "large", price: 2200 },
            { varient: "family", price: 3000 }
        ],
        category: "Non-Veg",
        image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828",
        description: "Spicy Afghani tikka chunks with special masala",
        isAvailable: true,
        rating: 4.8,
        popularity: 97,
        tags: ["spicy", "local favorite"],
        ingredients: ["chicken tikka", "yogurt", "spices"],
        cookingTime: 22,
        spiceLevel: 4
    },
    {
        name: "Veggie Delight",
        varients: ["small", "medium", "large"],
        prices: [
            { varient: "small", price: 700 },
            { varient: "medium", price: 1200 },
            { varient: "large", price: 1700 }
        ],
        category: "Veg",
        image: "https://images.unsplash.com/photo-1565299585323-38dd93dd310b",
        description: "Loaded with fresh vegetables and herbs",
        isAvailable: true,
        rating: 4.3,
        popularity: 85,
        tags: ["vegetarian", "healthy"],
        ingredients: ["mushrooms", "olives", "onions", "capsicum"],
        cookingTime: 15,
        spiceLevel: 2
    },
    {
        name: "Chicken Fajita",
        varients: ["medium", "large", "family"],
        prices: [
            { varient: "medium", price: 1500 },
            { varient: "large", price: 2100 },
            { varient: "family", price: 2900 }
        ],
        category: "Non-Veg",
        image: "https://images.unsplash.com/photo-1542282811-943ef1a977c3",
        description: "Chicken strips with fajita seasoning, onions, and capsicum",
        isAvailable: true,
        rating: 4.6,
        popularity: 90,
        tags: ["mexican", "spicy"],
        ingredients: ["chicken", "fajita seasoning", "bell peppers"],
        cookingTime: 18,
        spiceLevel: 3
    },
    {
        name: "Supreme Meat Lovers",
        varients: ["large", "family"],
        prices: [
            { varient: "large", price: 2400 },
            { varient: "family", price: 3200 }
        ],
        category: "Non-Veg",
        image: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9",
        description: "Pepperoni, beef, chicken, and sausage on one pizza",
        isAvailable: true,
        rating: 4.7,
        popularity: 94,
        tags: ["meat", "hearty"],
        ingredients: ["pepperoni", "beef", "chicken", "sausage"],
        cookingTime: 20,
        spiceLevel: 3
    },
    {
        name: "Hawaiian Pizza",
        varients: ["small", "medium", "large"],
        prices: [
            { varient: "small", price: 800 },
            { varient: "medium", price: 1300 },
            { varient: "large", price: 1800 }
        ],
        category: "Non-Veg",
        image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b",
        description: "Ham and pineapple with mozzarella cheese",
        isAvailable: true,
        rating: 4.2,
        popularity: 82,
        tags: ["sweet", "controversial"],
        ingredients: ["ham", "pineapple", "mozzarella"],
        cookingTime: 16,
        spiceLevel: 1
    },
    {
        name: "Spicy Ranch Pizza",
        varients: ["medium", "large"],
        prices: [
            { varient: "medium", price: 1400 },
            { varient: "large", price: 2000 }
        ],
        category: "Non-Veg",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
        description: "Chicken with ranch dressing and jalapeños",
        isAvailable: true,
        rating: 4.5,
        popularity: 89,
        tags: ["spicy", "creamy"],
        ingredients: ["chicken", "ranch dressing", "jalapeños"],
        cookingTime: 18,
        spiceLevel: 4
    },
    {
        name: "Mushroom Truffle Pizza",
        varients: ["small", "medium"],
        prices: [
            { varient: "small", price: 1000 },
            { varient: "medium", price: 1700 }
        ],
        category: "Veg",
        image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e",
        description: "Gourmet pizza with wild mushrooms and truffle oil",
        isAvailable: true,
        rating: 4.6,
        popularity: 87,
        tags: ["gourmet", "vegetarian"],
        ingredients: ["wild mushrooms", "truffle oil", "parmesan"],
        cookingTime: 15,
        spiceLevel: 1
    }
];

async function seedPizzas() {
    try {
        // Connect to database
        await connectWithDB();

        // Clear existing pizzas
        await Pizza.deleteMany({});
        console.log('Cleared existing pizzas');

        // Insert new pizzas
        const insertedPizzas = await Pizza.insertMany(pizzasData);
        console.log(`Successfully seeded ${insertedPizzas.length} pizzas`);

        // Close connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding pizzas:', error);
        process.exit(1);
    }
}

// Run the seeding
seedPizzas(); 