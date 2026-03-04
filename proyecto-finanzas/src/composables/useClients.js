import { ref } from 'vue';

// Definimos el estado global de clientes
const clients = ref([]);

export function useClients() {
    // IMPORTANTE: Esta es la ruta donde json-server suele levantar tu db.json local.
    // Asegúrate de que tu json-server esté corriendo en este puerto (3000).
    const API_URL = 'http://localhost:3000/clients';

    // 1. Leer los clientes guardados desde db.json (GET)
    const loadClients = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error al obtener los datos');
            clients.value = await response.json();
        } catch (error) {
            console.error("Error al leer los clientes:", error);
            clients.value = [];
        }
    };

    // 2. Crear un nuevo cliente (POST)
    const addClient = async (clientData) => {
        try {
            const newClient = {
                ...clientData,
                createdAt: new Date().toLocaleDateString()
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newClient)
            });

            if (response.ok) {
                const savedClient = await response.json();
                // json-server crea el 'id' automáticamente, así que tomamos el objeto que nos devuelve
                // y lo ponemos al inicio de nuestra lista visual
                clients.value.unshift(savedClient);
            }
        } catch (error) {
            console.error('Error al agregar cliente:', error);
        }
    };

    // 3. Editar un cliente existente (PATCH)
    const updateClient = async (id, updatedData) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PATCH', // Usamos PATCH para actualizar solo los campos que enviamos
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                const updatedClient = await response.json();
                // Actualizamos la tarjeta en la pantalla sin tener que recargar la página
                const index = clients.value.findIndex(client => client.id === id);
                if (index !== -1) {
                    clients.value[index] = updatedClient;
                }
            }
        } catch (error) {
            console.error('Error al actualizar cliente:', error);
        }
    };

    // 4. Eliminar un cliente (DELETE)
    const deleteClient = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Borramos la tarjeta de la vista
                clients.value = clients.value.filter(client => client.id !== id);
            }
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
        }
    };

    // Cargamos los clientes automáticamente cuando se invoca este composable
    loadClients();

    return {
        clients,
        loadClients,
        addClient,
        updateClient,
        deleteClient
    };
}