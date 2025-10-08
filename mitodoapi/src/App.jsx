import './App.css';
import { useState, useEffect } from 'react';
import Task from './components/Task/Task'; 
import TaskForm from './components/TaskForm/TaskForm'; 

function App() {
    // Definición de estados
    const [tasks, setTasks] = useState([]); 
    const [loading, setLoading] = useState(false); 
    const [showForm, setShowForm] = useState(false); 

    // Función para obtener las tareas (GET)
    const fetchTasks = async () => {
        try {
            setLoading(true); 
            
            // 💡 NOTA: Asumiendo que la respuesta es { tasks: [...] } 
            const response = await fetch(`http://localhost:3000/tasks`); 
            
            if (!response.ok) {
                throw new Error('Error en la petición GET');
            }
            
            const res = await response.json(); 
            
            // Asume que el backend devuelve un objeto con la propiedad 'tasks'
            setTasks(res.tasks || []); 
            setLoading(false); 

        } catch (error) {
            console.error('Error al obtener las tareas:', error);
            setLoading(false);
        }
    }

    // Petición inicial al montar el componente
    useEffect(() => {
        fetchTasks(); 
    }, []) 
    
    // ------------------------------------------------------------------
    // FUNCIÓN: CREAR TAREA (POST)
    // ------------------------------------------------------------------
    const addTask = async (newTaskData) => {
        try {
            // 1. Simulación de la petición POST a la API
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

            // 2. La API debería devolver la tarea creada, incluyendo su ID.
            const createdTask = await response.json(); 
            
            // 3. Actualizar el estado de tareas añadiendo la nueva tarea
            setTasks(prevTasks => [...prevTasks, createdTask.task]);
            
            // 4. Ocultar el formulario
            setShowForm(false); 

        } catch (error) {
            console.error('Error al añadir la tarea:', error);
            // Manejar error (e.g., mostrar un mensaje al usuario)
        }
    };
    
    // ------------------------------------------------------------------
    // FUNCIÓN: ELIMINAR TAREA (DELETE)
    // ------------------------------------------------------------------
    const deleteTask = async (taskId) => {
        try {
            // 1. Petición DELETE a la API
            const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error('Error al eliminar la tarea');
            }

            // 2. Si es exitosa, actualizar el estado (filtrar la tarea eliminada)
            setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));

        } catch (error) {
            console.error("Error al eliminar la tarea:", error);
        }
    };

    return (
        <div className="App-container"> {/* Contenedor para aplicar estilos globales */}
            <h1>Mi Lista de Tareas</h1>

            {/* Listar las tareas con lógica condicional */}
            {loading ?
                <p>Cargando...</p> 
            :
                (tasks.length === 0 ? 
                    <p>Crea una tarea para empezar</p> 
                : 
                    <div className='task-list'>
                        {tasks.map((task) => (
                            <Task 
                                key={task.id} // 🔑 Usamos el ID de la tarea como 'key' (mejor práctica)
                                task={task} 
                                onDelete={deleteTask} // 💡 Pasamos la función de eliminación
                            />
                        ))}
                    </div>
                )
            }

            {/* Mostrar el formulario condicionalmente */}
            {showForm && 
                <TaskForm 
                    onTaskCreated={addTask} // 💡 Pasamos la función para crear tarea
                    onClose={() => setShowForm(false)} // 💡 Pasamos la función para cerrar el formulario
                />
            }
            
            {/* Botón para mostrar el formulario */}
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