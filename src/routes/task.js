const { getTasks, postTask, updateTask, deleteTask } = require('../controllers/task'); // 💡 Corregido a 'updateTask'
const taskRouter = require('express').Router(); 

taskRouter.get('/', getTasks); // GET para leer todas las tareas
taskRouter.post('/', postTask); // POST para crear una tarea
taskRouter.put('/:id', updateTask); // PUT para modificar una tarea, usando la función 'updateTask'
taskRouter.delete('/:id', deleteTask); // DELETE para eliminar una tarea, pasando el ID

module.exports = taskRouter;