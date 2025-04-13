const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const uri = `${process.env.MONGO_URI}PizzaHub`;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4 // Use IPv4, skip trying IPv6
};

// Export the function using module.exports
const connectWithDB = () => {
    mongoose.connect(uri, options)
        .then(() => console.log("✅ Database connection successful"))
        .catch(err => console.error("❌ Database connection error:", err));
};

module.exports = connectWithDB;
