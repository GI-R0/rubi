import './Task.css';

// 💡 CORRECCIÓN: El componente ahora recibe 'task' y la función 'onDelete' (desde App.js)
export default function Task({task, onDelete}){ 

    // Usamos el ID de la tarea, que parece ser '_id' en tu backend
    const taskId = task._id; 
    
    const handleDelete = async () => { // Función manejadora del click
        try {
            // Petición DELETE, pasando el ID de la tarea
            const response = await fetch(`http://localhost:3000/tasks/${taskId}`,{
                method: 'DELETE',
                // El header 'Content-Type' es innecesario en DELETE sin body
                // pero no interfiere. Lo dejo para seguir tu estructura, aunque se podría omitir.
                headers: {
                    'Content-Type': 'application/json' 
                }
            });

            const res = await response.json(); 

            if(response.ok){
                // 🚨 CAMBIO CLAVE: Llama a la función del padre (onDelete)
                // Esto delega la actualización del estado 'tasks' al componente App.js.
                onDelete(taskId); 
                alert("Tarea eliminada"); 
            }else{
                // Manejo de errores de la API (ej: tarea no encontrada)
                alert(res.message || "Error desconocido al eliminar."); 
            }
        } catch (error) {
            // Manejo de errores de red o conexión
            console.error('Error al eliminar la tarea:', error) 
            alert("Error de conexión al intentar eliminar la tarea.");
        }
    }

    return (
        <div className='task-container'>
            <h3>{task.name}</h3>
            <p>{task.text}</p>
            <p>Estado: {task.status}</p>
            
            {/* Botón que ejecuta la función handleDelete */}
            <button onClick={handleDelete}>Eliminar</button> 
        </div>
    );
}