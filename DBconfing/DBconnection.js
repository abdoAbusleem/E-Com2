const mongoose = require('mongoose');   

require("dotenv").config();


const Mongoose = mongoose.connect(process.env.url, {ignoreUndefined: true });





module.exports = Mongoose;