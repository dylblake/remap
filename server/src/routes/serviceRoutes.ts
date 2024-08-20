import { Router } from 'express';
import { getServices, createService, getServiceById, updateService, deleteService } from '../controllers/serviceController';

const serviceRoutes = Router();

// Route to create a new service
serviceRoutes.post('/', createService);

// Route to get all services
serviceRoutes.get('/', getServices);

// Route to get a single service by ID
serviceRoutes.get('/:id', getServiceById);

// Route to update a service by ID
serviceRoutes.put('/:id', updateService);

// Route to delete a service by ID
serviceRoutes.delete('/:id', deleteService);

export default serviceRoutes;
