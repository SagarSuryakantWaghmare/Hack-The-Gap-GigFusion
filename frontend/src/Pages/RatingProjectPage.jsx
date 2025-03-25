import { FiMessageCircle, FiZap, FiHome, FiMail, FiMapPin, FiUser } from 'react-icons/fi';
import axios from "axios";

export default function RatingProjectPage() {
  const sendMail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/users/sendMail',
        {
          email: e.target[0].value,
          zipCode: e.target[1].value,
          name: e.target[2].value
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log(response.data);
      alert('Thank you! Information sent successfully.');
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    }
  }

  const steps = [
    {
      icon: <FiMessageCircle size={32} />,
      title: "1. Tell us what your home needs",
      description: "From routine maintenance and repairs to dream home renovations, we can help with any project big or small.",
      bgColor: "bg-color1/20",
      iconColor: "text-color1"
    },
    {
      icon: <FiZap size={32} />,
      title: "2. We'll match you with personalized solutions",
      description: "See your price and book services in an instant. Or, request and compare quotes from highly rated pros near you.",
      bgColor: "bg-stdBlue/20",
      iconColor: "text-stdBlue"
    },
    {
      icon: <FiHome size={32} />,
      title: "3. Start to finish, we've got you covered",
      description: "When you book and pay with SewaSetu, you're covered by our Happiness Guarantee. We'll cover your projects up to full purchase price, plus limited damage protection.",
      bgColor: "bg-color1/20",
      iconColor: "text-color1"
    }
  ];

  return (
    <div className="w-full py-8 md:py-16 px-4 md:px-8">
      <div className='flex items-center flex-col text-center'>
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl gap-6 md:gap-12 mb-10">
          <div className='text-center md:text-left md:flex-1'>
            <h1 className="text-2xl md:text-4xl font-bold text-stdBlue leading-tight">
              Get free project
              <span className="text-color1 block md:inline"> cost information </span>
              delivered to your inbox
            </h1>
          </div>

          <div className="w-full md:w-auto md:flex-1">
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl md:text-2xl text-stdBlue font-bold mb-6 relative inline-flex items-center gap-2">
                <FiMail className="text-color1" />
                <span>Receive mail</span>
              </h2>

              <form onSubmit={sendMail} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      className="w-full h-12 rounded-lg pl-10 pr-4 text-base border border-gray-300 focus:border-color1 focus:ring-2 focus:ring-color1/20 outline-none transition-all duration-200"
                      type="email"
                      placeholder="Email Address"
                      required
                    />
                  </div>
                  <div className="flex gap-3 sm:w-auto">
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        className="w-full sm:w-32 h-12 rounded-lg pl-10 pr-4 text-base border border-gray-300 focus:border-color1 focus:ring-2 focus:ring-color1/20 outline-none transition-all duration-200"
                        type="text"
                        placeholder="Zip Code"
                        required
                      />
                    </div>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        className="w-full sm:w-32 h-12 rounded-lg pl-10 pr-4 text-base border border-gray-300 focus:border-color1 focus:ring-2 focus:ring-color1/20 outline-none transition-all duration-200"
                        type="text"
                        placeholder="Name"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center sm:justify-start">
                  <button 
                    type="submit"
                    className="bg-stdBlue text-white px-8 py-3 rounded-full font-bold hover:bg-color1 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <FiMail />
                    <span>Submit</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-stdBlue text-center mb-12 relative">
            <span className="relative inline-block group">
              How it works
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-color1 to-stdBlue transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className={`absolute inset-0 ${step.bgColor} rounded-full animate-pulse group-hover:scale-110 transition-transform duration-300`}></div>
                  <div className={`relative z-10 w-full h-full flex items-center justify-center ${step.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                    {step.icon}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-stdBlue group-hover:text-color1 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}