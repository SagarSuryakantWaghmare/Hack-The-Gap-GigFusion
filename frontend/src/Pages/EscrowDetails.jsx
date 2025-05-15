import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSpinner, FaCheckCircle, FaMoneyBillWave, FaExclamationTriangle, FaLock, FaUnlock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import escrowService from '../services/escrowService';

export default function EscrowDetails() {
    const { escrowId } = useParams();
    const navigate = useNavigate();
    const [escrow, setEscrow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const [disputeReason, setDisputeReason] = useState('');
    const [showDisputeForm, setShowDisputeForm] = useState(false);

    useEffect(() => {
        fetchEscrowDetails();
    }, [escrowId]);

    const fetchEscrowDetails = async () => {
        try {
            setLoading(true);
            const response = await escrowService.getEscrowById(escrowId);
            
            if (response.statusCode === 200) {
                setEscrow(response.data);
            } else {
                throw new Error(response.message || 'Failed to load escrow details');
            }
        } catch (err) {
            toast.error('Failed to load escrow details');
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleFundMilestone = async (milestoneId) => {
        try {
            const response = await escrowService.fundMilestone(escrowId, milestoneId);
            if (response.statusCode === 200) {
                toast.success('Milestone funded successfully');
                fetchEscrowDetails();
            } else {
                throw new Error(response.message || 'Failed to fund milestone');
            }
        } catch (err) {
            toast.error(err.message || 'Failed to fund milestone');
        }
    };

    const handleApproveRelease = async (milestoneId) => {
        try {
            const response = await escrowService.releaseMilestone(escrowId, milestoneId);
            if (response.statusCode === 200) {
                toast.success('Milestone approval successful');
                fetchEscrowDetails();
            } else {
                throw new Error(response.message || 'Failed to approve milestone');
            }
        } catch (err) {
            toast.error(err.message || 'Failed to approve milestone');
        }
    };

    const handleRaiseDispute = async () => {
        if (!disputeReason.trim()) {
            toast.error('Please provide a reason for the dispute');
            return;
        }

        try {
            const response = await escrowService.raiseDispute(escrowId, disputeReason);
            if (response.statusCode === 200) {
                toast.success('Dispute raised successfully');
                setShowDisputeForm(false);
                setDisputeReason('');
                fetchEscrowDetails();
            } else {
                throw new Error(response.message || 'Failed to raise dispute');
            }
        } catch (err) {
            toast.error(err.message || 'Failed to raise dispute');
        }
    };

    // Determine if user is client or freelancer
    const isClient = user && escrow?.client?._id === user._id;
    const isFreelancer = user && escrow?.freelancer?._id === user._id;

    // Format currency
    const formatCurrency = (amount, currency = 'INR') => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'funded': return 'bg-blue-100 text-blue-800';
            case 'released': return 'bg-green-100 text-green-800';
            case 'disputed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <FaSpinner className="animate-spin text-3xl text-blue-600" />
            </div>
        );
    }

    if (error || !escrow) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-red-600">Error</h2>
                    <p className="mt-2 text-gray-700">{error || 'Failed to load escrow details'}</p>
                    <button 
                        onClick={() => navigate(-1)} 
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Escrow Details</h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(escrow.status)}`}>
                            {escrow.status.charAt(0).toUpperCase() + escrow.status.slice(1)}
                        </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Project</h3>
                            <p className="text-base font-medium text-gray-900">{escrow.project?.title}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                            <p className="text-base font-medium text-gray-900">{formatCurrency(escrow.amount, escrow.currency)}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Client</h3>
                            <p className="text-base font-medium text-gray-900">{escrow.client?.fullName}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Freelancer</h3>
                            <p className="text-base font-medium text-gray-900">{escrow.freelancer?.fullName}</p>
                        </div>
                    </div>

                    {/* Dispute Info */}
                    {escrow.status === 'disputed' && escrow.disputeDetails && (
                        <div className="mt-6 bg-red-50 p-4 rounded-md border border-red-200">
                            <div className="flex items-center mb-2">
                                <FaExclamationTriangle className="text-red-500 mr-2" />
                                <h3 className="text-lg font-semibold text-red-700">Dispute Information</h3>
                            </div>
                            <p className="text-red-700 mb-2">
                                <span className="font-medium">Reason:</span> {escrow.disputeDetails.reason}
                            </p>
                            <p className="text-red-700 mb-2">
                                <span className="font-medium">Raised by:</span> {escrow.disputeDetails.raisedBy === escrow.client._id ? escrow.client.fullName : escrow.freelancer.fullName}
                            </p>
                            <p className="text-red-700">
                                <span className="font-medium">Status:</span> {escrow.disputeDetails.status}
                            </p>
                        </div>
                    )}
                </div>

                {/* Milestones */}
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Milestones</h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {escrow.milestones.map((milestone, index) => (
                        <div key={milestone._id || index} className={`border-b border-gray-200 last:border-b-0 p-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">{milestone.title}</h3>
                                    {milestone.description && (
                                        <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                                    )}
                                </div>
                                <div className="mt-2 md:mt-0 flex items-center">
                                    <span className="text-lg font-semibold text-gray-900 mr-3">
                                        {formatCurrency(milestone.amount, escrow.currency)}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                                        {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center justify-between pt-2 border-t border-gray-100">
                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="mr-4">
                                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                                    </span>
                                    
                                    {/* Approval indicators */}
                                    <div className="flex gap-4">
                                        <span className={`flex items-center ${milestone.clientApproval ? 'text-green-600' : 'text-gray-400'}`}>
                                            <FaCheckCircle className="mr-1" /> Client
                                        </span>
                                        <span className={`flex items-center ${milestone.freelancerApproval ? 'text-green-600' : 'text-gray-400'}`}>
                                            <FaCheckCircle className="mr-1" /> Freelancer
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Action buttons */}
                                <div className="flex gap-2 mt-2 md:mt-0">
                                    {isClient && milestone.status === 'pending' && (
                                        <button
                                            onClick={() => handleFundMilestone(milestone._id)}
                                            className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                        >
                                            <FaMoneyBillWave className="mr-1" /> Fund
                                        </button>
                                    )}
                                    
                                    {isClient && milestone.status === 'funded' && !milestone.clientApproval && (
                                        <button
                                            onClick={() => handleApproveRelease(milestone._id)}
                                            className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                        >
                                            <FaUnlock className="mr-1" /> Approve Release
                                        </button>
                                    )}
                                    
                                    {isFreelancer && milestone.status === 'funded' && !milestone.freelancerApproval && (
                                        <button
                                            onClick={() => handleApproveRelease(milestone._id)}
                                            className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                        >
                                            <FaCheckCircle className="mr-1" /> Confirm Completion
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dispute button */}
                {(isClient || isFreelancer) && escrow.status !== 'disputed' && (
                    <div className="mt-6">
                        {!showDisputeForm ? (
                            <button 
                                onClick={() => setShowDisputeForm(true)}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Raise Dispute
                            </button>
                        ) : (
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-medium mb-2">Raise Dispute</h3>
                                <textarea
                                    className="w-full border border-gray-300 rounded p-2 mb-4"
                                    rows="3"
                                    placeholder="Describe the issue..."
                                    value={disputeReason}
                                    onChange={(e) => setDisputeReason(e.target.value)}
                                ></textarea>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={handleRaiseDispute}
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Submit Dispute
                                    </button>
                                    <button 
                                        onClick={() => setShowDisputeForm(false)}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}