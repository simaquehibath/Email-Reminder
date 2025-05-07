require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const taskRoutes = require('./routes/tasks');
const { scheduleReminderCheck } = require('./utils/emailService');

const app = express();
const { generatePDFReport } = require('./utils/reportGenerator');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

// Test PDF generation endpoint
app.get('/test-pdf', async (req, res) => {
    try {
        const testTasks = [
            {
                title: 'Test Task 1',
                description: 'This is a test task',
                dueDate: new Date(),
                status: 'pending'
            },
            {
                title: 'Test Task 2',
                description: 'Another test task',
                dueDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
                status: 'completed'
            }
        ];

        const pdfBuffer = await generatePDFReport(testTasks);
        res.set('Content-Type', 'application/pdf');
        res.set('Content-Disposition', 'attachment; filename=test_report.pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating test PDF:', error);
        res.status(500).json({ message: 'Failed to generate test PDF', error: error.message });
    }
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/email-reminder', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB Connected');
    
    // Initialize email reminder system
    scheduleReminderCheck();
    
    // Start Server
    const PORT = process.env.PORT || 5004;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
});
