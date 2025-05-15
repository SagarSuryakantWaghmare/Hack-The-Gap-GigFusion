import mongoose from "mongoose";
import Escrow from "../models/escrow.model.js";
import Project from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create escrow for a project
const createEscrow = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
    const { milestones } = req.body;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
        throw new ApiError(400, "Valid project ID is required");
  }

    // Verify project exists and user is the client
    const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.client.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only project client can create escrow");
    }

    // Check if an escrow already exists
  const existingEscrow = await Escrow.findOne({ project: projectId });
  if (existingEscrow) {
    throw new ApiError(400, "An escrow already exists for this project");
  }

    // Calculate total amount from milestones
    const totalAmount = milestones.reduce((sum, milestone) => sum + Number(milestone.amount), 0);

  const escrow = await Escrow.create({
    project: projectId,
    client: req.user._id,
        freelancer: project.freelancer,
        amount: totalAmount,
        currency: project.budget.currency || "INR",
        milestones: milestones.map(m => ({
            title: m.title,
            amount: Number(m.amount),
            description: m.description || "",
            dueDate: m.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'pending'
        }))
    });

    // Update the project with the escrow reference
    await Project.findByIdAndUpdate(projectId, {
        escrow: escrow._id
    });

    return res.status(201).json(
        new ApiResponse(201, escrow, "Escrow created successfully")
    );
});

// Get escrow by ID
const getEscrowById = asyncHandler(async (req, res) => {
  const { escrowId } = req.params;

    if (!escrowId || !mongoose.Types.ObjectId.isValid(escrowId)) {
        throw new ApiError(400, "Valid escrow ID is required");
    }

  const escrow = await Escrow.findById(escrowId)
        .populate('project', 'title description')
        .populate('client', 'fullName email')
        .populate('freelancer', 'fullName email');

  if (!escrow) {
    throw new ApiError(404, "Escrow not found");
  }

    // Check if user is authorized to view this escrow
    if (![escrow.client._id.toString(), escrow.freelancer._id.toString()].includes(req.user._id.toString())) {
    throw new ApiError(403, "You don't have permission to view this escrow");
  }

    return res.status(200).json(
        new ApiResponse(200, escrow, "Escrow fetched successfully")
    );
});

// Get escrow by project ID
const getEscrowByProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
        throw new ApiError(400, "Valid project ID is required");
    }

    const escrow = await Escrow.findOne({ project: projectId })
        .populate('project', 'title description')
        .populate('client', 'fullName email')
        .populate('freelancer', 'fullName email');

  if (!escrow) {
        throw new ApiError(404, "No escrow found for this project");
    }

    // Check if user is authorized to view this escrow
    if (![escrow.client._id.toString(), escrow.freelancer._id.toString()].includes(req.user._id.toString())) {
        throw new ApiError(403, "You don't have permission to view this escrow");
    }

    return res.status(200).json(
        new ApiResponse(200, escrow, "Escrow fetched successfully")
    );
});

// Get all escrows for the current user
const getUserEscrows = asyncHandler(async (req, res) => {
    const { status, role } = req.query;
    
    const query = {};
    
    // Filter by status if provided
    if (status) {
        query.status = status;
    }
    
    // Filter by role (client or freelancer)
    if (role === 'client') {
        query.client = req.user._id;
    } else if (role === 'freelancer') {
        query.freelancer = req.user._id;
    } else {
        // If no role specified, get both
        query.$or = [
            { client: req.user._id },
            { freelancer: req.user._id }
        ];
    }

    const escrows = await Escrow.find(query)
        .populate('project', 'title description')
        .populate('client', 'fullName email')
        .populate('freelancer', 'fullName email')
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, { escrows, count: escrows.length }, "Escrows fetched successfully")
    );
});

// Fund a milestone
const fundMilestone = asyncHandler(async (req, res) => {
    const { escrowId, milestoneId } = req.params;
    
    if (!escrowId || !mongoose.Types.ObjectId.isValid(escrowId)) {
        throw new ApiError(400, "Valid escrow ID is required");
    }
    
  const escrow = await Escrow.findById(escrowId);
  if (!escrow) {
    throw new ApiError(404, "Escrow not found");
  }

  if (escrow.client.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only the client can fund milestones");
    }
    
    // Find the milestone
    const milestone = escrow.milestones.id(milestoneId);
    if (!milestone) {
        throw new ApiError(404, "Milestone not found");
    }
    
    if (milestone.status !== 'pending') {
        throw new ApiError(400, "Only pending milestones can be funded");
  }

  // Update milestone status
    milestone.status = 'funded';
  await escrow.save();

    return res.status(200).json(
        new ApiResponse(200, escrow, "Milestone funded successfully")
    );
});

// Release milestone payment
const releaseMilestone = asyncHandler(async (req, res) => {
    const { escrowId, milestoneId } = req.params;
    
    if (!escrowId || !mongoose.Types.ObjectId.isValid(escrowId)) {
        throw new ApiError(400, "Valid escrow ID is required");
    }
    
  const escrow = await Escrow.findById(escrowId);
  if (!escrow) {
    throw new ApiError(404, "Escrow not found");
  }

    // Check if user is either client or freelancer
    if (![escrow.client.toString(), escrow.freelancer.toString()].includes(req.user._id.toString())) {
        throw new ApiError(403, "Unauthorized to approve milestone");
    }
    
    // Find the milestone
    const milestone = escrow.milestones.id(milestoneId);
    if (!milestone) {
        throw new ApiError(404, "Milestone not found");
    }
    
    if (milestone.status !== 'funded') {
        throw new ApiError(400, "Only funded milestones can be released");
    }
    
    // Update approval based on who's making the request
    if (req.user._id.toString() === escrow.client.toString()) {
        milestone.clientApproval = true;
    } else {
        milestone.freelancerApproval = true;
    }
    
    // If both approved, release the payment
    if (milestone.clientApproval && milestone.freelancerApproval) {
        milestone.status = 'released';
        milestone.completedAt = new Date();
        
        // Check if all milestones are released
        const allReleased = escrow.milestones.every(m => m.status === 'released');
        if (allReleased) {
            escrow.status = 'released';
        } else {
            escrow.status = 'partially-released';
        }
    }
    
  await escrow.save();

    return res.status(200).json(
        new ApiResponse(200, escrow, "Milestone status updated successfully")
    );
});

// Raise dispute
const raiseDispute = asyncHandler(async (req, res) => {
  const { escrowId } = req.params;
    const { reason } = req.body;
    
    if (!escrowId || !mongoose.Types.ObjectId.isValid(escrowId)) {
        throw new ApiError(400, "Valid escrow ID is required");
    }
    
    if (!reason || reason.trim() === '') {
        throw new ApiError(400, "Dispute reason is required");
    }
    
  const escrow = await Escrow.findById(escrowId);
  if (!escrow) {
    throw new ApiError(404, "Escrow not found");
  }

    // Check if user is either client or freelancer
    if (![escrow.client.toString(), escrow.freelancer.toString()].includes(req.user._id.toString())) {
        throw new ApiError(403, "Unauthorized to raise dispute");
    }
    
    // Update escrow status and add dispute details
    escrow.status = 'disputed';
    escrow.disputeDetails = {
        raisedBy: req.user._id,
        reason,
        status: 'pending',
        raisedAt: new Date()
    };
    
    await escrow.save();

  return res.status(200).json(
        new ApiResponse(200, escrow, "Dispute raised successfully")
  );
});

export {
  createEscrow,
    getEscrowById,
  getEscrowByProject,
  getUserEscrows,
    fundMilestone,
    releaseMilestone,
    raiseDispute
};
