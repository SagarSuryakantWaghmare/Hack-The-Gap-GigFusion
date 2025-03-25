import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { question: "What services do you offer?", answer: "We provide web development, mobile app development, AI solutions, and UI/UX design services." },
  { question: "How can I get a quote for my project?", answer: "Simply contact us through our website, and we’ll get back to you with a custom quote within 24 hours." },
  { question: "Do you offer support after project completion?", answer: "Yes, we provide 30 days of free support after project delivery. Extended support is also available upon request." },
  { question: "What technologies do you specialize in?", answer: "We specialize in React, Node.js, Python, AWS, and modern frontend and backend frameworks." },
  { question: "Can I hire a developer on a monthly basis?", answer: "Yes, we offer dedicated developers for long-term projects on a contract basis." },
  { question: "How long does it take to complete a project?", answer: "The timeline depends on the complexity of the project. Small projects take 2-4 weeks, while larger ones may take a few months." },
  { question: "Do you work with startups?", answer: "Absolutely! We love working with startups and help them build scalable digital solutions." },
  { question: "Is my project idea confidential?", answer: "Yes, we sign NDAs before discussing any project details to ensure confidentiality." },
  { question: "What payment methods do you accept?", answer: "We accept bank transfers, PayPal, Stripe, and major credit cards." },
  { question: "Can I request changes after project completion?", answer: "Yes, we offer a revision period after project completion to ensure your satisfaction." },
];

export default function FandQOnfrontPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-6">
      <h2 className="text-4xl font-bold text-center text-stdBlue mb-8">Frequently Asked Questions</h2>

      {/* Grid Layout for Left & Right Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
        
        {/* Left Column */}
        <div className="space-y-4 flex flex-col items-center">
          {faqs.slice(0, 5).map((faq, index) => (
            <div key={index} className="w-[550px] bg-white shadow-md rounded-lg p-4 transition-all duration-300">
              <button
                className="w-full flex justify-between items-center text-md font-medium text-left text-gray-800 hover:bg-blue-100 p-2 transition-all duration-200"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <ChevronDown className={`transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
              </button>
              {/* Dynamic Height Based on Content */}
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}`}>
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-4 flex flex-col items-center">
          {faqs.slice(5, 10).map((faq, index) => (
            <div key={index + 5} className="w-[550px] bg-white shadow-md rounded-lg p-4 transition-all duration-300">
              <button
                className="w-full flex justify-between items-center text-md font-medium text-left text-gray-800 hover:bg-blue-100 p-2 transition-all duration-200"
                onClick={() => toggleFAQ(index + 5)}
              >
                {faq.question}
                <ChevronDown className={`transition-transform ${openIndex === index + 5 ? "rotate-180" : ""}`} />
              </button>
              {/* Dynamic Height Based on Content */}
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === index + 5 ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}`}>
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
