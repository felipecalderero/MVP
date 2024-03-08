'use client'

import Footer from "@/components/Footer";
import { useState } from "react";

const ForgotPassword = () => {

  const [forgotOpen, setForgotOpen] = useState<boolean>(false);
  
  const handleForgot = () =>{
    
  };
  
  return ( 
    <div className="min-h-screen h-full w-full myFlex flex-col pt-[120px] lato">
      {/* Forgot Password Modal */}

      <div className="flex-1 flex flex-col items-start justify-start w-[500px]">
        {/* Title */}
        <button 
          className="text-[42px] p-0 m-0 bg-transparent border-none font-semibold mb-3.5"
          onClick={()=> setForgotOpen(true)}
        >
          Forgot your Password?
        </button>

        {/* Text */}
        <p className="text-[14px] mb-[9.5px]">
          {"Enter the email you signed up with and we will send you reset instructions."}
        </p>
        
        {/* Input & Button */}
        <div className="flex items-center justify-center gap-x-4 w-full">
          {/* Input */}
          <div className="w-full">
            <span className="text-[11px] font-semibold">Email</span>
            <input 
              type="text" 
              placeholder="Email"
              className="bg-[#f5f5f5] w-full mt-[0.5px] px-3 border-[0.7px] border-transparent transition-all duration-300 h-[35px] flex flex-1 text-[13px] tracking-wide placeholder:text-[#585957] placeholder:opacity-80  focus:border-[#2adc84] focus:outline-none hover:border-[#2adc84]" 
            />
          </div>

          {/* Button */}
          <div className="flex items-center justify-start mt-6">
            <button 
              className="bg-transparent text-sm tracking-wider font-light text-[#2adc84] border-[1.5px] border-[#2adc84] rounded-full px-[1rem] py-[0.4rem] transition-all duration-300 hover:shadow-[rgba(0,_0,_0,_0.15)_0px_4px_8px_0px]"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <div className="w-full">
        <Footer/>
      </div>
    </div>
   );
}
 
export default ForgotPassword;