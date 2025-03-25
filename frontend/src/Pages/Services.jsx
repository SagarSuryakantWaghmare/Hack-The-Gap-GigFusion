import { useNavigate } from 'react-router-dom';
import { 
    FiTool, FiTruck, FiZap, FiWind, 
    FiDroplet, FiPackage, FiSearch, FiChevronRight, FiX 
} from 'react-icons/fi';
import { useState } from 'react';
import serviceback from "../components/Assets/serviceback.png";
import BackButton from '../components/BackButton';
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideIn {
        from { 
            opacity: 0;
            transform: scale(0.95) translateY(20px);
        }
        to { 
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }

    @keyframes slideInFromLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideInFromRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideInFromBottom {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
    }

    .animate-slideIn {
        animation: slideIn 0.4s ease-out;
    }

    .animate-slideInFromLeft {
        animation: slideInFromLeft 0.5s ease-out;
    }

    .animate-slideInFromRight {
        animation: slideInFromRight 0.5s ease-out;
    }

    .animate-slideInFromBottom {
        animation: slideInFromBottom 0.5s ease-out;
    }
`;
document.head.appendChild(style);

export default function Services() {
    const navigate = useNavigate();
    const [selectedService, setSelectedService] = useState(null);

    const mainServices = [
        {
            title: "Home Repairs",
            icon: <FiTool className="text-color1" size={32} />,
            description: "Professional home repair and maintenance services",
            bgImage: "bg-gradient-to-br from-blue-50 to-blue-100"
        },
        {
            title: "Moving",
            icon: <FiTruck className="text-stdBlue" size={32} />,
            description: "Reliable moving and relocation services",
            bgImage: "bg-gradient-to-br from-orange-50 to-orange-100"
        },
        {
            title: "Electrical",
            icon: <FiZap className="text-color1" size={32} />,
            description: "Expert electrical installation and repairs",
            bgImage: "bg-gradient-to-br from-yellow-50 to-yellow-100"
        },
        {
            title: "Cleaning",
            icon: <FiWind className="text-stdBlue" size={32} />,
            description: "Professional cleaning services for your home",
            bgImage: "bg-gradient-to-br from-green-50 to-green-100"
        },
        {
            title: "Painting",
            icon: <FiPackage className="text-color1" size={32} />,
            description: "Quality painting services for interior and exterior",
            bgImage: "bg-gradient-to-br from-purple-50 to-purple-100"
        },
        {
            title: "Plumbing",
            icon: <FiDroplet className="text-stdBlue" size={32} />,
            description: "Expert plumbing installation and repairs",
            bgImage: "bg-gradient-to-br from-red-50 to-red-100"
        }
    ];

    const serviceDetails = {
        "Home Repairs": [
            "Door and Window Repairs",
            "Furniture Assembly and Repair",
            "Drywall Repair and Installation",
            "Cabinet Installation and Repair",
            "Floor Repair and Installation",
            "General Carpentry Work",
            "Deck and Fence Repair",
            "Garage Door Repair"
        ],
        "Moving": [
            "Local Moving Services",
            "Furniture Moving and Rearrangement",
            "Packing and Unpacking",
            "Loading and Unloading",
            "Appliance Moving",
            "Storage Solutions",
            "Safe Moving of Fragile Items",
            "Disassembly and Assembly of Furniture"
        ],
        "Electrical": [
            "Electrical Repairs",
            "Light Fixture Installation",
            "Outlet and Switch Installation",
            "Ceiling Fan Installation",
            "Electrical Panel Upgrades",
            "Wiring and Rewiring",
            "Smart Home Device Installation",
            "Emergency Electrical Services"
        ],
        "Cleaning": [
            "Deep House Cleaning",
            "Regular Maintenance Cleaning",
            "Move-in/Move-out Cleaning",
            "Carpet and Upholstery Cleaning",
            "Window and Glass Cleaning",
            "Post-Construction Cleaning",
            "Sanitization Services",
            "Office Cleaning"
        ],
        "Painting": [
            "Interior Wall Painting",
            "Exterior House Painting",
            "Cabinet and Furniture Painting",
            "Deck and Fence Staining",
            "Wallpaper Installation",
            "Texture and Specialty Finishes",
            "Color Consultation",
            "Paint Touch-ups"
        ],
        "Plumbing": [
            "Leak Detection and Repair",
            "Pipe Installation and Repair",
            "Fixture Installation",
            "Drain Cleaning",
            "Water Heater Services",
            "Toilet Repair and Installation",
            "Faucet Repair and Installation",
            "Emergency Plumbing Services"
        ]
    };

    const handleServiceClick = (title) => {
        setSelectedService(title);
    };

    const closeModal = () => {
        setSelectedService(null);
    };

    const handleBookNow = () => {
        navigate('/login');
    };

    return (
        <>
        <div className="min-h-screen bg-gray-50">
        <BackButton />
            {/* Hero Section */}
            <div className="relative h-[300px] md:h-[480px] overflow-hidden">
                <img 
                    src={serviceback} 
                    alt="Services Background" 
                    className="w-full h-full object-cover brightness-50"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center">
                        Professional Home Services
                    </h1>
                    <p className="text-xl md:text-2xl text-center max-w-2xl">
                        Expert solutions for all your home service needs
                    </p>
                    <div className="mt-8 flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/login')}
                            className="px-8 py-3 bg-color1 text-white rounded-full 
                                     hover:bg-color1/90 transform hover:scale-105 
                                     transition-all duration-300 shadow-lg
                                     flex items-center gap-2"
                        >
                            <FiSearch size={20} />
                            Find Services
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Services Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-2xl md:text-4xl font-bold text-center text-stdBlue mb-12">
                    Our Services
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mainServices.map((service, index) => (
                        <div
                            key={index}
                            onClick={() => handleServiceClick(service.title)}
                            className={`${service.bgImage} rounded-2xl p-6 shadow-lg hover:shadow-xl 
                                      transform hover:-translate-y-1 transition-all duration-300 
                                      cursor-pointer group`}
                        >
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="p-4 rounded-full bg-white shadow-md 
                                            group-hover:scale-110 transition-transform duration-300">
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold text-stdBlue">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600">
                                    {service.description}
                                </p>
                                <span className="inline-flex items-center text-color1 font-semibold">
                                    Book Now
                                    <FiChevronRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Service Details Modal */}
                {selectedService && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 
                                   animate-fadeIn"
                        onClick={closeModal}
                    >
                        <div 
                            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative 
                                       transform transition-all duration-300 animate-slideIn"
                            onClick={e => e.stopPropagation()}
                        >
                            <button 
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 
                                         transition-colors hover:rotate-90 transform duration-300"
                            >
                                <FiX size={24} />
                            </button>
                            
                            <div className="p-6 md:p-8">
                                <div className="flex items-center gap-4 mb-6 animate-slideInFromLeft">
                                    <div className={`p-3 rounded-full ${
                                        mainServices.find(s => s.title === selectedService)?.bgImage
                                    } transform hover:scale-110 transition-transform duration-300`}>
                                        {mainServices.find(s => s.title === selectedService)?.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-stdBlue">
                                        {selectedService}
                                    </h3>
                                </div>

                                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4 animate-slideInFromRight">
                                    <h4 className="text-lg font-semibold text-gray-700">
                                        Services Offered:
                                    </h4>
                                    <ul className="space-y-3">
                                        {serviceDetails[selectedService].map((task, index) => (
                                            <li 
                                                key={index}
                                                className="flex items-start gap-3 text-gray-600 transform transition-all duration-300
                                                         hover:translate-x-2 hover:text-stdBlue"
                                                style={{
                                                    animationDelay: `${index * 100}ms`,
                                                    animation: 'slideInFromBottom 0.5s ease forwards'
                                                }}
                                            >
                                                <div className="min-w-[8px] h-[8px] rounded-full bg-color1 mt-2 
                                                      transform transition-all duration-300 
                                                      group-hover:scale-150"></div>
                                                {task}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-8 flex justify-end animate-slideInFromBottom">
                                    <button
                                        onClick={handleBookNow}
                                        className="bg-color1 text-white px-6 py-2.5 rounded-full
                                                 hover:bg-color1/90 transform hover:scale-105 
                                                 transition-all duration-300 shadow-md hover:shadow-xl
                                                 flex items-center gap-2"
                                    >
                                        Book Now
                                        <FiChevronRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Trust Indicators */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {[
                        { icon: <FiTool size={32} />, text: "Expert Professionals" },
                        { icon: <FiSearch size={32} />, text: "Easy Booking" },
                        { icon: <FiPackage size={32} />, text: "Quality Service" },
                        { icon: <FiTruck size={32} />, text: "Timely Delivery" }
                    ].map((item, index) => (
                        <div key={index} className="flex flex-col items-center gap-3 p-4">
                            <div className="text-color1">
                                {item.icon}
                            </div>
                            <span className="font-semibold text-stdBlue">
                                {item.text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
    );
}