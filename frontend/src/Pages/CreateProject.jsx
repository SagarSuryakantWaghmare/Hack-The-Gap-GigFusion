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
    budget: {
      minAmount: '',
      maxAmount: '',
      currency: 'INR'
    },
    paymentType: 'fixed',
    duration: 'less-than-1-week',
    experienceLevel: 'beginner',
    attachments: [],
    visibility: 'public',
    milestones: []
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
    { id: 'other', name: 'Other' }
  ];

  const experienceLevels = [
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'expert', name: 'Expert' }
  ];

  const durations = [
    { id: 'less-than-1-week', name: 'Less than 1 week' },
    { id: '1-2-weeks', name: '1-2 weeks' },
    { id: '2-4-weeks', name: '2-4 weeks' },
    { id: '1-3-months', name: '1-3 months' },
    { id: '3-6-months', name: '3-6 months' },
    { id: 'more-than-6-months', name: 'More than 6 months' }
  ];

  const commonSkills = [
    'React', 'Node.js', 'JavaScript', 'HTML/CSS', 'Python',
    'Design', 'WordPress', 'UI/UX', 'Copywriting', 'SEO'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('budget.')) {
      const budgetField = name.split('.')[1];
      setProjectData(prev => ({
        ...prev,
        budget: {
          ...prev.budget,
          [budgetField]: value
        }
      }));
    } else {
      setProjectData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSkillToggle = (skill) => {
    setProjectData(prev => {
      const updatedSkills = prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];

      return { ...prev, skills: updatedSkills };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate budget values
      if (Number(projectData.budget.minAmount) > Number(projectData.budget.maxAmount)) {
        toast.error('Minimum budget cannot be greater than maximum budget');
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-stdBlue to-blue-500 p-6 text-white">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-4">
            <FaArrowLeft />
            <span>Back to Projects</span>
          </button>
          <h1 className="text-3xl font-bold">Create a New Project</h1>
          <p className="mt-2 text-gray-50">
            Fill out the form below to post a new project.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Project Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={projectData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stdBlue focus:ring-stdBlue sm:text-sm"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={projectData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stdBlue focus:ring-stdBlue sm:text-sm"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={projectData.category}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stdBlue focus:ring-stdBlue sm:text-sm"
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Skills
            </label>
            <div className="mt-1 flex flex-wrap gap-2">
              {commonSkills.map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-1 rounded-full text-sm ${projectData.skills.includes(skill)
                    ? 'bg-stdBlue text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } transition-colors`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Budget
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                INR
              </span>
              <input
                type="number"
                name="budget.minAmount"
                value={projectData.budget.minAmount}
                onChange={handleInputChange}
                className="flex-1 min-w-0 block w-1/2 px-3 py-2 rounded-none border border-gray-300 focus:border-stdBlue focus:ring-stdBlue sm:text-sm"
                placeholder="Min Amount"
                required
              />
              <input
                type="number"
                name="budget.maxAmount"
                value={projectData.budget.maxAmount}
                onChange={handleInputChange}
                className="flex-1 min-w-0 block w-1/2 px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:border-stdBlue focus:ring-stdBlue sm:text-sm"
                placeholder="Max Amount"
                required
              />
            </div>
          </div>

          {/* Payment Type */}
          <div>
            <label htmlFor="paymentType" className="block text-sm font-medium text-gray-700">
              Payment Type
            </label>
            <select
              id="paymentType"
              name="paymentType"
              value={projectData.paymentType}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stdBlue focus:ring-stdBlue sm:text-sm"
              required
            >
              <option value="fixed">Fixed</option>
              <option value="hourly">Hourly</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration
            </label>
            <select
              id="duration"
              name="duration"
              value={projectData.duration}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stdBlue focus:ring-stdBlue sm:text-sm"
              required
            >
              {durations.map(duration => (
                <option key={duration.id} value={duration.id}>
                  {duration.name}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Level */}
          <div>
            <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">
              Experience Level
            </label>
            <select
              id="experienceLevel"
              name="experienceLevel"
              value={projectData.experienceLevel}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stdBlue focus:ring-stdBlue sm:text-sm"
              required
            >
              {experienceLevels.map(level => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-stdBlue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stdBlue"
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
