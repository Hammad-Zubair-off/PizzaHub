const express=require('express')
const app=express();

const mongoose=require('mongoose')

const Pizza=require('./models/pizzaModel')
const path = require("path");
app.use(express.json());
mongoose.set('strictQuery', true);
require('./db')

const pizzasRoute=require('./routes/pizzasRoute');



app.use("/api/pizzas/",pizzasRoute);



    app.get("/", (req, res) => {
        app.use(express.static(path.resolve(__dirname, "client", "build")));
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
        });

app.listen(5000,console.log("Server Running"))