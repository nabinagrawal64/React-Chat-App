//connecting the server using mongoose
const mongoose = require('mongoose');

require("dotenv").config();
//ab process object ke ander sara ka sara data present hai

function dbConnect () {
    mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("Connection Sucessful") ) 
    .catch((error) => {
        console.log("Recieved an Error");
        console.error(error.message);
        process.exit(1);
    } ) 
}

module.exports = dbConnect;