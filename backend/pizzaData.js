// src/data/pizzaData.js
const mongoose = require('mongoose');

const pizzaData = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Margherita",
    varients: ["small", "medium", "large"],
    prices: [
      { varient: "small", price: 99 },
      { varient: "medium", price: 199 },
      { varient: "large", price: 399 }
    ],
    category: "veg",
    image: "https://www.dominos.com.pk/images/b200b890-9cda-11ef-9e10-97371a1b8bae-TexMex-HandTossedTopcopy_variant_0-2024-11-07073417.jpg",
    description: "Classic pizza with cheese and fresh basil"
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Farmhouse",
    varients: ["small", "medium", "large"],
    prices: [
      { varient: "small", price: 229 },
      { varient: "medium", price: 399 },
      { varient: "large", price: 599 }
    ],
    category: "veg",
    image: "https://www.dominos.com.pk/images/ab045980-a90e-11ef-81ac-2be747338ad0-CrispyChickenCheeseBurger_variant_0-2024-11-22201633.jpg",
    description: "Loaded with fresh vegetables and cheese"
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Pepperoni",
    varients: ["small", "medium", "large"],
    prices: [
      { varient: "small", price: 249 },
      { varient: "medium", price: 349 },
      { varient: "large", price: 599 }
    ],
    category: "non-veg",
    image: "https://www.dominos.com.pk/images/d02d1960-ed5e-11ef-997c-4dd1cf872742-ChickenFajita_variant_0-2025-02-17184134.jpg",
    description: "Pepperoni with extra cheese"
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Mexican Green Wave",
    varients: ["small", "medium", "large"],
    prices: [
      { varient: "small", price: 199 },
      { varient: "medium", price: 299 },
      { varient: "large", price: 499 }
    ],
    category: "veg",
    image: "https://www.dominos.com.pk/images/475bc830-ed62-11ef-b12c-478a90458ac4-SeekhKabab-HandTossedTop2_variant_0-2025-02-17190623.jpg",
    description: "Spicy Mexican pizza with jalapeños and peppers"
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Chicken Supreme",
    varients: ["small", "medium", "large"],
    prices: [
      { varient: "small", price: 249 },
      { varient: "medium", price: 349 },
      { varient: "large", price: 599 }
    ],
    category: "non-veg",
    image: "https://www.dominos.com.pk/images/d02ccb40-ed5e-11ef-9247-47a7f36a78a1-PeriPeri-HandTossedTopcopy_variant_0-2025-02-17184134.jpg",
    description: "Loaded with grilled chicken and veggies"
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Veggie Paradise",
    varients: ["small", "medium", "large"],
    prices: [
      { varient: "small", price: 199 },
      { varient: "medium", price: 299 },
      { varient: "large", price: 499 }
    ],
    category: "veg",
    image: "https://www.dominos.com.pk/images/d02d1960-ed5e-11ef-ae6a-6bf9498f2480-CreamyTikka-HandTossedTopcopy_variant_0-2025-02-17184134.jpg",
    description: "Fresh vegetables with extra cheese"
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "BBQ Chicken",
    varients: ["small", "medium", "large"],
    prices: [
      { varient: "small", price: 249 },
      { varient: "medium", price: 399 },
      { varient: "large", price: 599 }
    ],
    category: "non-veg",
    image: "https://www.dominos.com.pk/images/d02d1960-ed5e-11ef-997c-4dd1cf872742-TexMex-HandTossedTopcopy_variant_0-2025-02-17184134.jpg",
    description: "BBQ sauce with grilled chicken"
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Cheese Burst",
    varients: ["small", "medium", "large"],
    prices: [
      { varient: "small", price: 199 },
      { varient: "medium", price: 299 },
      { varient: "large", price: 499 }
    ],
    category: "veg",
    image: "https://www.dominos.com.pk/images/b2006a70-9cda-11ef-abea-b3ae544fe64b-HalfnHalf_variant_0-2024-11-07073417.jpg",
    description: "Loaded with extra cheese"
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Paneer Special",
    varients: ["small", "medium", "large"],
    prices: [
      { varient: "small", price: 229 },
      { varient: "medium", price: 399 },
      { varient: "large", price: 599 }
    ],
    category: "veg",
    image: "https://www.dominos.com.pk/images/b2006a70-9cda-11ef-9ba0-8f6ccd20db1e-SeekhKabab-HandTossedTop2_variant_0-2024-11-07073417.jpg",
    description: "Paneer with capsicum and onions"
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Spicy Chicken",
    varients: ["small", "medium", "large"],
    prices: [
      { varient: "small", price: 299 },
      { varient: "medium", price: 499 },
      { varient: "large", price: 699 }
    ],
    category: "non-veg",
    image: "https://www.dominos.com.pk/images/b2006a70-9cda-11ef-9ba0-8f6ccd20db1e-CreamyPeriPeri_variant_0-2024-11-07073417.jpg",
    description: "Spicy chicken with jalapeños"
  }
];

module.exports = pizzaData;