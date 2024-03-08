'use client'

import CoursePanel from "@/components/Panel";
import PanelModal from "@/modals/PanelModal";
import { useCourses, useFirebaseUser } from "@/store/store";
import "@/utils/HamburgerBtn/index.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCaretRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import { LuShrink } from "react-icons/lu";
import { SectionObjectFormat, UserCourse } from "../../../../typings";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import RateCourse from "@/modals/RateCourse";
import withAuth from "@/components/WithAuth";
import { useRouter } from "next/navigation";
import { Helmet } from "react-helmet";


type Props = {
  params:{
    id: string;
  }
}

const Course = ({params:{id}}:Props) => {

  const [user] = useFirebaseUser(state => [state.user]);
  const router = useRouter();
  
  const [courseFound, setCourseFound] = useState<UserCourse | null>(null);
  const [section, setSection] = useState<SectionObjectFormat | null>(null);
  const [selectedKeys, setSelectedKeys] = useState(new Set(["1"]));
  const [openRating, setOpenRating] = useState<UserCourse | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [allow, setAllow] = useState<boolean>(false);

  useEffect(() => {
    if(id && user){
      const myCourse = user.courses.find((co: UserCourse) => co.id === id);
      if(myCourse){
        setCourseFound(myCourse);
        console.log(myCourse);
        
        
        if(!section){
          setSection({
            stepTitle: myCourse.steps[0].title,
            substep: myCourse.steps[0].list[0]
          })
        }
      }
    }
  }, [id, user]);

  const [openMenu, setOpenMenu] = useState(false);
  const [fullScreenActive, setFullScreenActive] = useState<boolean>(false);

  
  const handleNext = () =>{
    if(section && courseFound && user){
      const myCourse = courseFound;

      myCourse.steps.map((step, index) =>{
        let stepIndex:number;
        if(step.title === section.stepTitle){
          // Guardamos index para comprobar si hay un step siguiente o el curso esta completado
          stepIndex = index;
          
          step.list.map((substep, i) =>{
            if(substep.name === section.substep.name){
              substep.completed = true;

              if(!step.list[i + 1]){
                // Main step completed?
                let substepsCompleted = 0;
                step.list.map(value => {
                  if(value.completed){
                    substepsCompleted = substepsCompleted + 1;
                  }
                });

                if(substepsCompleted === step.list.length){
                  myCourse.steps[stepIndex].completed = true;
                };

                // Progress perentage
                let completedSteps = 0;
                myCourse.steps.map(step => {
                  if(step.completed){
                    completedSteps = completedSteps + 1;
                  }
                });
                if(completedSteps > 0){
                  myCourse.progress = Math.round((completedSteps / myCourse.steps.length) * 100);
                }


                // There is a next main step or course is completed?
                if(myCourse.steps[stepIndex + 1]){
                  // Hay un step siguiente
                  setSection({
                    stepTitle: myCourse.steps[stepIndex + 1].title,
                    substep: myCourse.steps[stepIndex + 1].list[0]
                  })
                }else{
                  // Puede pasar que esten en el step final pero hayan marcado como incompleto un substep
                  if(myCourse.progress === 100){
                    // Curso completado
                    setOpenRating(myCourse);
                    setShowConfetti(true);
                  }
                }
              }else{
                let substepsCompleted = 0;
                step.list.map(value => {
                  if(value.completed){
                    substepsCompleted = substepsCompleted + 1;
                  }
                });

                if(substepsCompleted === step.list.length){
                  myCourse.steps[stepIndex].completed = true;
                };

                // Progress perentage
                let completedSteps = 0;
                myCourse.steps.map(step => {
                  if(step.completed){
                    completedSteps = completedSteps + 1;
                  }
                });
                if(completedSteps > 0){
                  myCourse.progress = Math.round((completedSteps / myCourse.steps.length) * 100);
                };

                return setSection({
                  stepTitle: step.title,
                  substep: step.list[i + 1]
                })
              };

              const userRef = doc(db, "Users", user.uid!);
              const filterArray = user.courses.filter((co: UserCourse) => co.id !== myCourse.id);
              filterArray.push(myCourse);

              updateDoc(userRef, {
                courses: filterArray
              });

            };
            
          })
        }
      })
    }
  };

  const handleIncomplete = () =>{
    if(section && courseFound && user){
      if(section.substep.completed){
        const myCourse = courseFound;

        myCourse.steps.map((step, index) =>{
          let stepIndex:number;
          if(step.title === section.stepTitle){
            // Guardamos index para comprobar si hay un step siguiente o el curso esta completado
            stepIndex = index;
            
            step.list.map((substep, i) =>{
              if(substep.name === section.substep.name){
                substep.completed = false;
                if(myCourse.steps[stepIndex].completed){
                  myCourse.steps[stepIndex].completed = false;
                };

                // Progress perentage
                let completedSteps = 0;
                myCourse.steps.map(step => {
                  if(step.completed){
                    completedSteps = completedSteps + 1;
                  }
                });
                if(completedSteps > 0){
                  myCourse.progress = Math.round((completedSteps / myCourse.steps.length) * 100);
                };

                const userRef = doc(db, "Users", user.uid!);
                const filterArray = user.courses.filter((co: UserCourse) => co.id !== myCourse.id);
                filterArray.push(myCourse);

                updateDoc(userRef, {
                  courses: filterArray
                });

              };
              
            })
          }
        })
      };
    }
  };

  useEffect(() => {
    if(section){
      setSelectedKeys(new Set([`${section.stepTitle}`]));
      console.log(section);
      
    }
  }, [section]);

  useEffect(() => {
    if(showConfetti){
      setTimeout(()=>{
        setShowConfetti(false);
      },4000);
    }
  }, [showConfetti]);

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
      <div className="relative min-h-screen h-full flex items-center justify-start flex-col w-full source-sans">
        <Helmet title={`${courseFound ? `${courseFound.course} | MMW` : 'Course | MMW'}`}/>
        
        {/* Rating Modal */}
        {openRating && <RateCourse courseId={id} showConfetti={showConfetti} course={openRating} setOpen={setOpenRating}/>}
        
        {/* Panel Modal */}
        <PanelModal setOpen={setOpenMenu} selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys} course={courseFound} open={openMenu} section={section} setSection={setSection}/>
        
        {/* Header */}
        <div className="w-full h-[51px]">
          <div className="relative myFlex w-full h-[51px] bg-[#134731]">
            {/* -LG: Hamburguer Menu */}
            <div className="lg:hidden absolute top-1 left-0">
              {/* Hamburguer */}
              <div>
                <button className="relative group">
                  <div className="relative flex overflow-hidden items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all">
                    <div className="flex flex-col justify-between w-[20px] h-[12px] transform transition-all duration-300 origin-center overflow-hidden" onClick={()=> setOpenMenu(!openMenu)}>
                      <div className={`bg-white h-[1.8px] rounded w-[16px] transform transition-all duration-300 origin-left ${openMenu && "translate-x-10"}`}></div>
                      <div className={`bg-white h-[1.8px] rounded w-[16px] transform transition-all duration-300 ${openMenu && "translate-x-10"} delay-75`}></div>
                      <div className={`bg-white h-[1.8px] rounded w-[16px] transform transition-all duration-300 origin-left ${openMenu && "translate-x-10"} delay-150`}></div>

                      <div className={`absolute items-center justify-between transform transition-all duration-500 top-1.5 -translate-x-10 ${openMenu && "translate-x-0"} flex w-0 ${openMenu && ""}w-12`}>
                        <div className={`absolute bg-white h-[1.5px] w-4 transform transition-all duration-500 rotate-0 delay-300 ${openMenu && "rotate-45"}`}></div>
                        <div className={`absolute bg-white h-[1.5px] w-4 transform transition-all duration-500 -rotate-0 delay-300 ${openMenu && "-rotate-45"}`}></div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* LG: Go Back Link */}
            <div className="hidden lg:myFlex absolute top-1/2 -translate-y-1/2 left-5 cursor-pointer">
              <Link href="/enrollments" className="myFlex gap-x-1.5">
                <FaAngleLeft className="w-3 h-3 text-white"/>
                <span className="text-white text-[11.5px] tracking-wide mt-[0.5px]">Go to Dashboard</span>
              </Link>
            </div>

            {/* Logo */}
            <div className="myFlex p-[0px] w-full">
              <img src="/images/Logo2.svg" alt="" className="w-[115px] cursor-pointer" onClick={()=> router.push("/")} />
            </div>
          </div>
        </div>


        {/* Main Container */}
        <div className={`flex w-full items-start justify-start bg-[#F2F3F5] ${fullScreenActive ? "lg:p-0" : "lg:p-3.5 gap-x-3.5"} transition-all duration-300`}>
          {/* LG:Show Panel */}
          <div className={`hidden lg:flex ${fullScreenActive ? "w-[0px]" : "w-[350px]"} h-[calc(100vh-79px)] transition-all duration-300`}>
            <CoursePanel selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys} course={courseFound} fullScreenActive={fullScreenActive} section={section} setSection={setSection}/>
          </div>
          
          {/* Video Container */}
          <div className={`myFlex flex-col w-full flex-1 bg-white shadow-xl ${fullScreenActive ? "h-[calc(100vh-51px)]" : "h-[calc(100vh-79px)]"} transition-all duration-300`}>
            {/* Section Selected */}
            <div className="flex items-center justify-between w-full text-left px-3 py-2 border-b-1 border-[#CACCD6]/50">
              {/* Section Title */}
              <span className="text-[13px] font-semibold ">
                {section?.substep.name}
              </span>

              {/* Expand / Shrink Button */}
              <div className="hidden lg:myFlex cursor-pointer" onClick={()=> setFullScreenActive(!fullScreenActive)}>
                {fullScreenActive ? (
                  <LuShrink className="w-4 h-4"/>
                ):(
                  <HiOutlineArrowsExpand className="w-4 h-4"/>
                )}
              </div>
            </div>

            {/* Video */}
            <div className="flex flex-1 myFlex w-full h-full lg:max-w-[1024px] lg:py-3">
              <video src={section?.substep.video} muted controls className="w-full h-full"></video>
            </div>

            {/* Buttons */}
            <div className="myFlex gap-x-2 w-full h-[60px] font-semibold text-[10px] tracking-wide border-t-1 border-[#CACCD6]/50">
              <button 
                onClick={handleIncomplete}
                className="rounded-[4px] px-2.5 py-[5px] text-[#DC4E27] border-1 border-[#DC4E27]">
                MARK INCOMPLETE
              </button>
              <button 
                onClick={handleNext}
                className="rounded-[4px] px-2.5 py-[5px] bg-[#DC4E27] border-1 border-[#DC4E27] text-white myFlex gap-x-1"
              >
                CONTINUE
                <FaCaretRight className="text-white w-3 h-3"/>
              </button>
            </div>
          </div>
        </div>

      </div>
    );
  }
}
 
export default Course;