import { z } from 'zod';
import { Request, Response } from 'express';
import pool from '../config/db';
import { serviceSchema } from '../models/ServiceModel';
import { generateUUID } from '../utils/uuid';

// Create a new service
export const createService = async (req: Request, res: Response) => {
  try {
    // Generate UUID
    const newServiceId = generateUUID();

    // Validate and parse service data
    const serviceData = serviceSchema.parse({
      ...req.body,
      uuid: newServiceId,
    });

    const { uuid, name, type, upperServiceId, middleServiceId } = serviceData;

    // Insert new service into db
    try {
      const newService = await pool.query(
        'INSERT INTO services (uuid, name, type, upper_service_id, middle_service_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *',
        [uuid, name, type || null, upperServiceId || null, middleServiceId || null]
      );

      res.status(201).json(newService.rows[0]);
    } catch (err) {
      const dbError = err as { code?: string }; // Type assertion for dbError
      if (dbError.code === '23505') { // Unique violation error code
        res.status(400).json({ message: 'Service with this name already exists.' });
      } else {
        console.error('Database error:', dbError);
        res.status(500).json({ message: 'Server error' });
      }
    }
  } catch (error) {
    console.error('Error creating service:', error); // Detailed logging
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
    const services = await pool.query('SELECT uuid, name, upper_service_id, middle_service_id, type FROM services');
    res.status(200).json(services.rows);
  } catch (error) {
    console.error('Error fetching services:', error); // Detailed logging
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
    console.error('Error fetching service by ID:', error); // Detailed logging
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a service by UUID
export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate and parse service data
    const serviceData = serviceSchema.partial().parse(req.body);

    const { name, type, upperServiceId, middleServiceId } = serviceData;

    try {
      const updatedService = await pool.query(
        'UPDATE services SET name = $1, type = $2, upper_service_id = $3, middle_service_id = $4, updated_at = NOW() WHERE uuid = $5 RETURNING *',
        [name, type || null, upperServiceId || null, middleServiceId || null, id]
      );

      if (updatedService.rows.length === 0) {
        return res.status(404).json({ message: 'Service not found' });
      }

      res.status(200).json(updatedService.rows[0]);
    } catch (err) {
      const dbError = err as { code?: string }; // Type assertion for dbError
      if (dbError.code === '23505') { // Unique violation error code
        res.status(400).json({ message: 'Service with this name already exists.' });
      } else {
        console.error('Database error:', dbError);
        res.status(500).json({ message: 'Server error' });
      }
    }
  } catch (error) {
    console.error('Error updating service:', error); // Detailed logging
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
    console.error('Error deleting service:', error); // Detailed logging
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateServiceOrder = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    // Log the incoming request body
    console.log('Received request body:', req.body);

    const { services } = req.body;

    if (!services || services.length === 0) {
      return res.status(400).json({ message: 'No services data received' });
    }

    await client.query('BEGIN');

    for (const service of services) {
      const { uuid, order } = service;
      await client.query(
        `UPDATE services SET "order" = $1, updated_at = NOW() WHERE uuid = $2`,
        [order, uuid]
      );
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Order updated successfully' });
  } catch (err) {
    // Narrowing the error type to `Error` using `instanceof`
    if (err instanceof Error) {
      console.error('Error during updateServiceOrder:', err.message);
      res.status(500).json({ message: 'Failed to update order', error: err.message });
    } else {
      // Handle the case where `err` is not an instance of `Error`
      console.error('Unexpected error during updateServiceOrder:', err);
      res.status(500).json({ message: 'Failed to update order', error: 'Unknown error occurred' });
    }
  } finally {
    client.release();
  }
};