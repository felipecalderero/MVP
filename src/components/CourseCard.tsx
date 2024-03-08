'use client'
import { Avatar, Button, Skeleton } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { IoPlayCircle } from "react-icons/io5";
import { IoIosCloseCircle, IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import {Tooltip} from "@nextui-org/react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { TbProgress, TbProgressCheck } from "react-icons/tb";
import { Course, UserCourse } from "../../typings";
import { MouseEvent, useEffect, useState } from "react";
import { useCourses, useFirebaseUser } from "@/store/store";
import { arrayRemove, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { RiLoader5Fill } from "react-icons/ri";
import { useCollection } from "react-firebase-hooks/firestore";
import ReactStarsRating from 'react-awesome-stars-rating';


const UserCourseCard = ({course, hideTooltip, favorite}:{course: UserCourse; hideTooltip?:boolean; favorite?: boolean}) => {
  
  const router = useRouter();
  const [courses] = useCourses(state => [state.courses]);
  const [user, setUser] = useFirebaseUser(state => [state.user, state.setUser]);
  
  const [courseRate, setCourseRate] = useState<number | null>(null);
  const [courseInFavorites, setCourseInFavorites] = useState<boolean>(false);
  const [addingToFav, setAddingToFav] = useState<boolean>(false);
  const [originalCourse, setOriginalCourse] = useState<Course | null>(null);
  const [cardStyle, setCardStyle] = useState({
    backgroundImage:""
  });

  const handleFavorites = (e:MouseEvent<HTMLDivElement, globalThis.MouseEvent>) =>{
    e.stopPropagation();
    if(user && course){
      setAddingToFav(true);
      const userRef = doc(db, "Users", user?.uid!);
      const alreadyInFavorites = user?.favorites.find((co: UserCourse)=> co.id === course.id);
      if(alreadyInFavorites){
        setUser({
          ...user,
          favorites: user.favorites.filter((co: UserCourse) => co.id === alreadyInFavorites.id)
        })
        updateDoc(userRef, {
          favorites: arrayRemove(alreadyInFavorites)
        })
        .finally(()=> setAddingToFav(false))
      }else{
        setUser({
          ...user,
          favorites: user.favorites.push(course)
        })
        updateDoc(userRef, {
          favorites: arrayUnion(course)
        })
        .finally(()=> setAddingToFav(false))
      }
    }
  }

  const handleDeleteFromFav = (e:MouseEvent<HTMLDivElement, globalThis.MouseEvent>) =>{
    e.stopPropagation();
    if(user && course){
      setAddingToFav(true);
      const userRef = doc(db, "Users", user?.uid!);
      const alreadyInFavorites = user?.favorites.find((co: UserCourse)=> co.id === course.id);
      if(alreadyInFavorites){
        setUser({
          ...user,
          favorites: user.favorites.filter((co: UserCourse) => co.id === alreadyInFavorites.id)
        })
        updateDoc(userRef, {
          favorites: arrayRemove(alreadyInFavorites)
        })
        .finally(()=> setAddingToFav(false))
      }
    }
  }


  useEffect(() => {
    let courseRating = 0;
    if(originalCourse && originalCourse.course){

      // Image
      setCardStyle({
        backgroundImage: `url(${originalCourse.image})`
      });

      // Rating
      if(originalCourse?.rating?.length){
        originalCourse?.rating?.map((co)=>{
          courseRating = courseRating + co.rate;
        });
        
        if(courseRating > 0 && originalCourse.rating.length > 1){
          return setCourseRate(Math.ceil(courseRating / originalCourse.rating.length));
        }else{
          return setCourseRate(Math.ceil(courseRating));
        }
      }else{
        setCourseRate(0);
      }
    }
  }, [originalCourse]);

  useEffect(() => {
    if(course && courses.length){
      console.log(course);
      
      courses.map((co:Course)=>{
        if(co.id === course.id){
          setOriginalCourse(co);
        }
      })
    }
  }, [course, courses]);

  useEffect(() => {
    if(user && course){
      if(user.favorites.length){
        const courseInFav = user.favorites?.find((co: UserCourse)=> co.id === course.id);
        if(courseInFav){
          setCourseInFavorites(true);
        }else{
          setCourseInFavorites(false);
        }
      }else{
        setCourseInFavorites(false)
      }
    }
  }, [user, course]);

  return ( 
    <div className="relative w-full group bg-white rounded-md shadow-lg overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300" onClick={()=> router.push(`/overview/${course.id}`)}>
      {/* Background Image */}
      <div style={cardStyle} className={`h-[250px] w-full rounded-t-md bg-cover bg-center`}></div>

      {/* Favorite Button */}
      <div className={`absolute top-3 right-3 myFlex flex-col gap-y-1.5 transition-all duration-300 z-30 cursor-default ${!user && "hidden"}`}>
        {favorite ? (
          <div className="w-fit myFlex" onClick={handleDeleteFromFav}>
            <IoIosCloseCircle className="w-[18px] h-[18px] text-white cursor-pointer"/>
          </div>
        ):(
          courseInFavorites ? (
            addingToFav ? (
              <RiLoader5Fill className="w-[18px] h-[18px] text-white cursor-pointer animate-spin"/>
            ):(
              <div className="w-fit myFlex" onClick={handleFavorites}>
                <IoMdHeart
                  className="w-[18px] h-[18px] text-white cursor-pointer"  
                />
              </div>
            )
          ):(
            addingToFav ? (
              <RiLoader5Fill className="w-[18px] h-[18px] text-white cursor-pointer animate-spin"/>
            ):(
              <div className="w-fit myFlex" onClick={handleFavorites}>
                <IoMdHeartEmpty 
                  className="w-[18px] h-[18px] text-white cursor-pointer"  
                />
              </div>
            )
          )
        )}

        {!hideTooltip && course.progress ? (
          <Tooltip 
            showArrow
            placement="right"
            content={
              <div className="myFlex flex-col gap-y-3">
                <p className="text-[12.5px] source-sans tracking-wide font-semibold">
                  {course.progress === 100 
                  ? <>Congrats! <br /> {"You've"} completed this course.</>
                  : <>Completed so far.</>}
                </p>

                {course.progress < 100 &&
                  <div className="w-[60px]">
                    <CircularProgressbar 
                      styles={buildStyles({
                        pathColor: "#DC4E27",
                        textColor: "#DC4E27",
                        strokeLinecap: "butt",
                        textSize: '17px'
                      })}
                      value={course?.progress} 
                      text={`${course?.progress}%`} 
                    />
                  </div>
                }
              </div>
            }
            classNames={{
              base: [
                // arrow color
                `${course.completed ? "before:bg-success dark:before:bg-success" : "before:bg-white dark:before:bg-white"}`,
              ],
              content: [
                "py-3 px-4 shadow-xl",
                `${course.completed ? "bg-success text-white" : "bg-white text-[#1f1f1f] "}`,
              ],
            }}
          > 
            <div className="myFlex w-fit">
              {course.progress === 100 ?
              (<TbProgressCheck className="w-[18px] h-[18px] text-success"/>) :
              (<TbProgress className="w-[18px] h-[18px] text-white"/>)}
            </div>
          </Tooltip>
        ):("")}
      </div>
      {/* <img src="/canvas/Coursy.svg" alt="" className="w-full h-auto" /> */}
      
      <div className="w-full h-full p-4">
        {/* Videos & Tag */}
        <div className="flex items-start justify-between">
          <div className="myFlex gap-x-1">
            <IoPlayCircle className="w-4 h-4 text-[#DC4E27]"/>
            <p className="poppins text-xs font-semibold text-[#696868]">{`${course?.steps?.length}x Videos`}</p>
          </div>
          <div className="text-[#DC4E27] font-semibold rounded-md bg-[#DC4E27]/10 px-3 py-1 text-[10.5px] sm:text-xs poppins">
            <p>Mental Health</p>
          </div>
        </div>

        {/* Title */}
        <p className="font-bold pt-5 pb-3 border-b-1 border-gray-500/10 tracking-wide text-[#27333E]">
          {course?.course?.length > 27 ? course.course.slice(0, 26) + "…" : course.course}
        </p>
      
        {/* Author & Students */}
        <div className="flex items-center justify-between py-4 border-b-1 border-gray-500/10">
          {/* Author */}
          <div className="flex items-center justify-between gap-x-2">
            <Avatar className="w-10 h-10" src={course?.author.image} />
            <div className="flex items-start justify-center flex-col">
              <p className="poppins font-bold text-[12.5px] text-[#27333E]">{course.author.name}</p>
              <span className="poppins font-semibold text-[11px] text-[#DC4E27]">{course.author.profession}</span>
            </div>
          </div>

          {/* Students */}
          <div className="flex items-center justify-center flex-col sm:flex-row gap-x-1 poppins text-[11px] pl-3.5 sm:pl-5  border-l-1 border-gray-500/20">
            <span className="text-[#DC4E27]">{originalCourse?.students.length}+</span>
            <span className="text-[#696868]">Students</span>
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center justify-between pt-4">
          {courseRate === null ? (
            <Skeleton isLoaded={false} className="w-2/5 rounded-lg">
              <div className="myFlex gap-x-2">
                <ReactStarsRating isEdit={false} isHalf className="myFlex" size={15.5} onChange={()=> console.log("rated")} value={courseRate} />
              </div>
            </Skeleton>
          ):(
            <div className="myFlex gap-x-2">
              <ReactStarsRating isEdit={false} isHalf className="myFlex" size={15.5} onChange={()=> console.log("rated")} value={courseRate} />
              <span className="poppins text-[10.5px] text-[#696868]">
                {`(${originalCourse?.rating?.length}+)`}
              </span>  
            </div>
          )}
          <p className="relative text-[#696868] font-semibold text-xs before:content-[''] before:w-full before:absolute before:bottom-0 before:rounded-full before:h-[1px] before:bg-[#696868]">
            Learn More+ 
          </p>
        </div>
      </div>
    </div>
   );
}
 
export default UserCourseCard;