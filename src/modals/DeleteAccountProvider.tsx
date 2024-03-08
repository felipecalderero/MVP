'use client'

import { useFirebaseUser } from "@/store/store";
import { OAuthProvider, deleteUser, reauthenticateWithPopup, signOut } from "firebase/auth";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { auth, db } from "../../firebase";
import { useRouter } from "next/navigation";
import { RiLoader5Fill } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { slideAnimation } from "@/framer/motion";
import { motion } from "framer-motion";
import { deleteDoc, doc } from "firebase/firestore";

const DeleteAccountProvider = ({setOpen}:{setOpen:Dispatch<SetStateAction<boolean>>}) => {
  
  const [user, setUser] = useFirebaseUser(state => [state.user, state.setUser]);
  const currentUser = auth.currentUser;
  const router = useRouter();

  const [block, setBlock] = useState<boolean>(false);

  const [confirmText, setConfirmText] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  // TODO: Delete also from Users collections.
  const handleDeleteProvider = () =>{
    if(user && currentUser && confirmText === "permanently delete"){
      const provider = new OAuthProvider(user.provider!);
      reauthenticateWithPopup(currentUser, provider)
        .then((result) => {
          // If authenticated
          setDeleting(true);

          deleteUser(currentUser)
          .then(()=> {
            const userRef = doc(db, "Users", user.uid!);
            deleteDoc(userRef)
            .then(()=>{
              toast.success("Account deleted successfully!", {
                description: `${new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}`,
                duration: 3000,
                closeButton: true
              });
              setUser(null);
              signOut(auth);
              
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
        // If not authenticated
        .catch((error) => {
          toast.error("Please try again", {
            description: `Authentcation failed.`,
            duration: 3000,
            closeButton: true,
          })
        })
        .finally(()=> setDeleting(false))
    }
  }

  useEffect(() => {
    if(user && user.provider !== "password"){
      if(confirmText === "permanently delete"){
        setBlock(false);
      }else{
        setBlock(true);
      }
    }
  }, [confirmText, user]);

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
        <p className="text-sm mb-4">This action is irreversible and will delete your account permanently.</p>
        <div className="myFlex gap-x-2">
          <input 
            value={confirmText} 
            onChange={(e)=> setConfirmText(e.target.value)} 
            type="text" 
            placeholder="permanently delete" 
            className="bg-[#f5f5f5] rounded-sm w-full mt-[0.5px] px-3 border-[0.7px] border-transparent transition-all duration-300 h-[35px] flex flex-1 text-[13px] tracking-wide placeholder:text-[#585957] placeholder:opacity-80 placeholder:italic focus:border-danger focus:outline-none hover:border-danger" 
          />
      
          <button 
            className="h-[35px] w-[50px] rounded-sm myFlex bg-danger border-none text-white disabled:cursor-not-allowed"
            onClick={handleDeleteProvider}
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
 
export default DeleteAccountProvider;