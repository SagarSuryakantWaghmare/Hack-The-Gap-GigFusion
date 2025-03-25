import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createEscrow,
    getEscrowById,
    getEscrowByProject,
    getUserEscrows,
    fundMilestone,
    releaseMilestone,
    raiseDispute
} from "../controllers/escrow.controller.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// Create an escrow for a project
router.post("/projects/:projectId/escrow", createEscrow);

// Get escrow by ID
router.get("/escrows/:escrowId", getEscrowById);

// Get escrow by project ID
router.get("/projects/:projectId/escrow", getEscrowByProject);

// Get all escrows for the current user
router.get("/escrows", getUserEscrows);

// Fund a milestone
router.post("/escrows/:escrowId/milestones/:milestoneId/fund", fundMilestone);

// Approve/release a milestone
router.post("/escrows/:escrowId/milestones/:milestoneId/release", releaseMilestone);

// Raise a dispute
router.post("/escrows/:escrowId/dispute", raiseDispute);

export default router;
