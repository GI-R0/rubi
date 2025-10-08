require('dotenv').config(); 

const express = require('express'); 
const cors = require('cors'); 
const connectDB = require('./config/connectDb');
const taskRouter = require('./routes/task');

const app = express(); // Creamos la instancia del servidor 
const PORT = process.env.PORT || 3000 // Definimos el puerto

connectDB(); // Llamamos a la función para conectar con MongoDB

app.use(cors()); // Utilizamos el middleware cors
app.use(express.json()); // Utilizamos el middleware express.json 

app.use('/tasks', taskRouter); // Definimos la ruta de acceso a taskRouter 

// Manejo de ruta "Not Found" 
app.use('*', (req, res) => {
    res.status(404).send({
        message: "Route not found" 
    });
});

// Middleware para manejar errores 
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' }); 
});

// Iniciamos el servidor [11, 13]
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`); 
});

