'use client'
import { slideAnimation } from "@/framer/motion";
import { sendPasswordResetEmail } from "firebase/auth";
import {motion} from "framer-motion";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { auth } from "../../firebase";
import { RiLoader5Fill } from "react-icons/ri";
import { toast } from "sonner";

const ForgotModal = ({setOpen}:{setOpen:Dispatch<SetStateAction<boolean>>}) => {
  
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [sending, setSending] = useState<boolean>(false);

  const handleForgot = () =>{
    if(inputRef?.current?.value){
      setSending(true);
      sendPasswordResetEmail(auth, inputRef.current.value)
      .then(() => {
        // Password reset email sent!
        // ..
        toast.success("Done!", {
          description: `We sent you an email, follow the instructions and create a new password.`,
          duration: 3000,
          closeButton: true
        })

        setTimeout(()=>{
          setOpen(false);
        },3000)
        
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        toast.error("Whoops...!", {
          description: `Something went wrong. Please check if your email is correct.`,
          duration: 3000,
          closeButton: true
        })
        
        // ..
      })
      .finally(()=>{
        setSending(false)
      })
    }
  };

  return ( 
    <article 
      className="fixed top-0 left-0 w-full h-screen bg-black/10 z-40 myFlex px-3.5 phone:px-0 source-sans"
      onClick={()=> setOpen(false)}
    >
      <motion.div 
        {...slideAnimation("up")}
        className="w-full p-6 phone:w-[400px] bg-white shadow-md rounded-md"
        onClick={(e)=> e.stopPropagation()}
      >
        <h5 className="font-semibold text-lg">Forgot your password?</h5>
        <p className="text-sm mb-4">{"Don't"} worry, we will send you an email so you can create a new one!</p>
        <div className="myFlex gap-x-2">
          <input ref={inputRef} type="email" placeholder="you@example.com" className="bg-[#f5f5f5] rounded-sm w-full mt-[0.5px] px-3 border-[0.7px] border-transparent transition-all duration-300 h-[35px] flex flex-1 text-[13px] tracking-wide placeholder:text-[#585957] placeholder:opacity-80  focus:border-[#DC4E27] focus:outline-none hover:border-[#DC4E27]" />
          <button 
            className="h-[35px] w-[50px] rounded-sm myFlex bg-[#DC4E27] border-none text-white"
            onClick={handleForgot}
          >
            {sending ? (
              <RiLoader5Fill className="w-4 h-4 animate-spin text-white"/>
            ):(
              <IoSend className="w-3.5 h-3.5 text-white" />
            )}
          </button>
        </div>
      </motion.div>
    </article>
   );
}
 
export default ForgotModal;