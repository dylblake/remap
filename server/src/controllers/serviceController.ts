import { z } from 'zod';
import { Request, Response } from 'express';
import pool from '../config/db';
import { serviceSchema } from '../models/ServiceModel';
import { generateUUID } from '../utils/uuid';

// Create a new service
export const createService = async (req: Request, res: Response) => {
  try {
    // Generate a UUID for the new service
    const newServiceId = generateUUID();

    // Validate and parse the incoming request data
    const serviceData = serviceSchema.parse({
      ...req.body,
      uuid: newServiceId, // Add the generated UUID to the request data
    });

    const { uuid, name, type, upperServiceId, middleServiceId } = serviceData;

    // Insert the new service into the database
    const newService = await pool.query(
      'INSERT INTO services (uuid, name, type, upper_service_id, middle_service_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *',
      [uuid, name, type, upperServiceId, middleServiceId]
    );

    res.status(201).json(newService.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// Get all services
export const getServices = async (_req: Request, res: Response) => {
  try {
    const services = await pool.query('SELECT * FROM services');
    res.status(200).json(services.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single service by UUID
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await pool.query('SELECT * FROM services WHERE uuid = $1', [id]);

    if (service.rows.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json(service.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a service by UUID
export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate and parse the incoming request data
    const serviceData = serviceSchema.parse(req.body);

    const { name, type, upperServiceId, middleServiceId } = serviceData;

    const updatedService = await pool.query(
      'UPDATE services SET name = $1, type = $2, upper_service_id = $3, middle_service_id = $4, updated_at = NOW() WHERE uuid = $5 RETURNING *',
      [name, type, upperServiceId, middleServiceId, id]
    );

    if (updatedService.rows.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json(updatedService.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// Delete a service by UUID
export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedService = await pool.query('DELETE FROM services WHERE uuid = $1 RETURNING *', [id]);

    if (deletedService.rows.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
