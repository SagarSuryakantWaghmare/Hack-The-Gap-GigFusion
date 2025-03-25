import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';

const CreateProject = () => {
  const navigate = useNavigate();

  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    category: '',
    skills: [],
    budget: { minAmount: '', maxAmount: '', currency: 'INR' },
    paymentType: 'fixed',
    duration: 'less-than-1-week',
    experienceLevel: 'beginner',
    attachments: [],
    visibility: 'public',
    milestones: [],
  });

  const categories = [
    { id: 'web-development', name: 'Website Development' },
    { id: 'mobile-development', name: 'Mobile App Development' },
    { id: 'ui-ux-design', name: 'UI/UX Design' },
    { id: 'graphic-design', name: 'Graphic Design' },
    { id: 'content-writing', name: 'Content Writing' },
    { id: 'video-editing', name: 'Video Editing' },
    { id: 'audio-editing', name: 'Audio Editing' },
    { id: 'data-entry', name: 'Data Entry' },
    { id: 'virtual-assistant', name: 'Virtual Assistant' },
    { id: 'other', name: 'Other' },
  ];

  const experienceLevels = [
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'expert', name: 'Expert' },
  ];

  const durations = [
    { id: 'less-than-1-week', name: 'Less than 1 week' },
    { id: '1-2-weeks', name: '1-2 weeks' },
    { id: '2-4-weeks', name: '2-4 weeks' },
    { id: '1-3-months', name: '1-3 months' },
    { id: '3-6-months', name: '3-6 months' },
    { id: 'more-than-6-months', name: 'More than 6 months' },
  ];

  const commonSkills = [
    'React', 'Node.js', 'JavaScript', 'HTML/CSS', 'Python',
    'Design', 'WordPress', 'UI/UX', 'Copywriting', 'SEO',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('budget.')) {
      const budgetField = name.split('.')[1];
      setProjectData((prev) => ({
        ...prev,
        budget: { ...prev.budget, [budgetField]: value },
      }));
    } else {
      setProjectData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSkillToggle = (skill) => {
    setProjectData((prev) => {
      const updatedSkills = prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills: updatedSkills };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (Number(projectData.budget.minAmount) > Number(projectData.budget.maxAmount)) {
        toast.error('Minimum budget cannot exceed maximum budget');
        return;
      }
      const response = await projectService.createProject(projectData);
      if (response.statusCode === 201) {
        toast.success('Project created successfully!');
        navigate('/projects');
      } else {
        toast.error(response.message || 'Failed to create project');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors mb-4"
          >
            <FaArrowLeft />
            <span className="text-sm font-medium">Back to Projects</span>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Create New Project</h1>
          <p className="mt-1 text-sm text-gray-100 opacity-90">
            Provide details to attract the right talent for your project.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {/* Title */}
          <div className="space-y-1">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-800">
              Project Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={projectData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., Build a Responsive Website"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-800">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={projectData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y"
              placeholder="Describe your project in detail..."
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label htmlFor="category" className="block text-sm font-semibold text-gray-800">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={projectData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">Skills Required</label>
            <div className="flex flex-wrap gap-2">
              {commonSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    projectData.skills.includes(skill)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-800">Budget (INR)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="number"
                name="budget.minAmount"
                value={projectData.budget.minAmount}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Min Amount"
                required
              />
              <input
                type="number"
                name="budget.maxAmount"
                value={projectData.budget.maxAmount}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Max Amount"
                required
              />
            </div>
          </div>

          {/* Payment Type */}
          <div className="space-y-1">
            <label htmlFor="paymentType" className="block text-sm font-semibold text-gray-800">
              Payment Type
            </label>
            <select
              id="paymentType"
              name="paymentType"
              value={projectData.paymentType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              required
            >
              <option value="fixed">Fixed Price</option>
              <option value="hourly">Hourly Rate</option>
            </select>
          </div>

          {/* Duration */}
          <div className="space-y-1">
            <label htmlFor="duration" className="block text-sm font-semibold text-gray-800">
              Project Duration
            </label>
            <select
              id="duration"
              name="duration"
              value={projectData.duration}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              required
            >
              {durations.map((duration) => (
                <option key={duration.id} value={duration.id}>
                  {duration.name}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Level */}
          <div className="space-y-1">
            <label htmlFor="experienceLevel" className="block text-sm font-semibold text-gray-800">
              Experience Level
            </label>
            <select
              id="experienceLevel"
              name="experienceLevel"
              value={projectData.experienceLevel}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              required
            >
              {experienceLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;