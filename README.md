# Contact Book App

A full-stack web application for managing contacts with add, view, and delete functionality. Built with React frontend and Node.js/Express backend with SQLite database.

## Features

- Add new contacts with validation
- View contacts with pagination
- Delete contacts
- Responsive design for mobile and desktop
- Real-time updates

## Tech Stack

- **Frontend**: React, Axios
- **Backend**: Node.js, Express
- **Database**: SQLite
- **Styling**: CSS with responsive design

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm start
```
Server runs on http://localhost:5000

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
App runs on http://localhost:3000

## API Endpoints

- `POST /api/contacts` - Add a new contact
- `GET /api/contacts?page=1&limit=10` - Get contacts with pagination
- `DELETE /api/contacts/:id` - Delete a contact

## Quick Start

### Local Development
```bash
# Backend
cd backend
npm install
npm start

# Frontend (new terminal)
cd frontend
npm install
npm start
```

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set Root Directory: `frontend`
4. Deploy automatically

### Backend (Heroku)
1. Create Heroku app
2. Push backend folder
3. Update frontend config with backend URL

### Backend (Render)
1. Connect GitHub repository
2. Set build command: `cd backend && npm install`
3. Set start command: `cd backend && npm start`

**See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.**
