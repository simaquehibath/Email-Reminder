const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { generatePDFReport, generateExcelReport } = require('../utils/reportGenerator');
const { scheduleReminderCheck, sendTaskEmail } = require('../utils/emailService');

// Create Task
router.post('/', async (req, res) => {
    try {
        // Basic validation
        if (!req.body.title || !req.body.description || !req.body.dueDate || !req.body.email) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                errors: {
                    title: !req.body.title ? 'Title is required' : null,
                    description: !req.body.description ? 'Description is required' : null,
                    dueDate: !req.body.dueDate ? 'Due date is required' : null,
                    email: !req.body.email ? 'Email is required' : null
                }
            });
        }

        // Create and save task
        const task = new Task(req.body);
        const savedTask = await task.save();

        // Send email notification about task creation
        await sendTaskEmail(savedTask, 'created');

        // Log successful creation
        console.log('Task created:', savedTask);

        res.status(201).json(savedTask);
    } catch (error) {
        console.error('Error creating task:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation error',
                errors: Object.keys(error.errors).reduce((acc, key) => {
                    acc[key] = error.errors[key].message;
                    return acc;
                }, {})
            });
        }

        // Handle other errors
        res.status(500).json({ 
            message: 'Failed to create task',
            error: error.message 
        });
    }
});

// Get All Tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Single Task
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Task
router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete Task
router.delete('/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Generate Report
router.get('/report/:type', async (req, res) => {
    try {
        const tasks = await Task.find();
        
        if (req.params.type === 'pdf') {
            try {
                console.log('Generating PDF report...');
                console.log('Tasks:', tasks);
                const pdfBuffer = await generatePDFReport(tasks);
                res.set('Content-Type', 'application/pdf');
                res.set('Content-Disposition', 'attachment; filename=tasks_report.pdf');
                res.send(pdfBuffer);
            } catch (pdfError) {
                console.error('Error generating PDF:', pdfError);
                res.status(500).json({ 
                    message: 'Failed to generate PDF report',
                    error: pdfError.message 
                });
            }
        } else if (req.params.type === 'excel') {
            try {
                console.log('Generating Excel report...');
                console.log('Tasks:', tasks);
                const excelBuffer = await generateExcelReport(tasks);
                res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.set('Content-Disposition', 'attachment; filename=tasks_report.xlsx');
                res.send(excelBuffer);
            } catch (excelError) {
                console.error('Error generating Excel:', excelError);
                res.status(500).json({ 
                    message: 'Failed to generate Excel report',
                    error: excelError.message 
                });
            }
        } else {
            res.status(400).json({ message: 'Invalid report type' });
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks' });
    }
});

module.exports = router;
