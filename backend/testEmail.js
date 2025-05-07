const { sendReminderEmail } = require('./utils/emailService');

// Create a test task
const testTask = {
    title: 'Test Task',
    description: 'This is a test task for email reminder',
    dueDate: new Date(), // Current time
    status: 'pending',
    email: 'test@example.com' // Using a test email address
};

// Send reminder email
sendReminderEmail(testTask)
    .then(success => {
        if (success) {
            console.log('Test email sent successfully!');
        } else {
            console.error('Failed to send test email');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
