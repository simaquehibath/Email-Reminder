import axios from 'axios';

const API_URL = 'http://localhost:5004/api/tasks';

export const api = {
    createTask: async (taskData) => {
        return await axios.post(API_URL, taskData);
    },
    getTasks: async () => {
        return await axios.get(API_URL);
    },
    getTask: async (id) => {
        return await axios.get(`${API_URL}/${id}`);
    },
    updateTask: async (id, taskData) => {
        return await axios.put(`${API_URL}/${id}`, taskData);
    },
    deleteTask: async (id) => {
        return await axios.delete(`${API_URL}/${id}`);
    },
    generateReport: async (type) => {
        return await axios.get(`${API_URL}/report/${type}`, {
            responseType: 'blob'
        });
    }
};
