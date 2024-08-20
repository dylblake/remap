import { z } from 'zod';
import { Request, Response } from 'express';
import pool from '../config/db';
import { serviceSchema } from '../models/serviceModel';

export const createService = async (req: Request, res: Response) => {
  try {
    const serviceData = serviceSchema.parse(req.body);

    const { serviceName } = serviceData;

    const newService = await pool.query(
      'INSERT INTO services (name, email, age) VALUES ($1, $2, $3) RETURNING *',
      [serviceName]
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
    const users = await pool.query('SELECT * FROM services');
    res.status(200).json(users.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
