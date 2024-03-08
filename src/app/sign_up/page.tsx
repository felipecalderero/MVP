'use client'

import Footer from "@/components/Footer";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { db, auth } from "../../../firebase";
import { useFirebaseUser } from "@/store/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import withNoAuth from "@/components/WithNoAuth";
import { Helmet } from "react-helmet";

const errors = [
  {
    title:"Firebase: Error (auth/email-already-in-use).",
    render:"Email already in use"
  },
  {
    title:"Firebase: Password should be at least 6 characters (auth/weak-password).",
    render:"Password should be at least 6 characters."
  }
]

const SignUp = () => {

  const firstNameRef = useRef<HTMLInputElement | null>(null);
  const lastNameRef = useRef<HTMLInputElement | null>(null);
  const professionRef = useRef<HTMLInputElement | null>(null);
  const birthdayRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const [setUser] = useFirebaseUser(state => [state.setUser])
  const router = useRouter();
  const [validating, setValidating] = useState<boolean>(false);
  const [allow, setAllow] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const signUp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!emailRef.current?.value || !passwordRef.current?.value || !firstNameRef.current?.value || !lastNameRef.current?.value || !professionRef.current?.value){
      toast.warning("Please try again", {
        description: `You must complete all fields.`,
        duration: 3000,
        closeButton: true
      })
    };

    if(emailRef.current?.value && passwordRef.current?.value && firstNameRef.current?.value && lastNameRef.current?.value && professionRef.current?.value){
      setValidating(true);
      createUserWithEmailAndPassword(
        auth,
        emailRef.current!.value,
        passwordRef.current!.value
      )
      .then((userCredential) => {
        
        // Signed in 
        const user = userCredential.user;
        if(user.email){
          const customUser = {
            displayName: firstNameRef.current?.value + " " + lastNameRef.current?.value,
            image: "",
            email: emailRef.current?.value!,
            uid: user.uid,
            profession: professionRef.current?.value!,
            courses: [],
            favorites: [],
            provider: user.providerData[0].providerId
          };

          const sessionExist = localStorage.getItem("mmw-user");

          if(!sessionExist){
            localStorage.setItem("mmw-user", JSON.stringify(user));
          };

          // Add User to Firebase
          setDoc(doc(db, "Users", user.uid), customUser).
          then(()=> {
            setUser(customUser);
            toast.success("Account successfully created!", {
              description: `${new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}`,
              duration: 3000,
              closeButton: true
            })
            
            setTimeout(()=>{
              router.push("/")
            },3000);
          }).
          catch(error => {
            const errorMessage = error.message;
            toast.error("Whoops...!", {
              description: "Something went wrong, please try again later.",
              duration: 3000,
              closeButton: true
            })
            
          });
          
          
        };
        
        
        
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        errors.map(error => {
          if(error.title === errorMessage){
            toast.error("Please try again", {
              description: error.render,
              duration: 3000,
              closeButton: true
            })
          }
        })
      })
      .finally(()=> setValidating(false));
    }
  };

  useEffect(() => {
    const sessionExist = localStorage?.getItem("mmw-user");
    if(sessionExist){
      router.push("/")
    }else{
      setAllow(true);
    };  
  }, []);

  if(allow){
    return ( 
      <div className="relative min-h-screen flex flex-col items-start justify-center bg-[#f8f8f8] lato pt-[130px]">
        <Helmet title="Sign Up | MMW"/>

        {/* Shapes */}
        <div className="absolute bottom-5 -left-10 w-full z-20">
          <img src="/images/CircleShape.svg" alt="" className="w-[180px] xs:w-[200px] xl:w-[250px] opacity-90"/>
        </div>
        <div className="absolute top-10 right-10 z-20 -rotate-[45deg]">
          <img src="/images/LampShape.svg" alt="" className="xs-[250px] xs:w-[300px] xl:w-[400px]"/>
        </div>
        <div className="hidden xs:block absolute top-16 left-0 z-20">
          <img src="/images/WeirdShape.svg" alt="" className="w-[130px] xs:w-[180px] xl:w-[230px]"/>
        </div>
        <div className="absolute bottom-20 right-1 z-20">
          <img src="/images/WeirdShape2.svg" alt="" className="w-[130px] xs:w-[180px] xl:w-[230px]"/>
        </div>
  
        {/* Main */}
        <div className="myFlex flex-col myContainer mx-auto flex-1">
          {/* Title */}
          <h2 className="z-30 text-[32px] min-phone:text-[42px] font-semibold pb-5">
            Create Acccount
          </h2>
  
  
          {/* Form */}
          <form onSubmit={signUp} className="w-full phone:w-[400px] lg:w-[470px] bg-white z-30 p-3 phone:p-6 phone:pt-5 shadow-sm rounded-md myFlex flex-wrap gap-4">
            {/* First Name */}
            <div className="flex-grow">
              <span className="text-[11px] font-semibold">First Name</span>
              <input 
                ref={firstNameRef}
                type="text" 
                placeholder="First Name"
                className="bg-[#f5f5f5] w-full mt-[0.5px] px-3 border-[0.7px] border-transparent transition-all duration-300 h-[35px] flex flex-1 text-[13px] tracking-wide placeholder:text-[#585957] placeholder:opacity-80  focus:border-[#DC4E27] focus:outline-none hover:border-[#DC4E27]" 
              />
            </div>
            {/* Last Name */}
            <div className="flex-grow">
              <span className="text-[11px] font-semibold">Last Name</span>
              <input 
                ref={lastNameRef}
                type="text" 
                placeholder="Last Name"
                className="bg-[#f5f5f5] w-full mt-[0.5px] px-3 border-[0.7px] border-transparent transition-all duration-300 h-[35px] flex flex-1 text-[13px] tracking-wide placeholder:text-[#585957] placeholder:opacity-80  focus:border-[#DC4E27] focus:outline-none hover:border-[#DC4E27]" 
              />
            </div>
            {/* Profession */}
            <div className="flex-grow">
              <span className="text-[11px] font-semibold">Profession</span>
              <input 
                ref={professionRef}
                type="text" 
                placeholder="Profession"
                className="bg-[#f5f5f5] w-full mt-[0.5px] px-3 border-[0.7px] border-transparent transition-all duration-300 h-[35px] flex flex-1 text-[13px] tracking-wide placeholder:text-[#585957] placeholder:opacity-80  focus:border-[#DC4E27] focus:outline-none hover:border-[#DC4E27]" 
              />
            </div>
  
            {/* Email */}
            <div className="w-full">
              <span className="text-[11px] font-semibold">Email</span>
              <input 
                ref={emailRef}
                type="text" 
                placeholder="Email"
                className="bg-[#f5f5f5] w-full mt-[0.5px] px-3 border-[0.7px] border-transparent transition-all duration-300 h-[35px] flex flex-1 text-[13px] tracking-wide placeholder:text-[#585957] placeholder:opacity-80  focus:border-[#DC4E27] focus:outline-none hover:border-[#DC4E27]" 
              />
            </div>
  
            {/* Password */}
            <div className="w-full">
              <span className="text-[11px] font-semibold">Password</span>
              <div className="w-full relative">
                <input 
                  ref={passwordRef}
                  type={`${showPassword ? "text" : "password"}`} 
                  placeholder="Password"
                  className="bg-[#f5f5f5] w-full mt-[0.5px] px-3 border-[0.7px] border-transparent transition-all duration-300 h-[35px] flex flex-1 text-[13px] tracking-wide placeholder:text-[#585957] placeholder:opacity-80  focus:border-[#DC4E27] focus:outline-none hover:border-[#DC4E27]" 
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
            </div>
  
            {/* Accept Conditions */}
            <div className="w-full flex items-center justify-between mt-1">
              <div className="flex items-start justify-start gap-x-1.5">
                <input type="checkbox" id="rememberMe" className="w-[10px] mt-[2.5px]" />
                <label htmlFor="rememberMe" className="text-[11px] font-semibold">
                  I have read and agree to the <Link href="terms" className="text-[#585957] underline">Terms of Use</Link> and <Link href="/privacy_policy" className="text-[#585957] underline">Customer Privacy Policy</Link>.
                </label>
              </div>
             
            </div>
  
  
            {/* Sign In */}
            <div className="flex items-center justify-start w-full mt-1">
              <button 
                type="submit"
                className="myFlex bg-[#DC4E27] text-[13px] tracking-wider text-white border-[1.5px] border-[#DC4E27] rounded-full w-[76.71px] h-[35.3px]"
              >
                {validating ? (<AiOutlineLoading className="animate-spin w-4 h-4 text-white"/>):("Sign up")}
              </button>
            </div>
          </form>
  
  
          {/* Create a new account */}
          <div className="flex items-start justify-start w-full phone:w-[400px] lg:w-[470px] ml-1 text-[13px] mt-10 z-30">
            {"Already have an account?"}&nbsp;
            <Link href="/sign_in" className="text-[#DC4E27]">
              Click here.
            </Link>
          </div>
          
        </div>
  
  
        {/* Footer */}
        <div className="z-30 w-full pt-14">
          <Footer/>
        </div>
      </div>
    );
  }
}
 
export default SignUp;