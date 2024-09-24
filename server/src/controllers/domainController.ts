import { z } from "zod";
import { Request, Response } from "express";
import pool from "../config/db";

// Get all services
export const getDomains = async (_req: Request, res: Response) => {
  try {
    // Fetch all services ordered by the "order" field
    const result = await pool.query(
      `SELECT uuid, name, upper_domain_id, middle_domain_id, "order", level 
         FROM domains ORDER BY "order"`
    );
    console.log(JSON.stringify(result.rows, null, 2));
    res.status(200).json(result.rows); // Respond with the fetched domains
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: "Server error" });
  }
};
