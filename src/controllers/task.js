const Task = require('../models/task'); 

// 1. Devuelve las tareas de la base de datos (GET /tasks)
const getTasks = async (req, res) => {
    try {
        // Busca todas las tareas en la base de datos
        const tasks = await Task.find();
        
        // 💡 CLAVE: Responde con un objeto que contiene una propiedad 'tasks',
        // tal como espera tu componente App.js (setTasks(res.tasks)).
        res.status(200).json({ 
            tasks: tasks 
        });

    } catch (error) {
        console.error("Error al obtener las tareas:", error);
        res.status(500).json({ 
            message: 'Error interno del servidor al obtener las tareas.' 
        });
    }
};

// 2. Crea una nueva tarea (POST /tasks)
const postTask = async (req, res) => {
    try {
        // La validación del schema (name, text, status) se maneja automáticamente por Mongoose.
        const newTask = await Task.create(req.body);
        
        // 💡 CLAVE: Responde con un objeto que contiene la tarea creada (incluyendo su _id),
        // tal como espera tu componente TaskForm (onTaskCreated(createdTask.task)).
        res.status(201).json({ 
            message: 'Tarea creada exitosamente.',
            task: newTask 
        });

    } catch (error) {
        console.error("Error al crear la tarea:", error);
        // Si hay un error de validación de Mongoose, responde con 400
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ 
            message: 'Error interno del servidor al crear la tarea.' 
        });
    }
};

// 3. Modifica una tarea (PUT /tasks/:id) - *Aunque React no lo usa aún, es buena práctica incluirlo*
const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        
        // Busca y actualiza la tarea, devolviendo la versión actualizada ({ new: true })
        const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, { 
            new: true, // Devuelve el documento modificado
            runValidators: true // Ejecuta las validaciones del schema (como 'enum')
        });

        if (!updatedTask) {
            return res.status(404).json({ message: 'Tarea no encontrada.' });
        }

        res.status(200).json({ 
            message: 'Tarea actualizada exitosamente.',
            task: updatedTask 
        });

    } catch (error) {
        console.error("Error al actualizar la tarea:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ 
            message: 'Error interno del servidor al actualizar la tarea.' 
        });
    }
};

// 4. Elimina una tarea (DELETE /tasks/:id)
const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;

        // Busca la tarea por ID y la elimina
        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            // Si Mongoose no encuentra la tarea, responde con 404
            return res.status(404).json({ message: 'Tarea no encontrada.' });
        }

        // 💡 CLAVE: Responde con 200 (OK) o 204 (No Content) si lo prefieres,
        // sin enviar un cuerpo de respuesta, ya que React solo necesita saber que fue exitoso.
        res.status(200).json({ 
            message: 'Tarea eliminada exitosamente.' 
        });

    } catch (error) {
        console.error("Error al eliminar la tarea:", error);
        res.status(500).json({ 
            message: 'Error interno del servidor al eliminar la tarea.' 
        });
    }
};

module.exports = { getTasks, postTask, updateTask, deleteTask };