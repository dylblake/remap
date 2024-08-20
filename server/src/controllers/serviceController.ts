import { z } from 'zod';
import { Request, Response } from 'express';
import pool from '../config/db';
import { serviceSchema } from '../models/serviceModel';
import { generateUUID } from '../utils/uuid';

export const createService = async (req: Request, res: Response) => {
  try {
    // Generate a UUID for the new service
    const newServiceId = generateUUID();

    // Validate and parse the incoming request data
    const serviceData = serviceSchema.parse({
      ...req.body,
      uuid: newServiceId, // Add the generated UUID to the request data
    });

    const { uuid, name, tier, upperServiceId, middleServiceId } = serviceData;

    // Insert the new service into the database
    const newService = await pool.query(
      'INSERT INTO services (uuid, name, tier, upper_service_id, middle_service_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *',
      [uuid, name, tier, upperServiceId, middleServiceId]
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

export const getServices = async (_req: Request, res: Response) => {
  try {
    const services = await pool.query('SELECT * FROM services');
    res.status(200).json(services.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
