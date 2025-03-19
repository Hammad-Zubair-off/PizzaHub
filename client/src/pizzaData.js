// src/data/pizzaData.js

const pizzaData = [
  {
    _id: "p1",
    name: "Margherita",
    varients: ["small", "medium", "large"],
    prices: [
      { varient: "small", price: 99 },
      { varient: "medium", price: 199 },
      { varient: "large", price: 399 }
    ],
    category: "veg",
    image: "https://www.dominos.co.in/files/items/Margherit.jpg",
    description: "Classic pizza with cheese and fresh basil"
  },
  {
    _id: "p2",
    name: "Farmhouse",
    varients: ["small", "medium", "large"],
    prices: [
      { varient: "small", price: 229 },
      { varient: "medium", price: 399 },
      { varient: "large", price: 599 }
    ],
    category: "veg",
    image: "https://www.dominos.co.in/files/items/Farmhouse.jpg",
    description: "Loaded with fresh vegetables and cheese"
  },
  {
    _id: "p3",
    name: "Pepperoni",
    varients: ["small", "medium", "large"],
    prices: [
      { varient: "small", price: 249 },
      { varient: "medium", price: 349 },
      { varient: "large", price: 599 }
    ],
    category: "non-veg",
    image: "https://www.dominos.co.in/files/items/Pepperoni.jpg",
    description: "Pepperoni with extra cheese"
  },
  {
    _id: "p4",
    name: "Mexican Green Wave",
    varients: ["small", "medium", "large"],
    prices: [
      { varient: "small", price: 199 },
      { varient: "medium", price: 299 },
      { varient: "large", price: 499 }
    ],
    category: "veg",
    image: "https://www.dominos.co.in/files/items/Mexican_Green_Wave.jpg",
    description: "Spicy Mexican pizza with jalapeños and peppers"
  },
  {
    _id: "p5",
    name: "Chicken Supreme",
    varients: ["small", "medium", "large"],
    prices: [
      { varient: "small", price: 249 },
      { varient: "medium", price: 349 },
      { varient: "large", price: 599 }
    ],
    category: "non-veg",
    image: "https://www.dominos.co.in/files/items/Chicken_Golden_Delight.jpg",
    description: "Loaded with grilled chicken and veggies"
  },
  {
    _id: "p6",
    name: "Veggie Paradise",
    varients: ["small", "medium", "large"],
    prices: [
      { varient: "small", price: 199 },
      { varient: "medium", price: 299 },
      { varient: "large", price: 499 }
    ],
    category: "veg",
    image: "https://www.dominos.co.in/files/items/Digital_Veggie_Paradise_olo_266x265.jpg",
    description: "Fresh vegetables with extra cheese"
  },
  {
    _id: "p7",
    name: "BBQ Chicken",
    varients: ["small", "medium", "large"],
    prices: [
      { varient: "small", price: 249 },
      { varient: "medium", price: 399 },
      { varient: "large", price: 599 }
    ],
    category: "non-veg",
    image: "https://www.dominos.co.in/files/items/BBQ_Chicken.jpg",
    description: "BBQ sauce with grilled chicken"
  },
  {
    _id: "p8",
    name: "Cheese Burst",
    varients: ["small", "medium", "large"],
    prices: [
      { varient: "small", price: 199 },
      { varient: "medium", price: 299 },
      { varient: "large", price: 499 }
    ],
    category: "veg",
    image: "https://www.dominos.co.in/files/items/CheeseBurst.jpg",
    description: "Loaded with extra cheese"
  },
  {
    _id: "p9",
    name: "Paneer Special",
    varients: ["small", "medium", "large"],
    prices: [
      { varient: "small", price: 229 },
      { varient: "medium", price: 399 },
      { varient: "large", price: 599 }
    ],
    category: "veg",
    image: "https://www.dominos.co.in/files/items/Paneer_Special.jpg",
    description: "Paneer with capsicum and onions"
  },
  {
    _id: "p10",
    name: "Spicy Chicken",
    varients: ["small", "medium", "large"],
    prices: [
      { varient: "small", price: 299 },
      { varient: "medium", price: 499 },
      { varient: "large", price: 699 }
    ],
    category: "non-veg",
    image: "https://www.dominos.co.in/files/items/Pepper_Barbecue_&_Onion.jpg",
    description: "Spicy chicken with jalapeños"
  }
];

export default pizzaData;