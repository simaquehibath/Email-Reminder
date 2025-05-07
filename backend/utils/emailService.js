const nodemailer = require('nodemailer');
const Task = require('../models/Task');
require('dotenv').config();

// Email configuration
const emailConfig = {
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
};

const checkAndSendReminders = async () => {
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const tasks = await Task.find({
            status: 'pending',
            dueDate: {
                $gte: tomorrow.toISOString(),
                $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000).toISOString()
            }
        });

        for (const task of tasks) {
            await sendReminderEmail(task);
        }
    } catch (error) {
        console.error('Error checking for reminders:', error);
    }
};

// Schedule the reminder check to run daily at 9 AM
const scheduleReminderCheck = () => {
    const now = new Date();
    const nextRun = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);
    
    if (nextRun < now) {
        nextRun.setDate(nextRun.getDate() + 1);
    }

    const timeUntilNextRun = nextRun.getTime() - now.getTime();
    
    setTimeout(() => {
        checkAndSendReminders();
        scheduleReminderCheck();
    }, timeUntilNextRun);
};

const sendTaskEmail = async (task, type = 'reminder') => {
    try {
        const transporter = nodemailer.createTransport(emailConfig);
        
        let subject, text;
        
        if (type === 'reminder') {
            subject = `Task Reminder: ${task.title}`;
            text = `This is a reminder for your task: ${task.title}
                   Description: ${task.description}
                   Due Date: ${new Date(task.dueDate).toLocaleDateString()}`;
        } else if (type === 'created') {
            subject = `New Task Created: ${task.title}`;
            text = `A new task has been created:
                   Title: ${task.title}
                   Description: ${task.description}
                   Due Date: ${new Date(task.dueDate).toLocaleDateString()}
                   Status: ${task.status}`;
        }

        await transporter.sendMail({
            from: 'taskreminder@example.com',
            to: task.email,
            subject: subject,
            text: text
        });

        console.log(`Email sent successfully - Type: ${type}, Task: ${task.title}`);
        return true;
    } catch (error) {
        console.error(`Error sending ${type} email:`, error);
        return false;
    }
};

module.exports = {
    sendTaskEmail,
    checkAndSendReminders,
    scheduleReminderCheck
};
