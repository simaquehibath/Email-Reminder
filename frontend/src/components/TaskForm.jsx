import { useState } from 'react';
import { api } from '../services/api';

const TaskForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        email: ''
    });
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.createTask(formData);
            setFormData({
                title: '',
                description: '',
                dueDate: '',
                email: ''
            });
            setError(null);
            console.log('Task created successfully:', response.data);
        } catch (error) {
            console.error('Error creating task:', error);
            setError(error.response?.data?.message || 'Failed to create task');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            <div className="form-group">
                <label>Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter task title"
                />
            </div>
            <div className="form-group">
                <label>Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Enter task description"
                />
            </div>
            <div className="form-group">
                <label>Due Date</label>
                <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                />
            </div>
            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                />
            </div>
            <button type="submit" className="btn">Add Task</button>
        </form>
    );
};

export default TaskForm;
