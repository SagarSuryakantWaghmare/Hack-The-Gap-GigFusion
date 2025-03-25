import React from 'react';
import { Link } from 'react-router-dom'; 
import bgImage from '../components/Assets/backgroundImage.png'
import BackButton from '../components/BackButton';
export default function SignLog() {
  return (
    <>
    <BackButton />
      <div className='flex items-center justify-center  font-stdFont relative'>
        <div className='absolute inset-0 bg-cover bg-center filter blur-[2px]' style={{ backgroundImage: `url(${bgImage})` }} />
        <div className='relative z-10'>
          <div className='h-[90vh] flex justify-center items-center font-stdFont  p-5'>
            <div className='bg-white  w-full  md:w-[400px] rounded-2xl h-auto md:h-[280px] text-center pb-3'>
              <div id="head" className='text-color1 font-bold text-[30px] md:text-[36px] mt-2'>Trade <span className='text-stdBlue'>Connect</span></div>
              <div id="inputBtn" className='flex flex-col gap-4 text-center items-center font-bold mt-5'>

                {/* Sign Up Button */}
                <Link to="/signup">
                  <button className='h-[45px] w-full md:w-[300px] max-w-[250px] rounded-full border text-[18px] bg-gray-100'>
                    Sign Up
                  </button>
                </Link>

                {/* Login Button */}
                <Link to="/login">
                  <button className='h-[45px] w-full md:w-[300px] max-w-[250px] rounded-full border bg-stdBlue text-white text-[18px]'>
                    Login
                  </button>
                </Link>

              </div>
              <div className='mt-5 flex items-center justify-center w-full'>
                <p className='text-[12px] md:text-[14px] text-center max-w-[300px]'>
                  By signing up you agree to our <span className='font-bold text-stdBlue'>Terms of Use</span> and <span className='font-bold text-stdBlue'>Privacy Policy.</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </>
  );
}
