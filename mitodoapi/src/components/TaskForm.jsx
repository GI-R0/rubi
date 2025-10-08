import { useRef} from 'react'; 
import './TaskForm.css'; 

// 💡 CORRECCIÓN: El componente ahora recibe las props onTaskCreated y onClose
export default function TaskForm({ onTaskCreated, onClose }){ 

    // Referencias para capturar los valores sin usar estado
    const nameRef = useRef(null); 
    const textRef = useRef(null); 
    const statusRef = useRef(null); 

    const createTask = async (e) => {
        // Asegurar que el formulario no recargue la página
        e.preventDefault(); 
        
        // Objeto de la nueva tarea con los valores capturados
        const newTaskData = {
            name: nameRef.current.value,
            text: textRef.current.value,
            status: statusRef.current.value
        };

        try {
            // Petición al backend usando el método POST
            const response = await fetch('http://localhost:3000/tasks', { 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(newTaskData) // Envío de datos
            });
            
            // 💡 MEJORA: Verificar si la petición fue exitosa (código 2xx)
            if (!response.ok) {
                // Leer el mensaje de error de la API si está disponible
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear la tarea en el servidor');
            }

            // 💡 MEJORA: Leer la tarea creada, que contiene el ID generado por el backend
            const createdTask = await response.json(); 
            
            // 🚨 CAMBIO CLAVE 1: Llama a la función del padre para añadir la tarea a la lista
            // Pasamos el objeto de la tarea creada, que incluye el ID único.
            onTaskCreated(createdTask.task); 
            
            // 🚨 CAMBIO CLAVE 2: Llama a la función del padre para cerrar el formulario
            onClose(); 

            // Opcional: limpiar los campos del formulario
            nameRef.current.value = '';
            textRef.current.value = '';
            statusRef.current.value = 'Pending';

        } catch (error) {
            console.error('Error al crear la tarea: ', error);
            alert(`Fallo al crear la tarea: ${error.message || 'Verifica la conexión.'}`);
        }
    }
    
    // Estructura del formulario
    return (
        <form className="task-form" onSubmit={createTask}>
            <input type="text" placeholder="Nombre" ref={nameRef} required /> 
            <textarea placeholder="Descripción" ref={textRef} required></textarea> 
            <select ref={statusRef} required defaultValue="Pending"> {/* 💡 MEJORA: Establecer valor por defecto */}
                <option value="Pending">Pending</option> 
                <option value="Progress">Progress</option>
                <option value="Done">Done</option>
            </select>
            <div className="form-actions">
                <button type="submit">Crear Tarea</button>
                {/* 💡 AÑADIDO: Botón para cancelar y cerrar el formulario */}
                <button type="button" onClick={onClose} className="cancel-button">Cancelar</button>
            </div>
        </form>
    );
}