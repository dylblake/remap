import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import express from 'express';
import cors from 'cors'; 
import serviceRoutes from './routes/serviceRoutes';
console.log('process.env.PORT', process.env.PORT);

const app = express();
const port = process.env.PORT || 5001;

// CORS 
app.use(cors({
  origin: 'http://localhost:5176', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.use(express.json());

app.use('/api/services', serviceRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});