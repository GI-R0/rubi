const mongoose = require('mongoose'); 

const taskSchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true, 
    },
    text: {
        type: String,
        required: true, 
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Done', 'Progress'] 
    }
});

const Task = mongoose.model('Task', taskSchema); 
module.exports = Task; 
