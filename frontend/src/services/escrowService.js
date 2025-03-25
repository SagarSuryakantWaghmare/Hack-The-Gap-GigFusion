import API from './api';

const escrowService = {
  // Create an escrow for a project
  createEscrow: async (projectId, escrowData) => {
    const response = await API.post(`/projects/${projectId}/escrow`, escrowData);
    return response.data;
  },

  // Get escrow details by project ID
  getEscrowByProject: async (projectId) => {
    const response = await API.get(`/projects/${projectId}/escrow`);
    return response.data;
  },

  // Get escrow by ID
  getEscrowById: async (escrowId) => {
    const response = await API.get(`/escrows/${escrowId}`);
    return response.data;
  },

  // Get all escrows for the authenticated user
  getUserEscrows: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await API.get(`/escrows${queryParams ? `?${queryParams}` : ''}`);
    return response.data;
  },

  // Fund a milestone
  fundMilestone: async (escrowId, milestoneId) => {
    const response = await API.post(`/escrows/${escrowId}/milestones/${milestoneId}/fund`);
    return response.data;
  },

  // Release a milestone
  releaseMilestone: async (escrowId, milestoneId) => {
    const response = await API.post(`/escrows/${escrowId}/milestones/${milestoneId}/release`);
    return response.data;
  },

  // Raise a dispute
  raiseDispute: async (escrowId, reason) => {
    const response = await API.post(`/escrows/${escrowId}/dispute`, { reason });
    return response.data;
  }
};

export default escrowService;
