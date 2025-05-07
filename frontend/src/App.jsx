import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

function App() {
  return (
    <Router>
      <div className="app">
        <nav>
          <h1>Email Reminder System</h1>
          <ul>
            <li><a href="/">Dashboard</a></li>
            <li><a href="/add">Add Task</a></li>
            <li><a href="/tasks">Task List</a></li>
          </ul>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<TaskForm />} />
            <Route path="/tasks" element={<TaskList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
