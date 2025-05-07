import { useState, useEffect } from 'react';
import { api } from '../services/api';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reportError, setReportError] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await api.getTasks();
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const handleUpdate = async (id, status) => {
        try {
            await api.updateTask(id, { status });
            const updatedTasks = tasks.map(task => 
                task._id === id ? { ...task, status } : task
            );
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.deleteTask(id);
            setTasks(tasks.filter(task => task._id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const generateReport = async (type) => {
        try {
            const response = await api.generateReport(type);
            const blob = new Blob([response.data], {
                type: type === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `tasks_${type === 'pdf' ? 'report.pdf' : 'report.xlsx'}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generating report:', error);
            setReportError('Failed to generate report. Please try again.');
            setTimeout(() => setReportError(null), 5000);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="task-list">
            <h2>Task List</h2>
            <div className="filters">
                <button onClick={() => generateReport('pdf')}>Generate PDF Report</button>
                <button onClick={() => generateReport('excel')}>Generate Excel Report</button>
            </div>
            
            {reportError && (
                <div className="error-message">
                    {reportError}
                </div>
            )}
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task._id}>
                            <td>{task.title}</td>
                            <td>{task.description}</td>
                            <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                            <td>
                                <select
                                    value={task.status}
                                    onChange={(e) => handleUpdate(task._id, e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(task._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TaskList;
