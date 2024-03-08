'use client'
import { slideAnimation } from "@/framer/motion";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { RiLoader5Fill } from "react-icons/ri";
import { toast } from "sonner";
import { auth, db } from "../../firebase";
import { EmailAuthProvider, OAuthProvider, deleteUser, reauthenticateWithCredential, reauthenticateWithPopup, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFirebaseUser } from "@/store/store";
import { deleteDoc, doc } from "firebase/firestore";

const DeleteAccount = ({setOpen}:{setOpen:Dispatch<SetStateAction<boolean>>}) => {
  
  const currentUser = auth.currentUser;
  const [user, setUser] = useFirebaseUser(state => [state.user, state.setUser]);

  const router = useRouter();

  const [deleting, setDeleting] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // TODO: Delete also from Users collections.
  const handleDelete = () =>{
    if(currentUser && user){
      setDeleting(true);

      const credential = EmailAuthProvider.credential(
        currentUser.email!, 
        text
      );
  
      reauthenticateWithCredential(currentUser, credential)
      .then(() => {
        // If old password is correct we delete accunt
        deleteUser(currentUser)
        .then(async()=> {
          const userRef = doc(db, "Users", user.uid!);
          await deleteDoc(userRef)
          .then(()=>{
            toast.success("Account deleted successfully!", {
              description: `${new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}`,
              duration: 3000,
              closeButton: true
            });
            const sessionExist = localStorage.getItem("mmw-user");

            if(sessionExist){
              localStorage.removeItem("mmw-user");
            };
            signOut(auth);
            setUser(null);
            
            setTimeout(()=>{
              router.push("/sign_in")
            },3000);
          })
        })
        .catch(error => {
          toast.error("Whoops...!", {
            description: `Something went wrong deleting your account, please try again later.`,
            duration: 3000,
            closeButton: true,
          })
        })
      })
      // The old password is incorrect
      .catch(error => {
        toast.error("Please try again", {
          description: `Invalid Password.`,
          duration: 3000,
          closeButton: true,
        })
      })
      .finally(()=> setDeleting(false))
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
        <h5 className="font-semibold text-lg text-danger">Delete Account</h5>
        <p className="text-sm mb-4">This action is irreversible and will delete your account permanently. Provide your account password in order to delete your account.</p>
        <div className="myFlex gap-x-2">
          <div className="w-full relative">
            <input 
              value={text} 
              onChange={(e)=> setText(e.target.value)} 
              type={`${showPassword ? "text" : "password"}`} 
              placeholder="Your password" 
              className="bg-[#f5f5f5] rounded-sm w-full mt-[0.5px] px-3 border-[0.7px] border-transparent transition-all duration-300 h-[35px] flex flex-1 text-[13px] tracking-wide placeholder:text-[#585957] placeholder:opacity-80 placeholder:italic focus:border-danger focus:outline-none hover:border-danger" 
            />
            {/* Show password */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              {showPassword ? (
                <FaEyeSlash className="mt-[0.5px] w-3.5 h-3.5 cursor-pointer" onClick={()=> setShowPassword(!showPassword)}/>
              ):(
                <FaEye className="mt-[0.5px] w-3.5 h-3.5 cursor-pointer" onClick={()=> setShowPassword(!showPassword)}/>
              )}
            </div>
          </div>
          

          <button 
            className="h-[35px] w-[50px] rounded-sm myFlex bg-danger border-none text-white disabled:cursor-not-allowed"
            onClick={handleDelete}
          >
            {deleting ? (
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
 
export default DeleteAccount;