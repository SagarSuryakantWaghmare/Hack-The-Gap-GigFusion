import mongoose from "mongoose";

const MilestoneSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'funded', 'released', 'disputed'],
        default: 'pending'
    },
    clientApproval: {
        type: Boolean,
        default: false
    },
    freelancerApproval: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date
    }
}, { timestamps: true });

const DisputeSchema = new mongoose.Schema({
    raisedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'resolved'],
        default: 'pending'
    },
    resolution: String,
    raisedAt: {
        type: Date,
        default: Date.now
    },
    resolvedAt: Date
});

const EscrowSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'INR'
    },
    status: {
        type: String,
        enum: ['pending', 'funded', 'partially-released', 'released', 'refunded', 'disputed'],
        default: 'pending'
    },
    milestones: [MilestoneSchema],
    disputeDetails: DisputeSchema
}, {
    timestamps: true
});

export default mongoose.model('Escrow', EscrowSchema);