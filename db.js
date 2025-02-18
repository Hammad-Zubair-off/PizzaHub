const mongoose=require('mongoose')


const uri = 'mongodb+srv://hammad123:hammad123@portfolio.yy8pt1e.mongodb.net/';

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
    family: 4 // Use IPv4, skip trying IPv6
}

const connectWithDB = () => {
    mongoose.connect(uri, options, (err, db) => {
      if (err) console.error(err);
      else console.log("database connection succedded");
    })
}

connectWithDB()