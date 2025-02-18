const express=require('express');
const router=express.Router();

const Pizza=require('../models/pizzaModel')
router.get("/getallpizzas", async(req,res)=>{

    try{
    const pizzas=await Pizza.find({})
    res.send(pizzas)
    console.log("data request")
  //  console.log(pizzas)
    }
    catch(err){
        return res.status(400).json({message:err})
    }
});

router.put('/editpizza/:id', async (req, res) => {
    console.log("heelo")
    try {
      const pizza = await Pizza.findById(req.params.id);
      console.log(req.params.id)
      console.log(req.body.variants)
      console.log(req.body)
      if (!pizza) {
        return res.status(404).json({ message: 'Pizza not found' });
      }
  
      // Update pizza properties based on request body
      pizza.name = req.body.name || pizza.name;
      pizza.varients = req.body.variants || pizza.variants;
      pizza.prices = req.body.prices || pizza.prices;
      pizza.category = req.body.category || pizza.category;
      pizza.image = req.body.image || pizza.image;
      pizza.description = req.body.description || pizza.description;
      
      const updatedPizza = await pizza.save();
      res.json(updatedPizza);
    } catch (err) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  router.post('/addpizza', async (req, res) => {
    console.log(req.body.variants[1])
    try {
     
    const pizza= new Pizza()
  
      // Update pizza properties based on request body
      pizza.name = req.body.name || pizza.name;
      pizza.varients = req.body.variants || pizza.variants;
      pizza.prices = req.body.prices || pizza.prices;
      pizza.category = req.body.category || pizza.category;
      pizza.image = req.body.image || pizza.image;
      pizza.description = req.body.description || pizza.description;
      
      const updatedPizza = await pizza.save();
      res.json(updatedPizza);
    } catch (err) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  router.delete('/deletepizza/:id', async (req, res) => {
    try {
      const pizza = await Pizza.findById(req.params.id);
      if (!pizza) {
        return res.status(404).json({ message: 'Pizza not found' });
      }
  
      // Delete the pizza
      await pizza.remove();
  
      res.json({ message: 'Pizza deleted successfully' });
    } catch (err) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  
module.exports=router