import { z } from "zod";
import { Request, Response } from "express";
import pool from "../config/db";
import { generateUUID } from "../utils/uuid";
import { serviceSchema } from "../models/serviceModel";
import { uuidSchema } from "../models/uuidSchema";

// Create a new service
export const createService = async (req: Request, res: Response) => {
  try {
    // Generate a new UUID for the service
    const newServiceId = generateUUID();

    // Validate and parse the request data using the service schema
    const serviceData = serviceSchema.parse({
      ...req.body,
      uuid: newServiceId,
    });

    // Destructure the validated service data
    const { uuid, name, level, upperServiceId, middleServiceId } = serviceData;

    // Insert new service into the database
    try {
      const newService = await pool.query(
        `INSERT INTO services (uuid, name, level, upper_service_id, middle_service_id, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *`,
        [
          uuid,
          name,
          level || null, // Set `null` for optional fields if not provided
          upperServiceId || null, // Convert undefined to null
          middleServiceId || null, // Convert undefined to null
        ]
      );

      res.status(201).json(newService.rows[0]); // Respond with the newly created service
    } catch (err) {
      const dbError = err as { code?: string }; // Type assertion for database error
      if (dbError.code === "23505") {
        // Unique violation error handling
        res
          .status(400)
          .json({ message: "Service with this name already exists." });
      } else {
        console.error("Database error:", dbError);
        res.status(500).json({ message: "Server error" });
      }
    }
  } catch (error) {
    console.error("Error creating service:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors }); // Handle validation errors
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
};

// Get all services
export const getServices = async (_req: Request, res: Response) => {
  try {
    // Fetch all services ordered by the "order" field
    const result = await pool.query(
      `SELECT uuid, name, upper_service_id, middle_service_id, "order", level 
       FROM services ORDER BY "order"`
    );
    console.log(JSON.stringify(result.rows, null, 2));
    res.status(200).json(result.rows); // Respond with the fetched services
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single service by UUID
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate UUID format using Zod
    const parsedId = uuidSchema.safeParse(id);
    if (!parsedId.success) {
      return res.status(400).json({ message: "Invalid UUID format" });
    }

    const service = await pool.query("SELECT * FROM services WHERE uuid = $1", [
      parsedId.data,
    ]);

    if (service.rows.length === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(service.rows[0]); // Respond with the service details
  } catch (error) {
    console.error("Error fetching service by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a service by UUID
export const updateService = async (req: Request, res: Response) => {
  try {
    // Validate the UUID in the request parameters
    const parsedId = uuidSchema.safeParse(req.params.id);
    if (!parsedId.success) {
      return res.status(400).json({ message: "Invalid UUID format" });
    }

    const id: string = parsedId.data;

    // Validate and parse the incoming service data
    const serviceData = serviceSchema.partial().safeParse(req.body);
    if (!serviceData.success) {
      return res.status(400).json({ errors: serviceData.error.errors });
    }

    const { name, level, upperServiceId, middleServiceId } = serviceData.data;

    // Perform the update operation
    try {
      const updatedService = await pool.query(
        `UPDATE services 
         SET name = $1, level = $2, upper_service_id = $3, middle_service_id = $4, updated_at = NOW()
         WHERE uuid = $5 RETURNING *`,
        [
          name,
          level || null,
          upperServiceId || null,
          middleServiceId || null,
          id,
        ]
      );

      if (updatedService.rows.length === 0) {
        return res.status(404).json({ message: "Service not found" });
      }

      res.status(200).json(updatedService.rows[0]); // Respond with the updated service
    } catch (err) {
      const dbError = err as { code?: string };
      if (dbError.code === "23505") {
        res
          .status(400)
          .json({ message: "Service with this name already exists." });
      } else {
        console.error("Database error:", dbError);
        res.status(500).json({ message: "Server error" });
      }
    }
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update multiple services in batch
export const updateBatchServices = async (req: Request, res: Response) => {
  try {
    const { services } = req.body;

    if (!services || !Array.isArray(services)) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN"); // Begin transaction

      for (const service of services) {
        // Use the same field names as in the request body
        const { uuid, name, level, upper_service_id, middle_service_id } =
          service;

        // Ensure null for undefined upper and middle service IDs
        const upperServiceIdValue = upper_service_id ?? null;
        const middleServiceIdValue = middle_service_id ?? null;

        // Perform the update for each service
        await client.query(
          `UPDATE services 
           SET name = $1, level = $2, upper_service_id = $3, middle_service_id = $4, updated_at = NOW() 
           WHERE uuid = $5`,
          [name, level, upperServiceIdValue, middleServiceIdValue, uuid]
        );
      }

      await client.query("COMMIT"); // Commit transaction
      res.status(200).json({ message: "Services updated successfully" });
    } catch (err) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error updating services in batch:", err);
      res.status(500).json({ message: "Failed to update services" });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error in batch update:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a service by UUID
export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate the UUID
    const parsedId = uuidSchema.safeParse(id);
    if (!parsedId.success) {
      return res.status(400).json({ message: "Invalid UUID format" });
    }

    const deletedService = await pool.query(
      "DELETE FROM services WHERE uuid = $1 RETURNING *",
      [parsedId.data]
    );

    if (deletedService.rows.length === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateServiceOrder = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { services } = req.body;

    if (!services || services.length === 0) {
      return res.status(400).json({ message: "No services data received" });
    }

    await client.query("BEGIN"); // Begin the transaction

    for (const service of services) {
      const { uuid, order } = service;

      // Update the order for each service
      await client.query(
        `UPDATE services 
         SET "order" = $1, updated_at = NOW() 
         WHERE uuid = $2`,
        [order, uuid]
      );
    }

    await client.query("COMMIT"); // Commit the transaction
    res.status(200).json({ message: "Order updated successfully" });
  } catch (err) {
    // Check if the error is an instance of Error
    if (err instanceof Error) {
      console.error("Error during updateServiceOrder:", err.message);
      res
        .status(500)
        .json({ message: "Failed to update order", error: err.message });
    } else {
      console.error("Unexpected error during updateServiceOrder:", err);
      res.status(500).json({
        message: "Failed to update order",
        error: "Unknown error occurred",
      });
    }
  } finally {
    client.release(); // Release the database connection
  }
};
