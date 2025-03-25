import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bgImage from "../components/Assets/backgroundImage.png"
import { toast } from 'react-toastify';
import BackButton from '../components/BackButton';
export default function UserSignUp() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        userType: 'user',
        contact: '',
        zipcode: '',
        state: '',
        city: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        console.log('Form Data', formData);
        try {
            const response = await axios.post('http://localhost:8000/api/v1/users/register', formData, {
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

    return (
        <>
            <BackButton />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Logo Section */}
                    <div className="px-6 pt-8 pb-6 bg-gradient-to-r from-[#223265] to-[#2a3d7c]">
                        <div className="text-center">
                            <div className="mb-4">
                                <span className="bg-[#FF3D00] px-3 py-1 rounded-l-md text-white">Trade</span>
                                <span className="bg-white px-3 py-1 rounded-r-md text-[#223265]">Connect</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white">Create Account</h2>
                            <p className="mt-2 text-sm text-gray-200">Join our community today</p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="px-6 py-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Info */}
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Full Name"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF3D00] focus:border-transparent transition-all duration-200"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email Address"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF3D00] focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            {/* Contact Info */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                            +91
                                        </span>
                                        <input
                                            type="tel"
                                            name="contact"
                                            value={formData.contact}
                                            onChange={handleInputChange}
                                            placeholder="Phone Number"
                                            className="flex-1 px-4 py-3 rounded-r-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF3D00] focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    name="zipcode"
                                    value={formData.zipcode}
                                    onChange={handleInputChange}
                                    placeholder="Zipcode"
                                    className="w-32 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF3D00] focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            {/* Location */}
                            <div className="flex gap-4">
                                <select
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF3D00] focus:border-transparent transition-all duration-200 bg-white"
                                >
                                    <option value="">Select State</option>
                                    <option value="Maharashtra">Maharashtra</option>
                                    <option value="Karnataka">Karnataka</option>
                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                                    <option value="West Bengal">West Bengal</option>
                                </select>
                                <select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF3D00] focus:border-transparent transition-all duration-200 bg-white"
                                >
                                    <option disabled value="">Select City</option>
                                    <option value="Sambhajinagar">Sambhajinagar</option>
                                    <option value="Solapur">Solapur</option>
                                    <option value="Beed">Beed</option>
                                    <option value="Jalna">Jalna</option>
                                    <option value="Dharashiv">Dharashiv</option>
                                </select>
                            </div>

                            {/* Password Fields */}
                            <div className="space-y-4">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Password"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF3D00] focus:border-transparent transition-all duration-200"
                                />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF3D00] focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-500 text-sm py-2 px-4 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* Terms and Submit */}
                            <div className="space-y-6">
                                <p className="text-xs text-gray-600 text-center">
                                    By signing up you agree to our{' '}
                                    <a href="#" className="text-[#223265] font-semibold hover:underline">Terms of Use</a>
                                    {' '}and{' '}
                                    <a href="#" className="text-[#223265] font-semibold hover:underline">Privacy Policy</a>
                                </p>

                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 bg-gradient-to-r from-[#FF3D00] to-[#FF5F33]
                                text-white rounded-lg hover:from-[#E63600] hover:to-[#FF4719]
                                transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                                shadow-md hover:shadow-lg font-semibold"
                                >
                                    Create Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}