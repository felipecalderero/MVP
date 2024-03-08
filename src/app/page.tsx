'use client'

import { Helmet } from "react-helmet";

import CourseCard from "@/components/CourseCard";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoFilter, IoSearch } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import ParticlesContainer from "@/components/ParticlesContainer";
import Reveal from "@/components/Reveal";
import { slideAnimation } from "@/framer/motion";
import CourseCard2 from "@/components/CourseCard2";
import { BsFillGrid3X3GapFill, BsFillGridFill } from "react-icons/bs";
import { RiMenuFill } from "react-icons/ri";
import { RiRobot2Fill } from "react-icons/ri";
import { Tooltip } from "@nextui-org/react";
import { PiBooksLight } from "react-icons/pi";
import { BsStars } from "react-icons/bs";
import { BsPlusCircleDotted } from "react-icons/bs";
import { PiSignature } from "react-icons/pi";
import Image from "next/image";


export default function Home() {
  
  const router = useRouter();
  const [paddingTop, setPaddingTop] = useState(false);
  const [grid, setGrid] = useState<string>("grid-cols-3");
  const [section, setSection] = useState<string>("explore");

  const [exploreResults, setExploreResults] = useState<number>(4);
  const [aiResults, setAiResults] = useState<number | null>(null);

  const handleScroll = () =>{
    if (window.scrollY > 0) {
      setPaddingTop(true);
    } else {
      setPaddingTop(false);
    }
  }

  useEffect(() => {
    if(window !== undefined){
      window.addEventListener("scroll", handleScroll);

      return ()=> {
        window.removeEventListener("scroll", handleScroll);
      }
    }
  }, []);


  return ( 
    <div className={`min-h-screen myFlex flex-col h-full relative pt-[50px] w-full overflow-hidden`}>
      <Helmet title="Home | MMW"/>

      {/* Banner Container */}
      <div className="relative h-[370px] max-h-[370px] sm:h-[390px] sm:max-h-[390px] lg:h-[410px] lg:max-h-[410px] xl:h-[440px] xl:max-h-[440px] 2xl:h-[460px] 2xl:max-h-[460px] overflow-hidden w-full myFlex">
       {/* Image */}
        <div className="absolute top-0 left-0 w-full h-full">
        <Image
          layout="fill"
          objectFit="cover"
          alt=""
          src="/images/MainBanner.png"
        />
        </div>
        
       {/* Shadow */}
       <div className="absolute w-full top-0 left-0 z-10 h-full bg-black/30"></div>
       
       {/* Banner Text */}
       <div className="flex items-start justify-center flex-col gap-y-3 text-white w-full myContainer z-20 source-sans">
        <h2 className="text-[42px] xl:text-[52px] 2xl:text-6xl font-bold">Welcome</h2>
        <p className="text-sm tracking-wider">
          {"You've"} reached MMW Learning
        </p>
       </div>

      </div>

      

      {/* AI */}
      <div className="bg-[#f9f9f9] myFlex h-full flex-1 py-16 w-full source-sans">
        <div className="myFlex flex-1 flex-wrap gap-5 w-full h-full myContainer mx-auto">
          {/* AI */}
          <div 
            className="myFlex flex-col gap-y-3 bg-white rounded-lg w-[220px] h-[120px] border-1 border-transparent cursor-pointer transition-all duration-300 group hover:shadow-md hover:border-[#DC4E27] hover:-translate-y-4"
            onClick={()=> router.push("/collections?ai=true")}
          >
            <BsStars className="w-7 h-7 text-[#8b8b8b] transition-all duration-300 group-hover:text-[#DC4E27]"/>
            <span className="font-bold text-[13px] text-[#2c2c2c] tracking-wider">Start with AI</span>
          </div>

          {/* Explore */}
          <div 
            className="myFlex flex-col gap-y-3 bg-white border-1 border-transparent rounded-lg w-[220px] h-[120px] cursor-pointer transition-all duration-300 group hover:shadow-md hover:border-[#DC4E27] hover:-translate-y-4"
            onClick={()=> router.push("/collections")}
          >
            <BsPlusCircleDotted className="w-7 h-7 text-[#8b8b8b] transition-all duration-300 group-hover:text-[#DC4E27]"/>
            <span className="font-bold text-[13px] text-[#2c2c2c] tracking-wider">Explore Courses</span>
          </div>

          {/* Sign the Pledge */}
          {/* <div 
            className="myFlex flex-col gap-y-3 bg-white border-1 border-transparent rounded-lg w-[220px] h-[120px] cursor-pointer transition-all duration-300 group hover:shadow-md hover:border-[#DC4E27] hover:-translate-y-4"
            onClick={()=> window.open("https://www.mmwpledge.com", "__blank")}
          >
            <PiSignature  className="w-7 h-7 text-[#8b8b8b] transition-all duration-300 group-hover:text-[#DC4E27]"/>
            <span className="font-bold text-[13px] text-[#2c2c2c] tracking-wider">Sign Pledge</span>
          </div> */}

        </div>
      </div>
      

      <div className="w-full">
        <Footer/>
      </div>
    </div>
   );
}
