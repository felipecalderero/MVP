'use client'

import CourseCard2 from "@/components/CourseCard2";
import Footer from "@/components/Footer";
import ParticlesContainer from "@/components/ParticlesContainer";
import { Tooltip } from "@nextui-org/react";
import { collection } from "firebase/firestore";
import {  useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useRef, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { BsFillGrid3X3GapFill, BsFillGridFill, BsStars } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { RiMenuFill, RiRobot2Fill } from "react-icons/ri";
import { db } from "../../../firebase";
import { useCourses, useFirebaseUser } from "@/store/store";
import { BiLoaderCircle } from "react-icons/bi";
import { Course } from "../../../typings";
import { useDebouncedCallback } from 'use-debounce';
import { Helmet } from "react-helmet";


interface AIResult {
  why: string;  
  title: string;
  recommendation: {
    title: string;
    reason: string;
  }
}

const Collections = () => {

  const aiInputRef = useRef<HTMLInputElement | null>(null);

  const [courses] = useCourses(state => [state.courses]);
  const [user] = useFirebaseUser(state => [state.user]);

  const [section, setSection] = useState<string>("explore");
  const [exploreResults, setExploreResults] = useState<any>(null);
  const [exploreInput, setExploreInput] = useState<string>("");

  const [aiResults, setAiResults] = useState<AIResult | null>(null);
  const [aiCourse, setAiCourse] = useState<Course | null>(null);
  const [aiRandomText, setAiRandomText] = useState<string | null>(null);
  const [aiSearching, setAiSearching] = useState<boolean>(false);
  const [grid, setGrid] = useState<string>("xl:grid-cols-3");
  
  
  const getCourses = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(aiInputRef && courses.length && aiInputRef?.current?.value){
      setAiSearching(true);
      // Get Courses
      fetch("/api/getCourses", {
        method:"POST",
        headers:{
          'Content-type':"application/json"
        },
        body: JSON.stringify({
          userFeelings: aiInputRef.current.value,
          coursesData: courses
        })
      })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(json => {
        const content = json.content;
        if(content.split("")[0] !== "{"){
          setAiResults({
            why:"",
            title:"",
            recommendation: {
              title:"",
              reason:""
            }
          });
        };
        setAiResults(JSON.parse(content))
        console.log(JSON.parse(content));
        
      })
      .catch(error => console.log(error))
      .finally(()=> setAiSearching(false))
    }
  };

  const debounced = useDebouncedCallback(
    // function
    (value) => {
      setExploreInput(value);
    },
    // delay in ms
  );

  useEffect(() => {
    const getRandomText = () =>{
      // Get Random Text
      fetch("/api/getRandomText", {
        method:"GET",
        headers:{
          'Content-type':"application/json"
        }
      })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(json => {
        const content = json.content;
        if(!aiRandomText){
          return setAiRandomText(content);
        }
      })
      .catch(error => console.log(error))
    };

    if(window !== undefined){
      if(window.location.search === '?ai=true'){
        setSection('ai');
      }else{
        setSection('explore');
      }
    };

    getRandomText();
  }, []);


  useEffect(() => {
    if(aiResults && aiResults.title){
      courses.map((co:Course)=>{
        if(co.course === aiResults.title){
          setAiCourse(co);
        }
      })
    }
  }, [aiResults]);


  useEffect(() => {
    if(section === "explore" && courses.length){
      if(exploreInput.length >= 3){
        let coursesFound:any = [];
        courses.map((co: Course)=> {
          if(co.course.toLowerCase().includes(exploreInput.toLowerCase())){
            coursesFound.push(co);
          }
        });
        setExploreResults(coursesFound);
      }else{
        setExploreResults(null)
      }
    };
  }, [exploreInput, section, courses]);


  return (
    <div className="min-h-screen h-full flex flex-col w-full items-start justify-start overflow-hidden lato pt-[130px]">
      <Helmet title="All Courses | MMW"/>

      {/* Title */}
      <div className="flex items-center justify-start myContainer mx-auto w-full">
        <h2 className="font-semibold text-[42px] tracking-wide pb-5">Courses</h2>
      </div>

      {/* All Courses */}
      <div className="myFlex flex-col h-full w-full lato myContainer mx-auto">
    
        {/* Explore & AI / SearchBar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-y-4 sm:gap-y-0 sm:justify-between w-full pb-[20px]">
          {/* Sections */}
          <div className="myFlex gap-x-4">
            <span className={`text-[12.5px] myUnderline ${section === "explore" && "before:bg-[#4a4949]"} before:bottom-0 text-[#4a4949] font-semibold opacity-90 tracking-wide cursor-pointer transition-all duration-200`} onClick={()=> {setSection("explore") ; setExploreInput("")}}>Explore</span>
            {section === 'explore' ? (
              <Tooltip
                showArrow
                placement="right"
                content={
                  <div className="flex flex-col gap-y-1 items-start justify-start text-[12px]">
                    <p className="font-semibold">
                      {user ? `Hi ${user.displayName!.split(" ")[0]}!` : "Hi there!"}
                    </p>
                    <p>{"I am your MMW AI support system, how can I help you?"}</p>
                  </div>
                }
                classNames={{
                  base: [
                    // arrow color
                    "before:bg-[#27333E] dark:before:bg-[#27333E]",
                  ],
                  content: [
                    "py-2 px-4 shadow-xl",
                    "text-white bg-[#27333E]",
                  ],
                }}
              >
                <div className="myFlex gap-x-1 cursor-pointer" onClick={()=> setSection("ai")}>
                  <FaStar className="w-4 h-4 text-[#DC4E27]"/>
                  <span className={`text-[12.5px] myUnderline before:bottom-0 text-[#4a4949] font-semibold opacity-90 tracking-wide transition-all duration-200`}>
                    AI
                  </span>
                </div>
              </Tooltip>
            ):(
              <div className="myFlex gap-x-1 cursor-pointer" onClick={()=> setSection("ai")}>
                <FaStar className="w-4 h-4 text-[#DC4E27]"/>
                <span className={`text-[12.5px] myUnderline ${section === "ai" && "before:bg-[#4a4949]"} before:bottom-0 text-[#4a4949] font-semibold opacity-90 tracking-wide transition-all duration-200`}>
                  AI
                </span>
              </div>
            )}
          </div>

          {/* Searchbar */}
          <div className="myFlex w-full sm:w-[300px] rounded-full bg-[#f5f5f5] pl-4 pr-3 border-[0.7px] border-transparent transition-all duration-300 group focus-within:border-[#DC4E27] hover:border-[#DC4E27]">
            <form onSubmit={getCourses} className="w-full myFlex">
              <input 
                ref={aiInputRef}
                value={exploreInput}
                onChange={(e)=> {
                  if(section === "explore"){
                    debounced(e.target.value)
                  }else{
                    setExploreInput(e.target.value)
                  }
                }}
                type="text" 
                placeholder={section === "explore" ? "Explore..." : "Ask AI..."}
                className="bg-transparent h-[35px] flex flex-1 text-[13px] tracking-wide placeholder:text-[#585957] placeholder:opacity-80 focus:border-none focus:outline-none" 
              />
              {section === "explore" && <IoSearch className="w-[18px] h-[18px] text-black"/>}
              {section === "ai" && <IoSearch className="w-[18px] h-[18px] text-black"/>}
            </form>
          </div>
        </div>

        {/* Search Results */}
        <div className="flex items-center justify-between w-full p-5 bg-white rounded-md shadow-lg">
          <div className="w-full 2xl:w-[70%] md:w-full">
            {section === 'explore' ? (
              <p className="poppins text-[#4a4949] text-xs leading-5 tracking-wide font-semibold">We found <span className="text-[#DC4E27]">{exploreResults ? exploreResults.length : courses?.length }</span> courses for you</p>
            ):(
              aiResults === null ? (
                <p className="poppins text-[#4a4949] text-xs leading-5 tracking-wide font-semibold">
                  Tell us how you feel and our AI will do the rest!
                </p>
              ):(
                <p className="poppins text-[#4a4949] text-xs leading-5 tracking-wide font-semibold">We found <span className="text-[#DC4E27]">{aiResults.why ? 1 : 0}</span> courses for you</p>
              )
            )}
          </div>

          {/* Grid Selector */}
          <div className="hidden 2xl:myFlex gap-x-3">
            <div className={`myFlex bg-gray-300/20 w-7 h-7 cursor-pointer`}>
              <BsFillGrid3X3GapFill className={`w-5 h-5 transition-colors duration-300 ${grid === "2xl:grid-cols-3" ? "text-[#DC4E27]" : "text-gray-500"}`} onClick={()=> setGrid("2xl:grid-cols-3")}/>
            </div>
            <div className={`myFlex bg-gray-300/20 w-7 h-7 cursor-pointer`}>
              <BsFillGridFill className={`w-5 h-5 transition-colors duration-300 ${grid === "2xl:grid-cols-2" ? "text-[#DC4E27]" : "text-gray-500"}`} onClick={()=> setGrid("2xl:grid-cols-2")}/>
            </div>
            <div className={`myFlex bg-gray-300/20 w-7 h-7 cursor-pointer`}>
              <RiMenuFill className={`w-5 h-5 transition-colors duration-300 ${grid === "2xl:grid-cols-1" ? "text-[#DC4E27]" : "text-gray-500"}`} onClick={()=> setGrid("2xl:grid-cols-1")}/>
            </div>
          </div>
        </div>

        {section === "explore" && (
          <div className={`min-h-[400px] w-full grid grid-cols-1 sm:grid-cols-2 md-xl:grid-cols-3 ${grid} gap-7 mt-5 pb-20`}>
            {exploreResults ? (
              exploreResults.length ? (
                exploreResults.map((course: Course, i:number)=>(
                  <CourseCard2 key={i} course={course}/>
                ))
              ):(
                <div className="myFlex flex-col source-sans col-span-full text-center w-full">
                  <h5 className="font-semibold text-[15px]">Whoops!...</h5>
                  <p className="text-[13px]">I {"couldn't find any course for you. Could you be more specific about how you feel?"}</p>
                  <button 
                  onClick={()=> aiInputRef?.current?.focus()}
                  className="mt-5 bg-[#DC4E27] text-white text-[13px] rounded-md px-4 py-2 tracking-wide hover:opacity-90 transition-opacity duration-300">
                      Try Again
                  </button>
                </div>
              )
            ):(
              courses.map((course:Course, i:number)=>(
                <CourseCard2 key={i} course={course}/>
              ))
            )}
          </div>
        )}
        {section === "ai" && (
          <div className="myFlex flex-col w-full">
            {/* AI Curious Fact */}
            <div className="relative bg-[#27333E] rounded-b-md w-full p-5 flex items-start justify-center flex-col gap-y-1 text-white tracking-wide">
              <p className="text-[13.2px] font-bold">Did you know?</p>
              <p className="text-[12.5px]">
                {aiRandomText || (
                  <span className="animate-pulse">…</span>
                )}
              </p>
              {/* Particles */}
              {/* <div className="absolute left-0 bottom-0 w-[100vw] h-full">
                <ParticlesContainer/>
              </div> */}
            </div>

            {/* Results */}
            <div className={`min-h-[400px] myFlex w-full mt-5 pb-20`}>
              {aiSearching ? (
                <div className="myFlex flex-col col-span-full text-center w-full source-sans">
                  <BiLoaderCircle className="w-9 h-9 text-[#DC4E27] animate-spin"/>
                  <h5 className="font-semibold text-[15px] mt-5">Get ready!</h5>
                  <p className="animate-pulse text-[13px]">{"We're"} finding courses that match your needs...</p>
                </div>
              ):(
                aiResults && aiResults.title ? (
                  <div className="myFlex flex-col w-full source-sans">
                    <div className="flex items-start p-5 rounded-md justify-start w-full flex-col gap-y-3 bg-[#DC4E27] text-white">
                      <h5 className="font-semibold text-[28px]">{aiResults.title}</h5>
                      <p className="text-[14px]">{aiResults.why}</p>
                      <div className="text-[14px] myFlex gap-x-2 mt-1 mb-1">
                        <span className="font-semibold text-[15.2px]"><i>{`"${aiResults.recommendation?.title}"`}</i>.</span>
                        <span className="text-[12px] font-semibold bg-[#db5f3d] p-1.5 rounded-sm">Recommended step</span>
                      </div>
                      <p className="text-[14px]">{aiResults.recommendation.reason}</p>
                    </div>
                    <div className={`w-full grid grid-cols-1 sm:grid-cols-2 md-xl:grid-cols-3 ${grid} gap-7 mt-5`}>
                      {aiCourse && (
                        <CourseCard2 course={aiCourse}/>
                      )}
                    </div>
                  </div>
                ): !aiResults?.title && aiResults !== null ? (
                  <div className="myFlex flex-col source-sans col-span-full text-center w-full">
                    <h5 className="font-semibold text-[15px]">Whoops!...</h5>
                    <p className="text-[13px]">I {"couldn't find any course for you. Could you be more specific about how you feel?"}</p>
                    <button 
                    onClick={()=> aiInputRef?.current?.focus()}
                    className="mt-5 bg-[#DC4E27] text-white text-[13px] rounded-md px-4 py-2 tracking-wide hover:opacity-90 transition-opacity duration-300">
                        Try Again
                    </button>
                  </div>
                ):(
                  <div className="myFlex flex-col col-span-full text-center w-full source-sans">
                    <h5 className="font-semibold text-[15px]">Need help finding the right course?</h5>
                    <p className="text-[13px]">
                      Tell our AI how you feel and it will find the right content support for your situation!
                    </p>
                    <button 
                    onClick={()=> aiInputRef?.current?.focus()}
                    className="mt-5 bg-[#DC4E27] text-white text-[13px] rounded-md px-4 py-2 tracking-wide hover:opacity-90 transition-opacity duration-300">
                        Start with AI
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {/* <div className="myFlex w-full myContainer mx-auto">
        <div className="flex items-center justify-start w-full">
          <p className="text-sm tracking-wide">
            No results were found
          </p>
        </div>
      </div> */}


      <Footer/>
    </div>
   );
}
 
export default Collections;


/*
:(
  !aiResults ? (
    <div className="flex items-center justify-start flex-col gap-y-5 h-[500px] pt-16">
      <img src="/images/ai1.svg" alt="" className="w-[200px]" />
      <p className="text-[12.5px] text-[#4a4949] tracking-wide">{"You don't know which course is the best for you? Don't worry, ask AI!"}</p>
    </div>
  ):(
    aiResults > 0 ? (
      <div className={`w-full grid grid-cols-1 sm:grid-cols-2 md-xl:grid-cols-3 ${grid} gap-7 mt-5 pb-20`}>
        {courses.map((course, i)=>(
          <CourseCard2 key={i} course={course}/>
        ))}
      </div>
    ):(
      <div className="myFlex">
      
      </div>
    )
  )
)
*/