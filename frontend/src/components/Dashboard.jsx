import { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { api } from '../services/api';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [chart, setChart] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await api.getTasks();
                setTasks(response.data);
                updateChart(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, []);

    const updateChart = (data) => {
        const ctx = document.getElementById('taskChart');
        if (chart) {
            chart.destroy();
        }

        const pending = data.filter(task => task.status === 'pending').length;
        const completed = data.filter(task => task.status === 'completed').length;

        setChart(new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Pending', 'Completed'],
                datasets: [{
                    data: [pending, completed],
                    backgroundColor: ['#FF6384', '#36A2EB']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Task Status Overview'
                    }
                }
            }
        }));
    };

    return (
        <div className="dashboard">
            <h2>Dashboard</h2>
            <div className="chart-container">
                <canvas id="taskChart"></canvas>
            </div>
            <div className="stats">
                <div className="stat-card">
                    <h3>Total Tasks</h3>
                    <p>{tasks.length}</p>
                </div>
                <div className="stat-card">
                    <h3>Pending Tasks</h3>
                    <p>{tasks.filter(task => task.status === 'pending').length}</p>
                </div>
                <div className="stat-card">
                    <h3>Completed Tasks</h3>
                    <p>{tasks.filter(task => task.status === 'completed').length}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
