import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import bgImage from '../components/Assets/backgroundImage.png';
import BackButton from '../components/BackButton';
import { motion } from "framer-motion";
import TagsInput from 'react-tagsinput';
import Autosuggest from 'react-autosuggest';
import 'react-tagsinput/react-tagsinput.css'; 
import './Autosuggest.css';
export default function WorkerSignUp() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        businessName: '',
        password: '',
        confirmPassword: '',
        userType: 'serviceProvider',
        contact: '',
        zipcode: '',
        state: '',
        city: '',
        serviceCategory: [] // Now an array to store multiple skills/services
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // State for autosuggest
    const [suggestions, setSuggestions] = useState([]);
    const [currentInput, setCurrentInput] = useState('');

    // Predefined list of possible skills/services for recommendations
    const availableSkills = [
        'Web Development',
        'Web Development UI/UX Designer',
        'Web Development Frontend',
        'Web Development Backend',
        'Mobile App Development',
        'Mobile App Development iOS',
        'Mobile App Development Android',
        'Graphic Design',
        'Graphic Design UI',
        'Graphic Design Branding',
        'Digital Marketing',
        'Digital Marketing Social Media',
        'Digital Marketing Email Campaigns',
        'Content Writing & Copywriting',
        'Content Writing Blogging',
        'Content Writing SEO',
        'SEO & Website Optimization',
        'SEO & Website Optimization Technical SEO',
        'SEO & Website Optimization Content SEO'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle changes to the tags (skills/services)
    const handleTagsChange = (tags) => {
        setFormData({ ...formData, serviceCategory: tags });
        setCurrentInput(''); // Clear the input after adding a tag
    };

    // Autosuggest: Get suggestions based on user input
    const getSuggestions = (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0
            ? []
            : availableSkills.filter(skill =>
                skill.toLowerCase().includes(inputValue)
            );
    };

    // Autosuggest: When a suggestion is selected
    const onSuggestionSelected = (event, { suggestion }) => {
        const updatedTags = [...formData.serviceCategory, suggestion];
        setFormData({ ...formData, serviceCategory: updatedTags });
        setCurrentInput(''); // Clear the input after selecting a suggestion
    };

    // Autosuggest: Update suggestions as the user types
    const onSuggestionsFetchRequested = ({ value }) => {
        setSuggestions(getSuggestions(value));
    };

    // Autosuggest: Clear suggestions when input is cleared
    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    // Autosuggest: Render each suggestion
    const renderSuggestion = (suggestion) => (
        <div className="p-2 hover:bg-gray-100 cursor-pointer">
            {suggestion}
        </div>
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Ensure at least one skill/service is added
        if (formData.serviceCategory.length === 0) {
            setError('Please add at least one skill or service');
            return;
        }

        try {
            const response = await axios.post('/api/v1/users/register', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {
                toast.success('Registration successful. Please login to continue');
                navigate('/login');
            } else {
                toast.error('Registration failed');
                setError(response.data.message || 'Registration failed');
            }
        } catch (error) {
            toast.error('Registration failed');
            setError(error.response?.data?.message || 'Registration failed');
        }
    };

    // Autosuggest input props
    const inputProps = {
        placeholder: 'e.g., Web Development',
        value: currentInput,
        onChange: (e, { newValue }) => setCurrentInput(newValue),
        className: 'h-10 w-full rounded-lg px-3 outline-none border-2 border-gray-200 focus:border-stdBlue text-sm'
    };

    return (
        <div className="min-h-screen font-stdFont bg-gray-50">
            <div className="absolute top-4 left-4 z-20">
                <BackButton />
            </div>
            
            <div className="flex items-center justify-center min-h-screen py-6 px-4 sm:px-6 lg:px-8 relative">
                {/* Background with overlay instead of blur */}
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-10"
                    style={{ backgroundImage: `url(${bgImage})` }}
                />
                
                {/* Main container - wider for desktop */}
                <div className="relative z-10 w-full max-w-4xl">
                    <div className="bg-white shadow-xl rounded-2xl px-6 py-6">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <motion.h1
                                className="text-3xl font-bold text-stdBlue relative inline-block"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            >
                                Join{" "}
                                <span className="text-color1 animate-gradient bg-gradient-to-r from-color1 via-stdBlue to-color1 bg-clip-text text-transparent">
                                    Gig-Fusion
                                </span>
                            </motion.h1>
                            <motion.p
                                className="text-stdBlue font-semibold mt-1"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                Register as a Gig expert
                            </motion.p>
                        </div>
                        
                        {/* Registration Form */}
                        <form onSubmit={handleSubmit}>
                            {/* Desktop two-column layout */}
                            <div className="flex flex-col md:flex-row md:space-x-8">
                                {/* Left column */}
                                <div className="md:w-1/2 space-y-4">
                                    {/* Personal Information */}
                                    <div>
                                        <h2 className="text-lg font-semibold text-stdBlue border-b border-gray-200 pb-1 mb-3">Personal Information</h2>
                                        
                                        <div className="space-y-3">
                                            <div>
                                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                                <input
                                                    id="fullName"
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                    placeholder="Your full name"
                                                    className="h-10 w-full rounded-lg px-3 outline-none border-2 border-gray-200 focus:border-stdBlue text-sm"
                                                    required
                                                />
                                            </div>
                                            
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="your@email.com"
                                                    className="h-10 w-full rounded-lg px-3 outline-none border-2 border-gray-200 focus:border-stdBlue text-sm"
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                                    <input
                                                        id="contact"
                                                        type="tel"
                                                        name="contact"
                                                        value={formData.contact}
                                                        onChange={handleInputChange}
                                                        placeholder="Your phone"
                                                        className="h-10 w-full rounded-lg px-3 outline-none border-2 border-gray-200 focus:border-stdBlue text-sm"
                                                        required
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-1">Zipcode</label>
                                                    <input
                                                        id="zipcode"
                                                        type="text"
                                                        name="zipcode"
                                                        value={formData.zipcode}
                                                        onChange={handleInputChange}
                                                        placeholder="Zipcode"
                                                        className="h-10 w-full rounded-lg px-3 outline-none border-2 border-gray-200 focus:border-stdBlue text-sm"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Business Information */}
                                    <div>
                                        <h2 className="text-lg font-semibold text-stdBlue border-b border-gray-200 pb-1 mb-3">Business Information</h2>
                                        
                                        <div className="space-y-3">
                                            <div>
                                                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                                                <input
                                                    id="businessName"
                                                    type="text"
                                                    name="businessName"
                                                    value={formData.businessName}
                                                    onChange={handleInputChange}
                                                    placeholder="Your business name"
                                                    className="h-10 w-full rounded-lg px-3 outline-none border-2 border-gray-200 focus:border-stdBlue text-sm"
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                                    <select
                                                        id="state"
                                                        name="state"
                                                        value={formData.state}
                                                        onChange={handleInputChange}
                                                        className="h-10 w-full rounded-lg px-3 text-sm border-2 border-gray-200 outline-none focus:border-stdBlue"
                                                        required
                                                    >
                                                        <option value="" disabled>Select State</option>
                                                        <option value="Maharashtra">Maharashtra</option>
                                                        <option value="Karnataka">Karnataka</option>
                                                        <option value="Tamil Nadu">Tamil Nadu</option>
                                                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                                                        <option value="West Bengal">West Bengal</option>
                                                    </select>
                                                </div>
                                                
                                                <div>
                                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                                    <select
                                                        id="city"
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleInputChange}
                                                        className="h-10 w-full rounded-lg px-3 text-sm border-2 border-gray-200 outline-none focus:border-stdBlue"
                                                        required
                                                    >
                                                        <option value="" disabled>Select City</option>
                                                        <option value="Sambhajinagar">Sambhajinagar</option>
                                                        <option value="Solapur">Solapur</option>
                                                        <option value="Beed">Beed</option>
                                                        <option value="Jalna">Jalna</option>
                                                        <option value="Dharashiv">Dharashiv</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Account Security */}
                                    <div>
                                        <h2 className="text-lg font-semibold text-stdBlue border-b border-gray-200 pb-1 mb-3">Create Password</h2>
                                        
                                        <div className="space-y-3">
                                            <div>
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                                <input
                                                    id="password"
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    placeholder="Create a secure password"
                                                    className="h-10 w-full rounded-lg px-3 outline-none border-2 border-gray-200 focus:border-stdBlue text-sm"
                                                    required
                                                />
                                            </div>
                                            
                                            <div>
                                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                                <input
                                                    id="confirmPassword"
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleInputChange}
                                                    placeholder="Confirm your password"
                                                    className="h-10 w-full rounded-lg px-3 outline-none border-2 border-gray-200 focus:border-stdBlue text-sm"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Right column */}
                                <div className="md:w-1/2 mt-4 md:mt-0">
                                    {/* Service Category Section */}
                                    <div>
                                        <h2 className="text-lg font-semibold text-stdBlue border-b border-gray-200 pb-1 mb-3">Skills & Services</h2>
                                        
                                        <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                            <p className="text-sm text-gray-700 mb-3">Add the skills or services you offer:</p>
                                            
                                            <div className="space-y-3">
                                                {/* Tags Input for Skills/Services */}
                                                <TagsInput
                                                    value={formData.serviceCategory}
                                                    onChange={handleTagsChange}
                                                    inputProps={{
                                                        placeholder: 'Add a skill (e.g., Web Development)',
                                                        className: 'h-10 w-full rounded-lg px-3 outline-none border-2 border-gray-200 focus:border-stdBlue text-sm'
                                                    }}
                                                    renderInput={(props) => (
                                                        <Autosuggest
                                                            suggestions={suggestions}
                                                            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                                            onSuggestionsClearRequested={onSuggestionsClearRequested}
                                                            getSuggestionValue={(suggestion) => suggestion}
                                                            renderSuggestion={renderSuggestion}
                                                            onSuggestionSelected={onSuggestionSelected}
                                                            inputProps={{
                                                                ...props,
                                                                placeholder: 'Add a skill (e.g., Web Development)',
                                                                className: 'h-10 w-full rounded-lg px-3 outline-none border-2 border-gray-200 focus:border-stdBlue text-sm'
                                                            }}
                                                        />
                                                    )}
                                                    className="react-tagsinput"
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Company Benefits */}
                                        <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-4 mb-4">
                                            <h3 className="font-medium text-stdBlue mb-2">Why Join Gig-Fusion?</h3>
                                            <ul className="space-y-2 text-sm">
                                                <li className="flex items-start">
                                                    <span className="text-color1 mr-2">✓</span>
                                                    <span> Get Hired – Connect with clients easily.</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="text-color1 mr-2">✓</span>
                                                    <span>Work on Your Terms – Set your own schedule</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="text-color1 mr-2">✓</span>
                                                    <span>Build your business reputation with client reviews</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="text-color1 mr-2">✓</span>
                                                    <span>No subscription fees - pay only for leads you accept</span>
                                                </li>
                                            </ul>
                                        </div>
                                        
                                        {/* Error message */}
                                        {error && (
                                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                                                {error}
                                            </div>
                                        )}
                                        
                                        {/* Terms and Register Button */}
                                        <div className="space-y-4">
                                            <div className="text-center">
                                                <p className="text-xs text-gray-600">
                                                    By signing up you agree to our <span className="font-bold text-stdBlue cursor-pointer">Terms of Use</span> and <span className="font-bold text-stdBlue cursor-pointer">Privacy Policy.</span>
                                                </p>
                                            </div>
                                            
                                            <button
                                                type="submit"
                                                className="w-full h-11 rounded-full font-bold text-white bg-gradient-to-r from-color1 to-stdBlue shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 relative overflow-hidden"
                                            >
                                                <span className="absolute inset-0 bg-white opacity-10 transition-opacity duration-300 group-hover:opacity-20"></span>
                                                <span className="relative z-10">Register as Gig Expert</span>
                                            </button>
                                            
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600">
                                                    Already have an account? <span onClick={() => navigate('/login')} className="font-semibold text-stdBlue cursor-pointer">Login</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}