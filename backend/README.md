# E-Shop Backend API

This is the backend API for the E-Shop e-commerce application. It provides product data and other e-commerce functionality.

## Technology Stack

- Node.js
- Express.js
- Sequelize (ORM)
- SQLite (database)

## Getting Started

```bash
# Install dependencies
npm install

# Start the server
npm start
```

The server will run on port 5001 by default.

## API Endpoints

- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get a specific product by ID

## Deployment on Render

This backend is configured for easy deployment on Render:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Use the following settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables: None required for basic setup 