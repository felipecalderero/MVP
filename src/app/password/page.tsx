'use client'

import Sections from "@/components/AccountSections";
import Footer from "@/components/Footer";
import PasswordGuide from "@/components/PasswordGuide";
import { Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { auth } from "../../../firebase";
import { EmailAuthProvider, reauthenticateWithCredential, signOut, updatePassword } from "firebase/auth";
import { RiLoader5Fill } from "react-icons/ri";
import { toast } from "sonner";
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation";
import { useFirebaseUser } from "@/store/store";
import withAuth from "@/components/WithAuth";
import { Helmet } from "react-helmet";


const initialForm = {
  oldPassword: "",
  newPassword1: "",
  newPassword2: ""
};

const Password = () => {

  const router = useRouter();
  const [user] = useFirebaseUser(state => [state.user]);
  const [form, setForm] = useState(initialForm);
  const currentUser = auth.currentUser;
  const [validPassword1, setValidPassword1] = useState<boolean>(false);
  const [updatingPassword, setUpdatingPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [blockPage, setBlockPage] = useState<boolean>(false);
  const [allow, setAllow] = useState<boolean>(false);


  const handleUpdate = () =>{
    if(!form.oldPassword || !form.newPassword1 || !form.newPassword2){
      return toast.warning("Whoops!", {
        description: `Please make sure to complete all fields.`,
        duration: 3000,
        closeButton: true,
      })
    };
    if(form.newPassword1 !== form.newPassword2){
      return toast.warning("Whoops!", {
        description: `Please make sure your passwords match.`,
        duration: 3000,
        closeButton: true,
      })
    };
    if(currentUser && form.oldPassword && form.newPassword1 && form.newPassword2 && validPassword1){
      setUpdatingPassword(true);

      const credential = EmailAuthProvider.credential(
        currentUser.email!, 
        form.oldPassword
      );
  
      reauthenticateWithCredential(currentUser, credential)
        .then(() => {
          // If old password is correct we update password
          updatePassword(currentUser, form.newPassword1)
          .then(()=> {
            // Confetti and redirect
            setForm(initialForm);

            toast.success("Password has been updated!", {
              description: `${new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}`,
              duration: 3000,
              closeButton: true
            })
          })
          .catch(error => console.log(error))
          })

        .catch(error => {
          // The old password is incorrect
          toast.error("Whoops!", {
            description: `It seems the old password you provided is incorrect.`,
            duration: 3000,
            closeButton: true,
          })
        })
        .finally(()=> setUpdatingPassword(false))
    };
    
  };
  
  useEffect(() => {
    if(user){
      if(user.provider !== 'password'){
        setBlockPage(true);
      }
    }
  }, [user]);

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
      <div className="min-h-screen flex flex-col items-start justify-center lato pt-[120px]">
        <Helmet title="Password | MMW"/>
  
        {/* Main */}
        <div className="flex items-center justify-start flex-col myContainer mx-auto flex-1 w-full">
          {/* Title */}
          {/* <h2 className="text-[22px] pb-12 md-xl:pb-20 font-light">
            Edit Profile
          </h2> */}
  
  
          <div className="flex flex-col md-xl:flex-row items-center md-xl:items-start justify-center md-xl:justify-between md-xl:gap-x-20 w-full pb-[40px]">
            {/* Sections */}
            <Sections/>
  
            {/* Form & Image upload */}
            <div className="h-full w-full flex items-start justify-start flex-col bg-white rounded-tr-2xl rounded-br-2xl">
              <h2 className="poppins text-2xl font-semibold tracking-wide mb-2">Security</h2>
              <span className="text-gray-500 text-[13px] poppins">Keep your account safe.</span>
  
              <div className="myFlex w-[80%] sm:w-[50%] pr-6 justify-between mt-14 mb-4 poppins tracking-wide text-lg font-semibold">
                Change your password
                <div className={`${blockPage && "hidden"}`}>
                  {showPassword ? (
                    <FaEyeSlash className="mt-[0.5px] w-5 h-5 cursor-pointer" onClick={()=> setShowPassword(!showPassword)}/>
                  ):(
                    <FaEye className="mt-[0.5px] w-5 h-5 cursor-pointer" onClick={()=> setShowPassword(!showPassword)}/>
                  )}
                </div>
              </div>
              <div className={`${blockPage ? "flex" : "hidden"} bg-danger-50 rounded-md p-1.5 mb-3`}>
                <p className="text-[12px] text-danger">If you signed up using Google, GitHub or Microsoft you {"can't"} change your password.</p>
              </div>
              <div className="w-full flex flex-col gap-y-5 sm:flex-row items-start justify-start gap-x-10">
                {/* Password Inputs */}
                <div className="mt-4 flex items-start justify-start flex-col gap-y-5 w-[80%] sm:w-[50%]">
                  <div className="w-full">
                    <Input
                      disabled={blockPage ? true : false}
                      fullWidth
                      type={`${showPassword ? "text" : "password"}`}
                      label="Old Password"
                      placeholder="#Abc12"
                      value={form.oldPassword}
                      description="Provide your old password so we know it's you."
                      onValueChange={(e)=> setForm({...form, oldPassword: e})}
                    />
                  </div>
                  <div className="w-full">
                    <Input
                      disabled={blockPage ? true : false}
                      fullWidth
                      type={`${showPassword ? "text" : "password"}`}
                      label="New Password"
                      placeholder="#Abc123"
                      value={form.newPassword1}
                      description="Follow our guide to create a safe password."
                      onValueChange={(e)=> setForm({...form, newPassword1: e})}
                    />
                  </div>
                  <div className="w-full">
                    <Input
                      disabled={blockPage ? true : false}
                      fullWidth
                      type={`${showPassword ? "text" : "password"}`}
                      label="Confirm New Password"
                      placeholder="#Abc123"
                      value={form.newPassword2}
                      description="Make sure your passwords match."
                      onValueChange={(e)=> setForm({...form, newPassword2: e})}
                    />
                  </div>
                  <button 
                    disabled={blockPage ? true : false}
                    onClick={handleUpdate} 
                    className="mt-3 bg-[#DC4E27] text-white poppins text-[12px] w-[72.53px] h-[38px] myFlex rounded-md myFlex gap-x-2 disabled:cursor-not-allowed"
                  >
                    
                    {updatingPassword ? (
                      <RiLoader5Fill className="animate-spin w-4 h-4 text-white"/>
                    ):(
                      <>
                        <FaLock className="w-3 h-3 text-white"/>
                        Save
                      </>
                    )}
                  </button>
                </div>
  
                {/* Password guide */}
                <div className="relative w-[95%] xs:w-[80%] sm:w-[50%] flex items-start justify-start flex-col gap-y-1 bg-gray-300/20 rounded-xl p-5">
                  <p className="poppins tracking-wide font-semibold text-[15px] mb-2">Password Guide</p>
                  <p className="poppins mb-1 text-gray-500 text-[13px] leading-6">Create a safe password by following this guide.</p>
                  {/* PASSWORD GUIDE */}
                  <PasswordGuide password={form.newPassword1} setValidPassword1={setValidPassword1}/>
  
                  {/* Image */}
                  <div className="absolute -bottom-5 -right-5">
                    <img src="/images/Password.svg" alt="" className="w-[120px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
  
        </div>
  
        {/* Footer */}
        <div className="w-full">
          <Footer/>
        </div>
      </div>
     );
  }
}
 
export default Password;