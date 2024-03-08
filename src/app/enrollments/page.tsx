'use client'

import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BsFillGrid3X3GapFill, BsFillGridFill } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";
import { RiMenuFill } from "react-icons/ri";
import { IoMdHeart } from "react-icons/io";
import ParticlesContainer from "@/components/ParticlesContainer";
import CourseCard2 from "@/components/CourseCard2";
import { useFirebaseUser } from "@/store/store";
import { UserCourse } from "../../../typings";
import UserCourseCard from "@/components/CourseCard";
import { useDebouncedCallback } from "use-debounce";
import withAuth from "@/components/WithAuth";
import { Helmet } from "react-helmet";
import { useRouter } from "next/navigation";




const Enrollments = () => {

  const myInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();


  const [user] = useFirebaseUser(state => [state.user]);
  const [allResults, setAllResults] = useState<any>(null);
  const [favResults, setFavResults] = useState<any>(null);
  const [section, setSection] = useState("courses");
  const [grid, setGrid] = useState("xl:grid-cols-3");
  const [exploreInput, setExploreInput] = useState<string>("");
  const [allow, setAllow] = useState<boolean>(false);

  const debounced = useDebouncedCallback(
    // function
    (value) => {
      setExploreInput(value);
    },
    // delay in ms
  );

  useEffect(() => {
    if(user){
      if(section === "courses" && user.courses.length){
        if(exploreInput.length >= 3){
          let coursesFound:any = [];
          user.courses.map((co: UserCourse)=> {
            if(co.course.toLowerCase().includes(exploreInput.toLowerCase())){
              coursesFound.push(co);
            }
          });
          setAllResults(coursesFound);
        }else{
          setAllResults(null)
        }
      };
      if(section === "favorites" && user.favorites.length){
        if(exploreInput.length >= 3){
          let coursesFound:any = [];
          user.favorites.map((co: UserCourse)=> {
            
            if(co.course.toLowerCase().includes(exploreInput.toLowerCase())){
              coursesFound.push(co);
              console.log(co.course);
              
            }
          });
          setFavResults(coursesFound);
        }else{
          setFavResults(null)
        }
      }
    };
  }, [exploreInput, section, user]);

  useEffect(() => {
    const sessionExist = localStorage?.getItem("mmw-user");
    if(!sessionExist){
      router.push("/")
    }else{
      setAllow(true);
    };
  }, []);

  if(allow){
    return ( 
      <div className="relative min-h-screen flex flex-col items-start justify-center lato pt-[130px] overflow-hidden">
        <Helmet title="My Dashboard | MMW"/>
  
        {/* Main */}
        <div className="flex items-center justify-start flex-col flex-1 w-full myContainer mx-auto pb-[116px]">
          {/* Title */}
          <div className="flex items-center justify-start w-full">
            <h2 className="font-semibold text-[34px] sm:text-[42px] tracking-wide pb-5">My Dashboard</h2>
          </div>
  
          {/* Explore & AI / SearchBar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-y-4 sm:gap-y-0 sm:justify-between w-full pb-[20px]">
            {/* Sections */}
            <div className="myFlex gap-x-4">
              <span className={`text-[12.5px] myUnderline ${section === "courses" && "before:bg-[#4a4949]"} before:bottom-0 text-[#4a4949] font-semibold opacity-90 tracking-wide cursor-pointer transition-all duration-200`} onClick={()=> {setSection("courses") ; setExploreInput("")}}>Courses</span>
              
              <div className="myFlex gap-x-1 cursor-pointer" onClick={()=> setSection("favorites")}>
                <IoMdHeart className="w-4 h-4 text-[#DC4E27]"/>
                <span className={`text-[12.5px] myUnderline before:bottom-0 ${section === "favorites" && "before:bg-[#4a4949]"} text-[#4a4949] font-semibold opacity-90 tracking-wide transition-all duration-200`}>
                  Favorites
                </span>
              </div>
              
            </div>
  
            {/* Searchbar */}
            <div className="myFlex w-full sm:w-[300px] rounded-full bg-[#f5f5f5] pl-4 pr-3 border-[0.7px] border-transparent transition-all duration-300 group focus-within:border-[#DC4E27] hover:border-[#DC4E27]">
              <input 
                ref={myInputRef}
                type="text" 
                value={exploreInput}
                onChange={(e)=> debounced(e.target.value)}
                placeholder={section === "courses" ? "Search in all your courses..." : "Search in your favorites..."}
                className="bg-transparent h-[35px] flex flex-1 text-[13px] tracking-wide placeholder:text-[#585957] placeholder:opacity-80 focus:border-none focus:outline-none" 
              />
              <IoSearch className="w-[18px] h-[18px] text-black"/>
            </div>
          </div>
  
          {/* Search Results */}
          <div className="flex items-center justify-between w-full p-5 bg-white rounded-md shadow-lg">
            <div className="w-[70%] md:w-full">
              {section === "courses" ? (
                allResults ? (
                  <p className="poppins text-[#4a4949] text-xs leading-5 tracking-wide font-semibold">We found <span className="text-[#DC4E27]">{allResults.length}</span> {allResults.length === 1 ? "course" : "courses"}.</p>
                ):(
                  <p className="poppins text-[#4a4949] text-xs leading-5 tracking-wide font-semibold">{"You're"} enrolled in <span className="text-[#DC4E27]">{user?.courses.length}</span> {user?.courses.length === 1 ? "course" : "courses"}.</p>
                )
                ):(
                favResults ? (
                  <p className="poppins text-[#4a4949] text-xs leading-5 tracking-wide font-semibold">We found <span className="text-[#DC4E27]">{favResults.length}</span> {favResults.length === 1 ? "course" : "courses"}.</p>
                ):(
                  <p className="poppins text-[#4a4949] text-xs leading-5 tracking-wide font-semibold">You have <span className="text-[#DC4E27]">{user?.favorites.length}</span> {user?.favorites.length === 1 ? "course" : "courses"} in your favorites.</p>
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
  
          {/* Courses */}
          <div className={`min-h-[400px] w-full grid grid-cols-1 sm:grid-cols-2 md-xl:grid-cols-3 ${grid} gap-7 mt-5 pb-20`}>
            {user && (
              section === "courses" ? (
                allResults ? (
                  allResults.length ? (
                    allResults.map((course: UserCourse, i: number)=>(
                      <UserCourseCard key={i} course={course}/>
                    ))
                  ):(
                  <div className="myFlex flex-col source-sans col-span-full text-center w-full">
                    <h5 className="font-semibold text-[15px]">Whoops!...</h5>
                    <p className="text-[13px]">I {"couldn't find any course for you. Could you be more specific?"}</p>
                    <button 
                    onClick={()=> myInputRef?.current?.focus()}
                    className="mt-5 bg-[#DC4E27] text-white text-[13px] rounded-md px-4 py-2 tracking-wide hover:opacity-90 transition-opacity duration-300">
                        Try Again
                    </button>
                  </div>
                  )
                ):(
                  user.courses.length ? (
                    user.courses.map((course: UserCourse, i: number)=>(
                      <UserCourseCard key={i} course={course}/>
                    ))
                  ):(
                  <div className="myFlex flex-col col-span-full text-center w-full source-sans">
                    <h5 className="font-semibold text-[15px]">Whoops!</h5>
                    <p className="text-[13px]">Seems that you are not enrolled in any course yet.</p>
                    <button className="mt-5 bg-[#DC4E27] text-white text-[13px] rounded-md px-4 py-2 tracking-wide hover:opacity-90 transition-opacity duration-300">
                      <Link href="/collections">
                        Explore Courses
                      </Link>
                    </button>
                  </div>
                  )
                )
              ):(
                favResults ? (
                  favResults.length ? (
                    favResults.map((course: UserCourse, i: number)=>(
                      <UserCourseCard key={i} course={course}/>
                    ))
                  ):(
                  <div className="myFlex flex-col source-sans col-span-full text-center w-full">
                    <h5 className="font-semibold text-[15px]">Whoops!...</h5>
                    <p className="text-[13px]">I {"couldn't find any course for you. Could you be more specific about how you feel?"}</p>
                    <button 
                    onClick={()=> myInputRef?.current?.focus()}
                    className="mt-5 bg-[#DC4E27] text-white text-[13px] rounded-md px-4 py-2 tracking-wide hover:opacity-90 transition-opacity duration-300">
                        Try Again
                    </button>
                  </div>
                  )
                ):(
                  user.favorites.length ? (
                    user.favorites.map((course: UserCourse, i: number)=>(
                      <UserCourseCard key={i} course={course}/>
                    ))
                  ):(
                  <div className="myFlex flex-col col-span-full text-center w-full source-sans">
                    <h5 className="font-semibold text-[15px]">Whoops!</h5>
                    <p className="text-[13px]">Seems that you {"don't"} have any course in your favorites yet.</p>
                    <button className="mt-5 bg-[#DC4E27] text-white text-[13px] rounded-md px-4 py-2 tracking-wide hover:opacity-90 transition-opacity duration-300">
                      <Link href="/collections">
                        Explore Courses
                      </Link>
                    </button>
                  </div>
                  )
                )
              )
            )}
          </div>
  
          {/* Footer */}
          <div className="absolute bottom-0 left-0 w-full">
            <Footer/>
          </div>
        </div>
      </div>
     );
  }
}
 
export default Enrollments;