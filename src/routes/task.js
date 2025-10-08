const { getTasks, postTask, putTask, deleteTask } = require('../controllers/task'); 
const taskRouter = require('express').Router(); 

taskRouter.get('/', getTasks); // GET para leer todas las tareas
taskRouter.post('/', postTask); // POST para crear una tarea
taskRouter.put('/:id', putTask); // PUT para modificar una tarea, pasando el ID 
taskRouter.delete('/:id', deleteTask); // DELETE para eliminar una tarea, pasando el ID 

module.exports = taskRouter 