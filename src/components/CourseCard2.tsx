'use client'
import { Avatar, Button, Skeleton } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { IoPlayCircle } from "react-icons/io5";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import {Tooltip} from "@nextui-org/react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { TbProgress, TbProgressCheck } from "react-icons/tb";
import { Course, UserCourse } from "../../typings";
import { MouseEvent, useEffect, useState } from "react";
import { useFirebaseUser } from "@/store/store";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { RiLoader5Fill } from "react-icons/ri";
import ReactStarsRating from 'react-awesome-stars-rating';


const CourseCard2 = ({course}:{course: Course}) => {
  
  const router = useRouter();
  const [user] = useFirebaseUser(state => [state.user]);
  const [courseRate, setCourseRate] = useState<number | null>(null);
  const [courseInFavorites, setCourseInFavorites] = useState<boolean>(false);
  const [addingToFav, setAddingToFav] = useState<boolean>(false);
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
        updateDoc(userRef, {
          favorites: arrayRemove(alreadyInFavorites)
        })
        .finally(()=> setAddingToFav(false))
      }else{
        updateDoc(userRef, {
          favorites: arrayUnion(course)
        })
        .finally(()=> setAddingToFav(false))
      }
    }
  }

  useEffect(() => {
    let courseRating = 0;
    if(course.course){
      console.log(course);
      
      // Image
      setCardStyle({
        backgroundImage: `url(${course.image})`
      });

      // Rating
      if(course?.rating?.length){
        course?.rating?.map((co)=>{
          courseRating = courseRating + co.rate;
        });
        
        if(courseRating > 0 && course.rating.length > 1){
          return setCourseRate(Math.ceil(courseRating / course.rating.length));
        }else{
          return setCourseRate(Math.ceil(courseRating));
        }
      }else{
        setCourseRate(0);
      }
    }
  }, [course]);

  useEffect(() => {
    if(user){
      const courseInFav = user.favorites.find((co: UserCourse)=> co.id === course.id);
      if(courseInFav){
        setCourseInFavorites(true);
      }else{
        setCourseInFavorites(false);
      }
    }
  }, [user]);

  return ( 
    <div className="relative w-full group bg-white rounded-md shadow-lg overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300" onClick={()=> router.push(`/overview/${course.id}`)}>
      {/* Background Image */}
      <div style={cardStyle} className={`h-[250px] w-full rounded-t-md bg-cover bg-center`}></div>

      {/* Favorite Button */}
      <div className={`absolute top-3 right-3 myFlex flex-col gap-y-1.5 transition-all duration-300 z-30 ${!user && "hidden"}`}>
        {courseInFavorites ? (
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
        )}
      </div>
      
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
            <Avatar className="w-10 h-10" src={course.author.image} />
            <div className="flex items-start justify-center flex-col">
              <p className="poppins font-bold text-[12.5px] text-[#27333E]">{course.author.name}</p>
              <span className="poppins font-semibold text-[11px] text-[#DC4E27]">{course.author.profession}</span>
            </div>
          </div>

          {/* Students */}
          <div className="flex items-center justify-center flex-col sm:flex-row gap-x-1 poppins text-[11px] pl-3.5 sm:pl-5  border-l-1 border-gray-500/20">
            <span className="text-[#DC4E27]">{course.students.length}+</span>
            <span className="text-[#696868] hidden min-phone:flex">Students</span>
            <span className="text-[#696868] flex min-phone:hidden">Ss.</span>
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center justify-between pt-4">
          {courseRate === null ? (
            <Skeleton isLoaded={false} className="w-2/5 rounded-lg">
              <div className="myFlex gap-x-2">
                <ReactStarsRating isEdit={false} isHalf className="myFlex" size={15.5} onChange={()=> console.log("rated")} value={0} />
              </div>
            </Skeleton>
          ):(
            <div className="myFlex gap-x-2">
              <ReactStarsRating isEdit={false} isHalf className="myFlex" size={15.5} onChange={()=> console.log("rated")} value={courseRate} />
              <span className="poppins text-[10.5px] text-[#696868]">
                {`(${course?.rating?.length}+)`}
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
 
export default CourseCard2;