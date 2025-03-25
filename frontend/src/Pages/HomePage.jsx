import { useState } from 'react';
import { Link } from 'react-router-dom';
import RatingPage from "./RatingProjectPage.jsx";
import ReviewHome from "../components/ReviewsHome.jsx";
import Plumber from "../components/Assets/Icons/Home main serveices/Plumber.svg";
import HomeRepair from "../components/Assets/Icons/Home main serveices/HomeRepair.svg";
import Electrical from "../components/Assets/Icons/Home main serveices/Electrical.svg";
import Painting from "../components/Assets/Icons/Home main serveices/Painting.svg";
import Moving from "../components/Assets/Icons/Home main serveices/Moving.svg";
import Cleaning from "../components/Assets/Icons/Home main serveices/Cleaning.svg";
import Direction from "../components/Assets/Icons/Direction.svg";
import ServiceName from '../components/ServiceName';
import ServiceTypeCard from '../components/ServiceTypeCard';

export default function HomePage() {
  const [rotation, setRotation] = useState(0);

  const handleClick = () => {
    setRotation((prevRotation) => prevRotation + 120);
  };

  return (
    <>
      <div className='flex items-center flex-col w-full font-stdFont'>
        <div className="font-bold items-center mt-4 sm:mt-6 md:mt-10 lg:mt-16 
          flex flex-col flex-wrap px-4">
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl text-stdBlue 
            text-center">
            Find the best tradespeople
          </h2>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-2 sm:mt-3 
            text-stdBlue text-center">
            with <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
            text-color1">TradeConnect</span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg mt-2 sm:mt-3 
            md:mt-4 lg:mt-5 text-stdBlue text-center">
            Connecting you with skilled tradespeople near you!
          </p>
        </div>

        <div className="w-full mt-3 sm:mt-3 md:mt-4 lg:mt-5">
          <ServiceName />
        </div>

        <div className="flex justify-center items-center mt-10 md:mt-20 mb-0 md:mb-20 px-5">
          <div className="flex flex-col md:flex-row items-center gap-5 md:gap-10">
            <div className="flex gap-10">
              {[
                { src: HomeRepair, label: "Home Repairs" },
                { src: Moving, label: "Moving" },
                { src: Electrical, label: "Electrical" }
              ].map((item, index) => (
                <Link to="/services" key={index} className="flex flex-col gap-3 items-center text-xs md:text-base font-semibold group">
                  <img
                    src={item.src}
                    alt={item.label}
                    className="h-[30px] md:h-[60px] transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="transition-colors duration-300 group-hover:text-blue-600">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>

            <div className="flex gap-10">
              {[
                { src: Cleaning, label: "Cleaning" },
                { src: Painting, label: "Painting" },
                { src: Plumber, label: "Plumbing" }
              ].map((item, index) => (
                <Link to="/services" key={index} className="flex flex-col gap-3 items-center text-xs md:text-base font-semibold group">
                  <img
                    src={item.src}
                    alt={item.label}
                    className="h-[30px] md:h-[60px] transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="transition-colors duration-300 group-hover:text-blue-600">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full bg-gradient-to-b from-gray-50 to-white">
          <ServiceTypeCard />
        </div>

        <RatingPage />

        <div className="flex flex-col items-center justify-center w-full text-stdBlue px-5 my-10 md:my-20">
          <h2 className="text-xl md:text-3xl text-center font-bold mb-10 md:mb-20 ">
            See what happy customers are saying about TradeConnect
          </h2>
          <div className="flex flex-col w-full items-center">
            <div className='flex gap-[4rem]'>
              <ReviewHome name="Sophie Carter" />
              <ReviewHome name="Benjamin Adams" />
            </div>

            <div className="flex justify-center items-center mt-5 md:mt-10">
              <div className="p-3 h-[70px] w-[70px] md:h-[80px] md:w-[80px]  rounded-full flex items-center justify-center"
                style={{
                  background: `conic-gradient(#223265 0% 30%,transparent 30% 33%,#FF3D00 33% 63%,transparent 63% 66%,#008080 66% 96%,transparent 96% 100%)`,
                  transform: `rotate(${rotation}deg)`,
                  transition: 'transform 0.5s ease',
                  clipPath: 'inset(5px round 50%)',
                }}>
                <div className="flex items-center justify-center bg-white text-stdBlue h-[40px] w-[40px] md:h-[50px] md:w-[50px] rounded-full font-bold cursor-pointer hover:bg-gray-200 hover:scale-105"
                  onClick={handleClick}>
                  <img src={Direction} className='h-[30px] hover:h-[40px]' />
                </div>
              </div>
            </div>

            <div className='flex gap-[4rem] mt-2 md:mt-4 '>
              <ReviewHome name="Matthew Evans" />
              <ReviewHome name="Oliver Scott" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

