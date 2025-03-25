import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner, FaExclamationTriangle, FaCheckCircle, FaMoneyBillWave, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import escrowService from '../services/escrowService';

export default function EscrowList() {
    const navigate = useNavigate();
    const [escrows, setEscrows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const [filters, setFilters] = useState({
        status: '',
        role: user?.userType === 'serviceProvider' ? 'freelancer' : 'client'
    });

    useEffect(() => {
        fetchEscrows();
    }, [filters]);

    const fetchEscrows = async () => {
        try {
            setLoading(true);
            const response = await escrowService.getUserEscrows(filters);
            
            if (response.statusCode === 200) {
                setEscrows(response.data.escrows);
            } else {
                throw new Error(response.message || 'Failed to load escrows');
            }
        } catch (err) {
            toast.error('Failed to load escrows');
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Status filters
    const statusOptions = [
        { value: '', label: 'All Statuses' },
        { value: 'pending', label: 'Pending' },
        { value: 'funded', label: 'Funded' },
        { value: 'partially-released', label: 'Partially Released' },
        { value: 'released', label: 'Released' },
        { value: 'disputed', label: 'Disputed' }
    ];

    // Format currency
    const formatCurrency = (amount, currency = 'INR') => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Get status badge styling
    const getStatusBadge = (status) => {
        switch(status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'funded':
                return 'bg-blue-100 text-blue-800';
            case 'partially-released':
                return 'bg-indigo-100 text-indigo-800';
            case 'released':
                return 'bg-green-100 text-green-800';
            case 'disputed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Calculate progress percentage
    const calculateProgress = (escrow) => {
        if (!escrow.milestones || escrow.milestones.length === 0) return 0;
        
        const releasedMilestones = escrow.milestones.filter(m => m.status === 'released');
        return Math.round((releasedMilestones.length / escrow.milestones.length) * 100);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Escrows</h1>
                    <p className="text-gray-600">Manage your project payments securely</p>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <div className="flex flex-wrap gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select 
                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filters.status}
                                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">View As</label>
                            <select 
                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filters.role}
                                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                            >
                                <option value="client">Client</option>
                                <option value="freelancer">Freelancer</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Escrow List */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <FaSpinner className="animate-spin text-3xl text-blue-600" />
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                        {error}
                    </div>
                ) : escrows.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow">
                        <div className="text-6xl mb-4">💰</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Escrows Found</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            You don't have any payment escrows yet. Escrows are created when a project starts.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {escrows.map((escrow) => (
                            <div 
                                key={escrow._id} 
                                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => navigate(`/escrows/${escrow._id}`)}
                            >
                                <div className="p-4">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                                        {/* Project & Client/Freelancer info */}
                                        <div>
                                            <h2 className="text-lg font-medium text-gray-900">{escrow.project?.title || 'Untitled Project'}</h2>
                                            <div className="mt-1 flex items-center text-sm text-gray-600">
                                                {filters.role === 'freelancer' ? (
                                                    <>Client: {escrow.client?.fullName}</>
                                                ) : (
                                                    <>Freelancer: {escrow.freelancer?.fullName}</>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Status & Amount */}
                                        <div className="mt-3 md:mt-0 flex flex-col md:items-end">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${getStatusBadge(escrow.status)}`}>
                                                {escrow.status.charAt(0).toUpperCase() + escrow.status.slice(1)}
                                            </span>
                                            <div className="mt-1 text-lg font-semibold text-gray-900">
                                                {formatCurrency(escrow.totalAmount, escrow.currency)}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Progress bar */}
                                    <div className="mt-3">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span>Completion Progress</span>
                                            <span>{calculateProgress(escrow)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-blue-600 h-2 rounded-full" 
                                                style={{ width: `${calculateProgress(escrow)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    
                                    {/* Quick info */}
                                    <div className="mt-3 flex flex-wrap gap-3 text-xs">
                                        <span className="text-gray-600">
                                            Created: {new Date(escrow.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="text-gray-600">
                                            Milestones: {escrow.milestones?.length || 0}
                                        </span>
                                        {escrow.status === 'disputed' && (
                                            <span className="text-red-600 flex items-center">
                                                <FaExclamationTriangle className="mr-1" /> Dispute active
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 