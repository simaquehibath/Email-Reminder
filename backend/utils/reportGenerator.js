const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

const generatePDFReport = async (tasks) => {
    try {
        console.log('Starting PDF generation');
        console.log('Tasks:', tasks);

        if (!Array.isArray(tasks)) {
            throw new Error('Invalid tasks data');
        }

        console.log('Creating PDF document');
        const doc = new PDFDocument({
            bufferPages: true,
            info: {
                Title: 'Task Report',
                Author: 'Email Reminder System',
                CreationDate: new Date(),
                Producer: 'Email Reminder System v1.0'
            }
        });

        // Create a buffer to store the PDF
        const chunks = [];
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => {
            console.log('PDF document ended');
        });

        // Add header with better styling
        doc
            .fontSize(28)
            .font('Times-Roman')
            .text('Task Report', { align: 'center' });
        
        // Add date of report generation
        doc
            .fontSize(12)
            .font('Times-Roman')
            .text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' })
            .moveDown(2);

        // Add table headers with better formatting
        const headers = ['Title', 'Description', 'Due Date', 'Status'];
        const headerWidths = [100, 200, 100, 100];
        
        doc
            .fontSize(12)
            .font('Times-Bold')
            .fillColor('#333333');
        
        // Draw header row
        headers.forEach((header, index) => {
            doc.text(header, 50 + headerWidths.slice(0, index).reduce((a, b) => a + b, 0), doc.y);
        });
        doc.moveDown();

        // Add horizontal line after headers
        doc
            .moveTo(50, doc.y)
            .lineTo(50 + headerWidths.reduce((a, b) => a + b, 0), doc.y)
            .stroke();
        doc.moveDown();

        // Add task data with better formatting
        tasks.forEach(task => {
            doc
                .fontSize(11)
                .font('Times-Roman')
                .fillColor('#666666');

            // Add row data
            const row = [
                task.title || '',
                task.description || '',
                task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '',
                task.status || ''
            ];

            row.forEach((cell, index) => {
                doc.text(cell, 50 + headerWidths.slice(0, index).reduce((a, b) => a + b, 0), doc.y);
            });
            doc.moveDown();
        });

        // Add summary statistics
        const pending = tasks.filter(task => task.status === 'pending').length;
        const completed = tasks.filter(task => task.status === 'completed').length;
        const total = tasks.length;

        doc
            .fontSize(12)
            .font('Times-Bold')
            .fillColor('#333333')
            .text('Summary Statistics:', { align: 'left' })
            .moveDown();

        doc
            .fontSize(11)
            .font('Times-Roman')
            .fillColor('#666666')
            .text(`Total Tasks: ${total}`)
            .text(`Pending Tasks: ${pending}`)
            .text(`Completed Tasks: ${completed}`);

        // Finalize the document
        doc.end();

        // Wait for the document to be fully generated
        await new Promise((resolve, reject) => {
            doc.on('finish', resolve);
            doc.on('error', reject);
        });

        // Combine chunks into a buffer
        const pdfBuffer = Buffer.concat(chunks);
        console.log('PDF generation completed successfully');
        return pdfBuffer;

    } catch (error) {
        console.error('Error in PDF generation:', error);
        throw error;
    }

    // Add header with better styling
    doc
        .fontSize(28)
        .font('Times-Roman')
        .text('Task Report', { align: 'center' });
    
    // Add date of report generation
    doc
        .fontSize(12)
        .font('Times-Roman')
        .text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' })
        .moveDown(2);

    // Add table headers with better formatting
    const headers = ['Title', 'Description', 'Due Date', 'Status'];
    const headerWidths = [100, 200, 100, 100];
    
    doc
        .fontSize(12)
        .font('Times-Bold')
        .fillColor('#333333');
    
    // Draw header row
    headers.forEach((header, index) => {
        doc.text(header, 50 + headerWidths.slice(0, index).reduce((a, b) => a + b, 0), doc.y);
    });
    doc.moveDown();

    // Add horizontal line after headers
    doc
        .moveTo(50, doc.y)
        .lineTo(50 + headerWidths.reduce((a, b) => a + b, 0), doc.y)
        .stroke();
    doc.moveDown();

    // Add task data with better formatting
    tasks.forEach(task => {
        doc
            .fontSize(11)
            .font('Times-Roman')
            .fillColor('#666666');

        // Add row data
        const row = [
            task.title || '',
            task.description || '',
            task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '',
            task.status || ''
        ];

        row.forEach((cell, index) => {
            doc.text(cell, 50 + headerWidths.slice(0, index).reduce((a, b) => a + b, 0), doc.y);
        });
        doc.moveDown();
    });

    // Add summary statistics
    const pending = tasks.filter(task => task.status === 'pending').length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const total = tasks.length;

    doc
        .fontSize(12)
        .font('Times-Bold')
        .fillColor('#333333')
        .text('Summary Statistics:', { align: 'left' })
        .moveDown();

    doc
        .fontSize(11)
        .font('Times-Roman')
        .fillColor('#666666')
        .text(`Total Tasks: ${total}`)
        .text(`Pending Tasks: ${pending}`)
        .text(`Completed Tasks: ${completed}`);

    // Finalize the document
    doc.end();

    // Wait for the document to be fully generated
    await new Promise(resolve => doc.on('finish', resolve));

};

const generateExcelReport = async (tasks) => {
    try {
        console.log('Starting Excel generation');
        console.log('Tasks:', tasks);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Tasks');

        // Add headers
        worksheet.columns = [
            { header: 'Title', key: 'title', width: 30 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'Due Date', key: 'dueDate', width: 20 },
            { header: 'Status', key: 'status', width: 20 }
        ];

        // Add data
        tasks.forEach(task => {
            worksheet.addRow({
                title: task.title || '',
                description: task.description || '',
                dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '',
                status: task.status || ''
            });
        });

        // Add summary row
        const pending = tasks.filter(task => task.status === 'pending').length;
        const completed = tasks.filter(task => task.status === 'completed').length;
        const total = tasks.length;

        worksheet.addRow({}); // Empty row for spacing
        worksheet.addRow({
            title: 'Summary',
            description: `Total Tasks: ${total}`,
            dueDate: `Pending: ${pending}`,
            status: `Completed: ${completed}`
        });

        // Generate buffer
        const buffer = await workbook.xlsx.writeBuffer();
        console.log('Excel generation completed successfully');
        return buffer;

    } catch (error) {
        console.error('Error in Excel generation:', error);
        throw error;
    }
};

module.exports = {
    generatePDFReport,
    generateExcelReport
};
