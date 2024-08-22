import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import express from 'express';
import serviceRoutes from './routes/serviceRoutes';

const app = express();
const port = process.env.PORT;

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/services', serviceRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
