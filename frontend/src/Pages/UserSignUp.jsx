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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header Section */}
                    <div className="px-8 pt-10 pb-6 bg-[#223265]">
                        <div className="text-center">
                            <div className="mb-4 flex justify-center">
                                <span className="bg-[#FF3D00] px-4 py-2 rounded-l-lg text-white font-bold text-xl">
                                    Trade
                                </span>
                                <span className="bg-white px-4 py-2 rounded-r-lg text-[#223265] font-bold text-xl">
                                    Connect
                                </span>
                            </div>
                            <h2 className="mt-4 text-3xl font-extrabold text-white">
                                Create Account
                            </h2>
                            <p className="mt-2 text-sm text-gray-200">
                                Join our community of skilled professionals
                            </p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="px-8 pt-8 pb-10 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Info */}
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Full Name"
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                                    focus:border-[#FF3D00] focus:ring-0 placeholder-gray-400
                                    transition-all duration-200"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email Address"
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                                    focus:border-[#FF3D00] focus:ring-0 placeholder-gray-400
                                    transition-all duration-200"
                                />
                            </div>

                            {/* Contact Info */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 rounded-l-lg border-2 
                                        border-r-0 border-gray-200 bg-gray-100 text-gray-500 text-sm">
                                            +91
                                        </span>
                                        <input
                                            type="tel"
                                            name="contact"
                                            value={formData.contact}
                                            onChange={handleInputChange}
                                            placeholder="Phone Number"
                                            className="flex-1 px-4 py-3 rounded-r-lg border-2 border-gray-200 
                                            focus:border-[#FF3D00] focus:ring-0 placeholder-gray-400
                                            transition-all duration-200"
                                        />
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    name="zipcode"
                                    value={formData.zipcode}
                                    onChange={handleInputChange}
                                    placeholder="Zipcode"
                                    className="w-32 px-4 py-3 rounded-lg border-2 border-gray-200 
                                    focus:border-[#FF3D00] focus:ring-0 placeholder-gray-400
                                    transition-all duration-200"
                                />
                            </div>

                            {/* Location */}
                            <div className="flex gap-4">
                                <select
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 
                                    focus:border-[#FF3D00] focus:ring-0 text-gray-700
                                    transition-all duration-200"
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
                                    className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 
                                    focus:border-[#FF3D00] focus:ring-0 text-gray-700
                                    transition-all duration-200"
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
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                                    focus:border-[#FF3D00] focus:ring-0 placeholder-gray-400
                                    transition-all duration-200"
                                />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                                    focus:border-[#FF3D00] focus:ring-0 placeholder-gray-400
                                    transition-all duration-200"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-500 text-sm py-2 px-4 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* Terms and Submit */}
                            <div className="space-y-6">
                                <p className="text-xs text-gray-500 text-center">
                                    By signing up you agree to our{' '}
                                    <a href="#" className="text-[#223265] font-semibold hover:underline">
                                        Terms of Use
                                    </a>{' '}
                                    and{' '}
                                    <a href="#" className="text-[#223265] font-semibold hover:underline">
                                        Privacy Policy
                                    </a>
                                </p>

                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 bg-[#FF3D00] text-white rounded-lg
                                    hover:bg-[#E63600] transform transition-all duration-200 
                                    hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg
                                    font-semibold text-base"
                                >
                                    Create Account
                                </button>
                            </div>
                        </form>

                        {/* Social Login */}
                        <div className="mt-8 space-y-4">
                            <button
                                className="w-full py-2.5 px-4 bg-white border-2 border-gray-200 rounded-lg
                                flex items-center justify-center gap-2 hover:bg-gray-50
                                transition-all duration-200 font-medium text-gray-700"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a5.94 5.94 0 110-11.881c1.594 0 2.694.677 3.493 1.296l2.494-2.458a9.493 9.493 0 10-5.987 16.553c5.523 0 9.311-4.352 9.311-9.314 0-.199-.01-.396-.027-.589H12.545z" fill="#4285F4"/>
                                </svg>
                                Continue with Google
                            </button>
                            <button
                                className="w-full py-2.5 px-4 bg-white border-2 border-gray-200 rounded-lg
                                flex items-center justify-center gap-2 hover:bg-gray-50
                                transition-all duration-200 font-medium text-gray-700"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" fill="#000000"/>
                                </svg>
                                Continue with Apple
                            </button>
                        </div>

                        {/* Login Link */}
                        <p className="text-center text-gray-600 text-sm">
                            Already have an account?{' '}
                            <a href="/login" className="text-[#223265] font-semibold hover:underline">
                                Log In
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}