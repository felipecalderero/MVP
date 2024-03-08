'use client';

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Course, UserCourse } from "../../typings";
import ReactStarsRating from 'react-awesome-stars-rating';
import { useRouter } from "next/navigation";
import { useFirebaseUser } from "@/store/store";
import { DocumentSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "sonner";
import { RiLoader5Fill } from "react-icons/ri";
import { PiConfettiDuotone } from "react-icons/pi";
import Lottie from 'react-lottie';
import animationData from '../utils/lottie/confetti.json';

const descriptions = [
  {
    course: "Stress Management",
    description:"Now you are able to employ effective stress coping strategies such as mindfulness practices, time management skills, and relaxation techniques. These skills will help you better manage pressure and maintain a sense of calm in challenging situations."
  },
  {
    course: "Building Resilience",
    description:"Now you are able to navigate through life's challenges with greater strength and perseverance. With the ability to cultivate a resilient mindset, adapt to change, and develop a strong support network."
  },
  {
    course: "Mental Health Conversation",
    description:"Now you are able to create a safe and understanding environment for discussing mental health concerns. You can listen empathetically, destigmatize mental health issues, and provide appropriate support to those in need."
  },
  {
    course: "Burnout Prevention",
    description:"Now you are able to proactively manage stress and prevent burnout, ensuring your well-being and productivity. You can set boundaries, prioritize self-care, and maintain a healthy work-life balance."
  },
]
const lottieDefaultOptions = {
  loop: false,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};

const RateCourse = ({course, setOpen, showConfetti, courseId}:{course:UserCourse, setOpen:Dispatch<SetStateAction<UserCourse | null>>, showConfetti:boolean, courseId?:string}) => {
  
  const [user] = useFirebaseUser(state => [state.user]);
  const router = useRouter();
  
  const [courseFound, setCourseFound] = useState<any>(null);
  const [rate, setRate] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  

  const handleSubmit = () =>{
    if(user && courseFound && courseId){
      setLoading(true);
      
      if(rate !== 0){
        const coursesRef = doc(db, "Courses", "f0KbKCMEAytfRvDuMa89");
        // We get live courses data
        getDoc(coursesRef)
        .then((docSnapshot: DocumentSnapshot) => {
  
          if (docSnapshot.exists()) {
            const parsedCourses = JSON.parse(docSnapshot.data().data);
            
            parsedCourses.map((co:Course) =>{
              if(co.id === courseId){
                console.log(co);
                
                if(co.rating?.length){
                  const validateRating = co.rating.find(el => el.user === user.uid!);
                  const userWantToUpdateRating = co.rating.filter(el => el.user !== user.uid!);
  
                  if(validateRating){
                    // Already rated, we ask if they want to rate it again.
                    toast.warning(`Hi ${user.displayName?.split(" ")[0]}`, {
                      description: `You already rated this course, do you want to rate it again?`,
                      closeButton: true,
                      action:{
                        label:"Yes",
                        onClick: ()=> {
                          // We rate again
                          userWantToUpdateRating.push({
                            user: user.uid!,
                            rate
                          });
                          co.rating = userWantToUpdateRating;
                        } 
                      }
                    })
                  }else{
                    co.rating?.push({
                      user: user.uid!,
                      rate
                    });
                  }
                }else{
                  // We add the rating directly
                  co.rating?.push({
                    user: user.uid!,
                    rate
                  });
                }
              }
            });

  
            // Update Courses Data with updated Students quantity
            updateDoc(coursesRef, {
              data: JSON.stringify(parsedCourses)
            })
            .then(()=> {
              toast.success("Thank you!", {
                description: `We have received your review. Congratulations on completing the ${courseFound.course} course!`,
                duration: 2000,
                closeButton: true,
              })
              setTimeout(()=>{
                router.push(`/enrollments`);
              },2000);
            })
            .catch(error => console.log(error))
  
          } else {
            console.log("No such document!");
          }
        }).catch((error) => {
          console.log("Error getting document:", error);
        })
        .finally(()=> {
          setLoading(false);
        })
      }else{
        toast.warning(`Hi ${user.displayName!.split(" ")[0]}!`, {
          description: `Please give this course a rate in order to proceed.`,
          duration: 3000,
          closeButton: true,
        })
      };
    };
  };

  useEffect(() => {
    if(course){
      const findCourse = descriptions.find(co => co.course === course.course);
      if(findCourse) setCourseFound(findCourse);
    }
  }, [course]);

  return ( 
    <article className="fixed top-0 left-0 w-full h-screen bg-black/10 z-30 myFlex p-3 px-5 phone:p-0">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed z-30 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
          <Lottie 
            isClickToPauseDisabled
            options={lottieDefaultOptions}
            height={400}
            width={400}
          />
        </div>
      )}

      <div className="w-full phone:w-[400px] bg-white shadow-md flex flex-col items-start justify-start source-sans p-5 rounded-lg">
        <h5 className="font-semibold text-[16px] mb-1 myFlex">
          Congratulations!
          <PiConfettiDuotone className="w-4 h-4 ml-2"/>
          <PiConfettiDuotone className="w-4 h-4 ml-1"/>
          <PiConfettiDuotone className="w-4 h-4 ml-1"/>
        </h5>
        <p className="text-[13px]">You have successfully completed the course <span className="text-[#DC4E27] font-semibold">{course?.course}</span>. {courseFound?.description}</p>
        <p className="text-[12px] font-semibold mt-5 mb-1">How would you rate this course?</p>
        
        <ReactStarsRating isHalf className="myFlex" size={17} onChange={(e:number)=> setRate(e)} value={rate} />
        <div className="flex items-center justify-start gap-x-3 w-full">
          <button 
            onClick={handleSubmit}
            className="text-white bg-[#DC4E27] w-[63.58px] h-[27.5px] myFlex text-[12px] tracking-wide rounded-sm mt-7"
          >
            {loading ? (
              <RiLoader5Fill className="w-4 h-4 animate-spin text-white"/>
            ):(
              "Submit"
            )}
          </button>
          <button 
            onClick={()=> router.push("/enrollments")}
            className="text-white bg-[#27333E] px-3 py-1 myFlex text-[12px] tracking-wide rounded-sm mt-7"
          >
            {"Don't"} rate
          </button>
        </div>
      </div>
    </article>
   );
}
 
export default RateCourse;