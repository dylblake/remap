import { Router } from "express";
import { getDomains } from "../controllers/domainController";

const domainRoutes = Router();

// // Route to create a new domain
// domainRoutes.post('/', createDomain);

// Route to get all domains
domainRoutes.get("/", getDomains);

// // Route to update the order of domains
// domainRoutes.put('/order', updateDomainOrder);

// // Route to update a batch of domains
// domainRoutes.put('/batch', updateBatchDomains);

// // Route to get a single domain by UUID
// domainRoutes.get('/:id', getDomainById);

// // Route to update a domain by UUID
// domainRoutes.put('/:id', updateDomain);

// // Route to delete a domain by UUID
// domainRoutes.delete('/:id', deleteDomain);

export default domainRoutes;
