import './App.css';
import { useState, useEffect } from 'react';
import Task from './components/Task/Task'; 
import TaskForm from './components/TaskForm/TaskForm'; 

function App() {
    const [tasks, setTasks] = useState([]); 
    const [loading, setLoading] = useState(false); 
    const [showForm, setShowForm] = useState(false); 

    const fetchTasks = async () => {
        try {
            setLoading(true); 
            const response = await fetch(`http://localhost:3000/tasks`); 
            
            if (!response.ok) {
                throw new Error('Error en la petición GET');
            }
            
            const res = await response.json(); 
            
            // 💡 Aseguramos que la lista se cargue correctamente
            setTasks(res.tasks || []); 
            setLoading(false); 

        } catch (error) {
            console.error('Error al obtener las tareas:', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTasks(); 
    }, []) 
    
    // FUNCIÓN: CREAR TAREA (POST)
    const addTask = async (newTaskData) => {
        try {
            // 1. Petición POST a la API
            const response = await fetch(`http://localhost:3000/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTaskData),
            });
            if (!response.ok) {
                throw new Error('Error al crear la tarea');
            }
            
            // 2. La API devuelve { task: {...} }
            const createdTask = await response.json();                         
            
            // 3. Actualizar el estado de tareas añadiendo la nueva tarea
            // 💡 CORRECCIÓN: Usamos directamente createdTask.task, que ya contiene el _id
            setTasks(prevTasks => [...prevTasks, createdTask.task]);
            
            // 4. Ocultar el formulario
            setShowForm(false); 
            
        } catch (error) {
            console.error('Error al añadir la tarea:', error);
            // Manejar error (e.g., mostrar un mensaje al usuario)
        }
    };
    
    // FUNCIÓN: ELIMINAR TAREA (DELETE)
    const deleteTask = async (taskId) => {
        try {
            // 1. Hacemos la llamada al backend para la eliminación
            const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error('Error al eliminar la tarea');
            }

            // 2. Actualiza el estado (filtra la tarea eliminada)
            // 💡 CORRECCIÓN: Filtramos usando task._id, que es el estándar de MongoDB
            setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));

        } catch (error) {
            console.error("Error al eliminar la tarea:", error);
        }
    };

    return (
        <div className="App-container">
            <h1>Mi Lista de Tareas</h1>

            {/* Listado de tareas */}
            {loading ?
                <p>Cargando...</p> 
            :
                (tasks.length === 0 ? 
                    <p>Crea una tarea para empezar</p> 
                : 
                    <div className='task-list'>
                        {tasks.map((task) => (
                            <Task 
                                key={task._id} // Usamos _id para la clave de React
                                task={task} 
                                onDelete={deleteTask}
                            />
                        ))}
                    </div>
                )
            }

            {/* Formulario */}
            {showForm && 
                <TaskForm 
                    // Se pasa la función actualizada
                    onTaskCreated={addTask} 
                    onClose={() => setShowForm(false)} 
                />
            }
            
            {/* Botón de creación */}
            {!showForm && (
                <button 
                    onClick={() => setShowForm(true)} 
                    className='create-button'
                >
                    +
                </button>
            )}
        </div>
    );
}

export default App;