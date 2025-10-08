const mongoose = require('mongoose'); 

async function connectDB(){ 
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Database connected 👍'); 
    } catch (error) {
        console.log('Error connecting Database', error) 
    }
}

module.exports = connectDB; 