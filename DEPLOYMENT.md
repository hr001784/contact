# Deployment Guide

## Frontend Deployment (Vercel)

### Step 1: Prepare for Vercel
1. Make sure all files are committed to GitHub
2. Update `frontend/src/config.js` with your actual backend URL

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Click "Deploy"

### Step 3: Update Backend URL
After deployment, update `frontend/src/config.js`:
```javascript
const config = {
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-actual-backend-url.herokuapp.com' // Your deployed backend URL
    : 'http://localhost:5000'
};
```

## Backend Deployment (Heroku)

### Step 1: Prepare Backend
1. Create `Procfile` in backend folder:
```
web: node server.js
```

2. Update `package.json` scripts:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Step 2: Deploy to Heroku
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Deploy: `git push heroku main`
5. Open: `heroku open`

## Alternative Backend Deployment (Render)

### Step 1: Prepare Backend
1. Create `render.yaml` in root:
```yaml
services:
  - type: web
    name: contact-book-backend
    env: node
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
```

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com)
2. Connect GitHub repository
3. Create new Web Service
4. Select your repository
5. Use the render.yaml configuration
6. Deploy

## Environment Variables

### Frontend (Vercel)
- No environment variables needed for basic setup

### Backend (Heroku/Render)
- `NODE_ENV=production`
- `PORT` (automatically set by hosting platform)

## Testing Deployment

1. Deploy backend first
2. Update frontend config with backend URL
3. Deploy frontend
4. Test all functionality:
   - Add contacts
   - View contacts
   - Delete contacts
   - Pagination
   - Responsive design

## Troubleshooting

### Common Issues:
1. **CORS errors**: Backend has CORS enabled
2. **API not found**: Check backend URL in config.js
3. **Build fails**: Ensure all dependencies are in package.json
4. **Database issues**: SQLite file is included in deployment

### Local Testing:
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
