import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import escrowService from '../services/escrowService';
import { projectService } from '../services';

export default function CreateEscrow() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [project, setProject] = useState(null);
    const [error, setError] = useState(null);
    
    const [formData, setFormData] = useState({
        totalAmount: 0,
        currency: 'INR',
        paymentType: 'traditional',
        milestones: [
            {
                title: 'Project Completion',
                description: 'Full payment upon completion',
                amount: 0,
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
            }
        ]
    });

    useEffect(() => {
        fetchProjectDetails();
    }, [projectId]);

    const fetchProjectDetails = async () => {
        try {
            setLoading(true);
            const response = await projectService.getProjectById(projectId);
            
            if (response.statusCode === 200) {
                setProject(response.data);
                
                // Pre-fill the form with project data
                setFormData(prev => ({
                    ...prev,
                    totalAmount: response.data.budget.maxAmount,
                    currency: response.data.budget.currency || 'INR',
                    milestones: [
                        {
                            ...prev.milestones[0],
                            amount: response.data.budget.maxAmount
                        }
                    ]
                }));
            } else {
                throw new Error(response.message || 'Failed to load project details');
            }
        } catch (err) {
            toast.error('Failed to load project details');
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleMilestoneChange = (index, field, value) => {
        const updatedMilestones = [...formData.milestones];
        updatedMilestones[index] = {
            ...updatedMilestones[index],
            [field]: value
        };
        
        setFormData(prev => ({
            ...prev,
            milestones: updatedMilestones
        }));
    };

    const addMilestone = () => {
        setFormData(prev => ({
            ...prev,
            milestones: [
                ...prev.milestones,
                {
                    title: '',
                    description: '',
                    amount: 0,
                    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
                }
            ]
        }));
    };

    const removeMilestone = (index) => {
        if (formData.milestones.length === 1) {
            toast.error('You must have at least one milestone');
            return;
        }
        
        const updatedMilestones = formData.milestones.filter((_, i) => i !== index);
        
        setFormData(prev => ({
            ...prev,
            milestones: updatedMilestones
        }));
    };

    const calculateTotalAmount = () => {
        return formData.milestones.reduce((sum, milestone) => sum + Number(milestone.amount), 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate
        const totalMilestoneAmount = calculateTotalAmount();
        
        if (totalMilestoneAmount <= 0) {
            toast.error('Total amount must be greater than zero');
            return;
        }
        
        for (const milestone of formData.milestones) {
            if (!milestone.title.trim()) {
                toast.error('All milestones must have a title');
                return;
            }
            if (Number(milestone.amount) <= 0) {
                toast.error('All milestones must have an amount greater than zero');
                return;
            }
        }
        
        try {
            setSubmitting(true);
            
            // Update total amount to match sum of milestones
            const escrowData = {
                ...formData,
                totalAmount: totalMilestoneAmount
            };
            
            const response = await escrowService.createEscrow(projectId, escrowData);
            
            if (response.statusCode === 201) {
                toast.success('Escrow created successfully');
                navigate(`/escrows/${response.data._id}`);
            } else {
                throw new Error(response.message || 'Failed to create escrow');
            }
        } catch (err) {
            toast.error(err.message || 'Failed to create escrow');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <FaSpinner className="animate-spin text-3xl text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Create Escrow</h1>
                </div>

                {/* Project Details */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Details</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Project Title</h3>
                            <p className="text-base font-medium text-gray-900">{project?.title || 'Untitled Project'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                            <p className="text-base font-medium text-gray-900">{formData.totalAmount} {formData.currency}</p>
                        </div>
                    </div>
                </div>

                {/* Milestones */}
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Milestones</h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {formData.milestones.map((milestone, index) => (
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
                                        {milestone.amount} {formData.currency}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center justify-between pt-2 border-t border-gray-100">
                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="mr-4">
                                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                                    </span>
                                </div>
                                
                                {/* Action buttons */}
                                <div className="flex gap-2 mt-2 md:mt-0">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeMilestone(index);
                                        }}
                                        className="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                    >
                                        <FaTrash className="mr-1" /> Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Milestone Button */}
                <div className="mt-6">
                    <button 
                        onClick={addMilestone}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        <FaPlus className="mr-2" /> Add Milestone
                    </button>
                </div>

                {/* Submit Button */}
                <div className="mt-6">
                    <button 
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        {submitting ? <FaSpinner className="animate-spin mr-2" /> : null}
                        {submitting ? 'Creating...' : 'Create Escrow'}
                    </button>
                </div>
            </div>
        </div>
    );
} 