import { Router } from 'express';
import { getServices, createService, getServiceById, updateService, deleteService } from '../controllers/serviceController';

const serviceRoutes = Router();

// Route to create a new service
serviceRoutes.post('/', createService);

// Route to get all services
serviceRoutes.get('/', getServices);

// Route to get a single service by UUID
serviceRoutes.get('/:id', getServiceById);

// Route to update a service by UUID
serviceRoutes.put('/:id', updateService);

// Route to delete a service by UUID
serviceRoutes.delete('/:id', deleteService);

export default serviceRoutes;
