'use client'

import Footer from "@/components/Footer";
import {Accordion, AccordionItem} from "@nextui-org/react";
import { IoVideocamOutline } from "react-icons/io5";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { GoChecklist } from "react-icons/go";
import { FaAngleLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useCourses, useFirebaseUser } from "@/store/store";
import { useEffect, useState } from "react";
import { Course, List, Step, UserCourse } from "../../../../typings";
import { auth, db } from "../../../../firebase";
import MyToast from "@/components/MyToast";
import { AnimatePresence } from "framer-motion";
import { DocumentSnapshot, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { TbLoaderQuarter } from "react-icons/tb";
import { toast } from "sonner";
import Loading from "@/app/loading";
import { Helmet } from "react-helmet";




type Props = {
  params:{
    id: string;
  }
}

const items = [
  {
    title: "Data to Insight",
    list:[
      {
        name:"Welcome",
        type: "video" 
      },
      {
        name:"Using Affinity Mapping",
        type: "video" 
      },
      {
        name:"Tips and Tricks",
        type: "video" 
      },
      {
        name:"Summary Guide & Exercises",
        type: "download" 
      },
    ]
  },
  {
    title: "Sprint Planning",
    list:[
      {
        name:"Welcome",
        type: "video" 
      },
      {
        name:"What is a Sprint?",
        type: "video" 
      },
      {
        name:"Guiding Principles",
        type: "video" 
      },
      {
        name:"Practical Tips",
        type: "video" 
      },
      {
        name:"3 Key Things",
        type: "video" 
      },
      {
        name:"Summary Guide",
        type: "download" 
      },
    ]
  },
  {
    title: "Experiment Design",
    list:[
      {
        name:"Welcome",
        type: "video" 
      },
      {
        name:"Core Principles",
        type: "video" 
      },
      {
        name:"Create Your Hypothesis",
        type: "video" 
      },
      {
        name:"Practice Exercise-Hypothesis Design",
        type: "download" 
      },
      {
        name:"Experiments in Action",
        type: "video" 
      },
      {
        name:"Refresher Pack: Hypothesis Design",
        type: "download" 
      },
      {
        name:"Three Key Things to Remember",
        type: "video" 
      },
      {
        name:"Experiment Design Quiz",
        type: "quiz" 
      },
      {
        name:"Experiment Design Recap Guide",
        type: "download" 
      },
      {
        name:"Test Card",
        type: "download" 
      },
      {
        name:"Learn Card",
        type: "download" 
      },
    ]
  },
]

const Overview = ({params:{id}}:Props) => {

  const currentUser = auth.currentUser;
  const [user] = useFirebaseUser(state => [state.user]);
  const router = useRouter();
  const [myToast, setMyToast] = useState<boolean>(false);


  const [courseFound, setCourseFound] = useState<UserCourse | Course | null>(null);
  const [courses] = useCourses(state => [state.courses]);
  const [courseStyle, setCourseStyle] = useState({
    backgroundImage:""
  });
  const [addingCourse, setAddingCourse] = useState<boolean>(false);
  const [courseAdded, setCourseAdded] = useState<boolean>(false);
  const [alreadyInUserList, setAlreadyInUserList] = useState<boolean>(false);
  const [courseAlreadyCompleted, setCourseAlreadyCompleted] = useState<boolean>(false);
  
  useEffect(() => {
    if(id && courses.length){
      if(user){
        const courseInList = user.courses.find((co: UserCourse)=> co.id === id);
        if(courseInList){
          setAlreadyInUserList(true);
          setCourseFound(courseInList);
        }else{
          const myCourse = courses.find(co => co.id === id);
          if(myCourse){
            setCourseFound(myCourse);
          }
        }
      }else{
        const myCourse = courses.find(co => co.id === id);
        if(myCourse){
          setCourseFound(myCourse);
        }
      }
    }
  }, [id, courses, user]);

  useEffect(() => {
    if(courseFound){
      setCourseStyle({
        backgroundImage: `url(${courseFound.image})`
      });
      if(courseFound.progress !== null){
        if(courseFound.progress === 100){
          setCourseAlreadyCompleted(true);
        }else{
          setCourseAlreadyCompleted(false);
        }
      }
    }
  }, [courseFound]);


  const handleButton = async() =>{
    if(!courseAdded && !alreadyInUserList){
      if(!user){
        toast.info("Whoops...!", {
          description: `You must be logged in order to take this course.`,
          action:{
            label:"Sign in",
            onClick: ()=> router.push("/sign_in")
          }
        })
      }else{
        setAddingCourse(true);
  
        const newCourse = {
          ...courseFound,
          completed: false,
          progress: 0
        };
        
        const coursesRef = doc(db, "Courses", "f0KbKCMEAytfRvDuMa89");
        const userRef = doc(db, "Users", user.uid!);
        // Add the course to the user courses
        updateDoc(userRef, {
          courses: arrayUnion(newCourse)
        })
        .then(()=>{
          // We get live courses data
          getDoc(coursesRef).then((docSnapshot: DocumentSnapshot) => {
            if (docSnapshot.exists()) {
              const parsedCourses = JSON.parse(docSnapshot.data().data);
              
              parsedCourses.map((co:Course) =>{
                if(co.id === id){
                  co.students.push(user.uid);
                }
              });

              // Update Courses Data with updated Students quantity
              updateDoc(coursesRef, {
                data: JSON.stringify(parsedCourses)
              })
              .then(()=> {
                router.push(`/course/${courseFound?.id}`);
                setCourseAdded(true);
              })
              .catch(error => console.log(error))

            } else {
              console.log("No such document!");
            }
          }).catch((error) => {
            console.log("Error getting document:", error);
          });
        })
        .catch((error)=> console.log(error))
        .finally(()=> (
          setAddingCourse(false)
        ))
  
      };
    }else{
      router.push(`/course/${courseFound?.id}`);
    }
  };

  const handleReplayCourse = () =>{
    if(user && courseFound){
      setAddingCourse(true);

      // Resetear curso
      const resetedCourse = courseFound;
      resetedCourse.progress = 0;
      resetedCourse.completed = false;
      resetedCourse.steps.map((step: Step) => {
        step.completed = false;
        step.list.map((substep: List) => {
          substep.completed = false;
        })
      });

      // Remover el curso de user.courses
      const removeCourse = user.courses.filter((co:UserCourse) => co.id !== courseFound.id);
      removeCourse.push(resetedCourse);

      const userRef = doc(db, "Users", user.uid!);
      updateDoc(userRef, {
        courses: removeCourse
      })
      .then(()=>{
        setAddingCourse(false);
        router.push(`/course/${courseFound.id}`);
      })
      .catch(error => {
        console.log(error);
        setAddingCourse(false);
      })
    };
  };
  
  if(!courseFound && !courseStyle.backgroundImage){
    return <Loading/>
  }

    
  return ( 
    <div className={`min-h-screen flex items-center justify-start flex-col h-full relative pt-[50px] w-full lato`}>
      <Helmet title="Course Overview | MMW"/>

      {myToast && (
        <MyToast setOpen={setMyToast} title="Whoops...!" text="You must be logged in order to start this course." button={true} btnText="Sign in" btnLink="/sign_in"/>
      )}
      {/* Banner */}
      <div style={courseStyle} className="relative w-full h-[500px] md-lg:h-[440px] flex items-start justify-center bg-cover bg-center">
        {/* Shadow */}
        <div className="absolute z-10 top-0 left-0 w-full h-[500px] md-lg:h-[440px] bg-black/30"></div>

        {/* Title & Description */}
        <div className="flex flex-col gap-y-3 items-start justify-center text-white z-20 h-full w-full myContainer">
          <h2 className="text-[42px] font-semibold tracking-wide">
            {courseFound?.course}
          </h2>
          
          <p className="text-sm tracking-wide w-1/2 leading-6">
            Now {"you're"} in the discovery lab, {"you'll"} keep unlocking new learning content and video refreshers to help you progress at pace!
          </p>

          <div className="flex items-center leading-7 justify-start w-full mt-1">
            <button 
              className="text-[13px] myFlex tracking-wider text-white bg-[#DC4E27] border-[1.5px] border-[#DC4E27] rounded-full w-[114.78px] h-[42.19px]"
              onClick={courseAlreadyCompleted ? handleReplayCourse : handleButton}
            >
              {addingCourse ? (
                <div className="animate-pulse w-fit myFlex">
                  <TbLoaderQuarter className="animate-spin w-4 h-4 text-white"/>
                </div>
              ):(
                alreadyInUserList ? (
                  courseAlreadyCompleted ? (
                    "Replay Course"
                  ):(
                    "Continue"
                  )
                ):(
                  "Start Course"
                )
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="myFlex flex-col flex-1 w-full max-w-[650px] pb-14">
        <h2 className="font-semibold text-[31px] mt-12 mb-6">Course Curriculum</h2>

        {/* Accordion */}
        {courseFound && (
          <Accordion 
          variant="splitted" 
          className="rounded-sm"
          
          >
            {courseFound.steps.map((step, i)=>(
              <AccordionItem 
                indicator={<FaAngleLeft className="text-[#DC4E27]"/>}
                startContent={i + 1} 
                key={i + 1} 
                aria-label={step.title}
                title={step.title}
                classNames={{
                  base:"group-[.is-splitted]:rounded-md group-[.is-splitted]:shadow-small data-[open=true]:group-[.is-splitted]:bg-[#F2F3F5]/50",
                  trigger:"py-3",
                  title:"text-[14.4px] tracking-wide lato rounded-xl",
                  startContent:"text-[13.5px] pl-3 pr-6",
                  indicator:"pr-2",
                }}
                
              >
                <div className="flex flex-col gap-y-5 items-start justify-center ml-[56px] pb-4">
                  {step.list.map((each, _)=>(
                    <div key={each.name} className="myFlex gap-x-3 font-light text-[13.5px] tracking-wide">
                      {each.type === "video" && <IoVideocamOutline className="w-4 h-4 text-[#DC4E27]"/>}
                      {each.type === "download" && <IoCloudDownloadOutline className="w-4 h-4 text-[#DC4E27]"/>}
                      {each.type === "quiz" && <GoChecklist className="w-4 h-4 text-[#DC4E27]"/>}
                      <span>{each.name}</span>
                    </div>
                  ))}
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      {/* Footer */}
      <div className="w-full">
        <Footer/>
      </div>
    </div>
   );
}
 
export default Overview;