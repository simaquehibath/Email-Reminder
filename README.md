# Email Reminder System

A full-stack application for managing and scheduling email reminders.

## Features

- Create and manage email reminders
- Schedule reminders with specific dates and times
- Modern, responsive frontend interface
- RESTful API backend
- MongoDB database integration

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB
- Styling: CSS Modules

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/simaquehibath/Email-Reminder.git
cd Email-Reminder
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Configure environment variables:
- Copy `.env.example` to `.env` in the backend directory
- Update the environment variables as needed

5. Start MongoDB:
```bash
mongod --config mongod.conf
```

6. Start the backend server:
```bash
cd backend
npm run dev
```

7. Start the frontend development server:
```bash
cd frontend
npm run dev
```

## Project Structure

```
Email-Reminder/
├── backend/           # Backend server code
├── frontend/          # Frontend application
├── data/              # MongoDB data directory
├── mongod.conf        # MongoDB configuration
├── package.json       # Root package.json
└── server.js          # Main server file
```

## API Documentation

The backend API is documented using Swagger/OpenAPI. You can access the documentation at:
`http://localhost:3000/api-docs` (when the server is running)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

#screenshots

<img width="1159" alt="Screenshot 2025-05-07 at 16 58 19" src="https://github.com/user-attachments/assets/61ec81f2-9186-4020-b6f8-d326aea6a0bc" />


<img width="1159" alt="Screenshot 2025-05-07 at 16 58 39" src="https://github.com/user-attachments/assets/4b589c3c-ef7b-4fc2-b334-6ccc55406168" />


<img width="1165" alt="Screenshot 2025-05-07 at 16 59 01" src="https://github.com/user-attachments/assets/fc86034c-6fbe-42a6-88df-1229353f5b51" />


<img width="1167" alt="Screenshot 2025-05-07 at 16 59 14" src="https://github.com/user-attachments/assets/85b979d5-d8b3-4f48-a482-be5d77c659b3" />



 


